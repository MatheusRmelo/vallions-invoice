import * as React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Search from '@mui/icons-material/Search';
import Edit from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Switch from '@mui/material/Switch';
import CustomTextField from 'ui-component/inputs/customSearchTextField';
import ProcedureForm from './ProcedureForm';


// Mocked rows
const rows = [
    {
        id: 1,
        'Descrição do Procedimento': 'Procedimento 1',
        'Código CBHPM': '123456',
        Instituição: 'Instituição 1',
        Modalidade: 'Modalidade 1',
        'Inativo/Ativo': 'Ativo'
    },
    {
        id: 2,
        'Descrição do Procedimento': 'Procedimento 2',
        'Código CBHPM': '123457',
        Instituição: 'Instituição 2',
        Modalidade: 'Modalidade 2',
        'Inativo/Ativo': 'Inativo'
    },
    {
        id: 3,
        'Descrição do Procedimento': 'Procedimento 3',
        'Código CBHPM': '123458',
        Instituição: 'Instituição 3',
        Modalidade: 'Modalidade 3',
        'Inativo/Ativo': 'Ativo'
    },
    {
        id: 4,
        'Descrição do Procedimento': 'Procedimento 4',
        'Código CBHPM': '123459',
        Instituição: 'Instituição 4',
        Modalidade: 'Modalidade 4',
        'Inativo/Ativo': 'Ativo'
    },
    {
        id: 5,
        'Descrição do Procedimento': 'Procedimento 5',
        'Código CBHPM': '123460',
        Instituição: 'Instituição 5',
        Modalidade: 'Modalidade 5',
        'Inativo/Ativo': 'Ativo'
    }
];

const Procedure = () => {
    const [open, setOpen] = React.useState(false);
    const [procedure, setProduce] = React.useState<any>(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickEdit = (id: GridRowId) => {
        setProduce(getProcedureById(id));
        setOpen(true);
    }

    const getProcedureById = (id: GridRowId) => {
        let filtered = rows.filter((element) => element.id == id.valueOf());
        if (filtered.length == 0) return null;
        return filtered[0];
    }

    return (
        <>
            <MainCard title="Cadastro de Procedimentos">
                <Box display="flex" justifyContent="space-between">
                    <CustomTextField label="Search" prefixIcon={<Search sx={{ color: 'action.active', mr: 1 }} />} />
                    <Fab size="small" color="primary" aria-label="add" onClick={handleClickOpen}>
                        <AddIcon />
                    </Fab>
                </Box>
                <Box m="8px 0 0 0" width="100%" height="1vh" />
                <Box
                    m="8px 0 0 0"
                    width="100%"
                    height="80vh"
                    sx={{
                        '& .MuiDataGrid-root': { border: 'none' },
                        '& .MuiDataGrid-cell': { borderBottom: 'none', fontSize: '10px' },
                        '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', fontSize: '12px' },
                        '& .MuiDataGrid-footerContainer': { borderTop: 'none' }
                    }}
                >
                    <DataGrid
                        disableRowSelectionOnClick rows={rows} columns={[
                            { field: 'id', headerName: 'ID', width: 170 },
                            { field: 'Descrição do Procedimento', headerName: 'Descrição do Procedimento', width: 170 },
                            { field: 'Código CBHPM', headerName: 'Código CBHPM', width: 170 },
                            { field: 'Instituição', headerName: 'Instituição', width: 170 },
                            { field: 'Modalidade', headerName: 'Modalidade', width: 170 },
                            {
                                field: 'actions',
                                type: 'actions',
                                headerName: 'Editar',
                                width: 100,
                                cellClassName: 'actions',
                                getActions: ({ id }) => {
                                    return [
                                        <GridActionsCellItem
                                            icon={<Edit color="primary" />}
                                            label="Editar"
                                            className="textPrimary"
                                            onClick={() => handleClickEdit(id)}
                                            color="inherit"
                                        />,
                                    ];
                                },
                            },
                            {
                                type: 'actions',
                                field: 'Inativo/Ativo', headerName: 'Inativo/Ativo', width: 170,
                                getActions: ({ id }) => {
                                    let procedure = getProcedureById(id);
                                    return [
                                        <Switch checked={procedure?.['Inativo/Ativo'] == 'Ativo'} />,
                                    ];
                                },
                            }
                        ]}

                    />
                </Box>
            </MainCard>

            <ProcedureForm open={open} handleClose={handleClose} />
        </>
    );
};

export default Procedure;
