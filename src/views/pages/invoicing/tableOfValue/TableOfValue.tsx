import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Box } from '@mui/material';
import CustomTextField from 'ui-component/inputs/customSearchTextField';
import Search from '@mui/icons-material/Search';
import { DataGrid, GridRowId, GridActionsCellItem } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import TableOfValueForm from './TableOfValueForm';
import { TableOfValue, parseTableOfValues, getMockTableOfValues } from 'types/tableOfValue';
import useAPI from 'hooks/hooks';
const TableOfValues = () => {
    const [open, setOpen] = React.useState(false);
    const { get, put } = useAPI();
    const handleOpen = () => {
        setOpen(true);
    };

    const [tableOfValues, setTableOfValues] = React.useState<TableOfValue[]>([]);
    const [error, setError] = React.useState<string | null>(null);

    const [tableOfValue, setTableOfValue] = React.useState<TableOfValue | null>(null);
    const getTableById = (id: GridRowId) => {
        let rows = tableOfValues;
        let filtered = rows.filter((element) => element.id === id.valueOf());
        if (filtered.length === 0) return null;
        return filtered[0];
    };
    const handleClickEdit = (id: GridRowId) => {
        setTableOfValue(getTableById(id));
        setOpen(true);
    };

    const handleStatusChange = async (id: GridRowId) => {
        const tableOfValue = getTableById(id);
        if (tableOfValue) {
            const response = await put(`/api/medical-procedure-costs/${tableOfValue.id}`, {
                status: tableOfValue.status === 1 ? 0 : 1
            });
            if (response.ok) {
                fetchTableOfValues();
            } else {
                setError(response.message);
            }
        }
    };

    const fetchTableOfValues = async () => {
        const response = await get('/api/medical-procedure-costs');
        if (response.ok) {
            const data = await response.result;
            setTableOfValues(parseTableOfValues(data));
        } else {
            setError(response.message);
        }

        if (true) {
            setTableOfValues(getMockTableOfValues());
        }
    };

    React.useEffect(() => {
        fetchTableOfValues();
    }, []);

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <MainCard title="Tabela de Valores">
                <Box display="flex" justifyContent="space-between">
                    <CustomTextField label="Search" prefixIcon={<Search sx={{ color: 'action.active', mr: 1 }} />} />

                    <Fab size="small" color="primary" aria-label="add" onClick={handleOpen}>
                        <AddIcon />
                    </Fab>
                </Box>
                <Box m="8px 0 0 0" width="100%" height="01vh" />
                <Box
                    m="8px 0 0 0"
                    width="100%"
                    height="80vh"
                    sx={{
                        '& .MuiDataGrid-root': { border: 'none' },
                        '& .MuiDataGrid-cell': { borderBottom: 'none', fontSize: '1.2vh' },
                        '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', fontSize: '1.5vh' },
                        '& .MuiDataGrid-footerContainer': { borderTop: 'none' }
                    }}
                >
                    <DataGrid
                        disableRowSelectionOnClick
                        rows={tableOfValues.map((tableOfValue) => ({
                            id: tableOfValue.id,
                            'Descrição Tabela de Valores': tableOfValue.description,
                            Editar: '',
                            'Inativo/Ativo': '',
                            Excluir: ''
                        }))}
                        columns={[
                            { field: 'id', headerName: 'ID', flex: 2 },
                            { field: 'Descrição Tabela de Valores', headerName: 'Descrição do Procedimento', flex: 2 },
                            {
                                field: 'Editar',
                                headerName: 'Editar',
                                flex: 1,
                                getActions: ({ id }: { id: GridRowId }) => {
                                    return [
                                        <GridActionsCellItem
                                            icon={<Edit color="primary" />}
                                            label="Editar"
                                            className="textPrimary"
                                            onClick={() => handleClickEdit(id)}
                                            color="inherit"
                                        />
                                    ];
                                }
                            },
                            {
                                field: 'Inativo/Ativo',
                                headerName: 'Inativo/Ativo',
                                flex: 1,
                                getActions: ({ id }: { id: GridRowId }) => {
                                    return [
                                        <GridActionsCellItem
                                            icon={<Switch color="primary" checked={getTableById(id)?.status === 1} />}
                                            label="Inativo/Ativo"
                                            className="textPrimary"
                                            onClick={() => handleStatusChange(id)}
                                            color="inherit"
                                        />
                                    ];
                                }
                            }
                        ]}
                    />
                </Box>

                <TableOfValueForm open={open} handleClose={handleClose} tableOfValue={tableOfValue} />
            </MainCard>
        </>
    );
};

export default TableOfValues;
