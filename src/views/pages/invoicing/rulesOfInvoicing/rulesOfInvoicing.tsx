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
import RulesOfInvoicingForm from './rulesOfInvoicingForm';
// Columns for DataGrid
const columns = [
    { field: 'rulesDescription', headerName: 'Descrição Regra', flex: 2 },
    { field: 'intituição', headerName: 'Instituição', flex: 3 },
    { field: 'unidade', headerName: 'Unidade', flex: 1 },
    //
    { field: 'editar', headerName: 'Editar', flex: 1, renderCell: () => <Edit color="primary" /> },
    { field: 'Inativo/Ativo', headerName: 'Inativo/Ativo', flex: 1, renderCell: () => <Switch /> }
];

const mockRows = [
    {
        id: 1,
        rulesDescription: 'Regra 1',
        intituição: 'Instituição 1',
        unidade: 'Unidade 1'
    },
    {
        id: 2,
        rulesDescription: 'Regra 2',
        intituição: 'Instituição 2',
        unidade: 'Unidade 2'
    },
    {
        id: 3,
        rulesDescription: 'Regra 3',
        intituição: 'Instituição 3',
        unidade: 'Unidade 3'
    },
    {
        id: 4,
        rulesDescription: 'Regra 4',
        intituição: 'Instituição 4',
        unidade: 'Unidade 4'
    }
];

const RulesOfInvoicing = () => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <MainCard title="Regras de Faturamento">
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
                <RulesOfInvoicingForm open={open} onClose={handleClose} />
            </MainCard>
        </>
    );
};

export default RulesOfInvoicing;
