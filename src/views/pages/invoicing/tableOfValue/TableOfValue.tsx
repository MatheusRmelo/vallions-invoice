import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Box } from '@mui/material';
import CustomTextField from 'ui-component/inputs/customSearchTextField';
import Search from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import TableOfValueForm from './TableOfValueForm';
// Columns for DataGrid
const columns = [
    { field: 'id', headerName: 'ID', flex: 2 },
    { field: 'Descrição Tabela de Valores', headerName: 'Descrição do Procedimento', flex: 3 },
    { field: 'Editar', headerName: 'Editar', flex: 1, renderCell: () => <Edit color="primary" /> },
    { field: 'Inativo/Ativo', headerName: 'Inativo/Ativo', flex: 1, renderCell: () => <Switch /> }
];

const mockRows = [
    {
        id: 1,
        'Descrição Tabela de Valores': 'Tabela de Valores 1'
    },
    {
        id: 2,
        'Descrição Tabela de Valores': 'Tabela de Valores 2'
    },
    {
        id: 3,
        'Descrição Tabela de Valores': 'Tabela de Valores 3'
    },
    {
        id: 4,
        'Descrição Tabela de Valores': 'Tabela de Valores 4'
    }
];

const TableOfValues = () => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <MainCard title="Cadastro de Procedimentos">
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
                    <DataGrid disableRowSelectionOnClick rows={mockRows} columns={columns} />
                </Box>

                <TableOfValueForm open={open} handleClose={handleClose} />
            </MainCard>
        </>
    );
};

export default TableOfValues;
