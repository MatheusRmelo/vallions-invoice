import React, { useState } from 'react';

export interface ColumnProps<T> {
    key: keyof T;
    header: string;
}

interface DataGridProps<T> {
    data: T[];
    columns: ColumnProps<T>[];
}
const DataGrid = <T,>({ data, columns }: DataGridProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

    const sortedData = React.useMemo(() => {
        let sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const requestSort = (key: keyof T) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={String(column.key)} onClick={() => requestSort(column.key)}>
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column) => (
                                <td key={String(column.key)}>{String(row[column.key])}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage * rowsPerPage >= data.length}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default DataGrid;
