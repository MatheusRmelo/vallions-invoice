// material-ui
// import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import type { } from '@mui/x-data-grid/themeAugmentation';

// ==============================|| Procedure PAGE ||============================== //

const columns: GridColDef<(typeof rows)[number]>[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 90
    },
    {
        field: 'Descrição do Procedimento',
        headerName: 'Descrição do Procedimento',
        width: 150
    },
    {
        field: 'Código CBHPM',
        headerName: 'Código CBHPM',
        width: 100
    },
    {
        field: 'Instituição',
        headerName: 'Instituição',
        width: 120
    },
    {
        field: 'Modalidade',
        headerName: 'Modalidade',
        width: 120
    },
    {
        field: 'Editar',
        headerName: 'Editar',
        width: 120
    },
    {
        field: 'Inativo/Ativo',
        headerName: 'Inativo/Ativo',
        width: 120
    }
];

// Mocked Row. TODO: Implementar a chamada da API para popular a tabela
const rows = [
    {
        id: 1,
        'Descrição do Procedimento': 'Procedimento 1',
        'Código CBHPM': '123456',
        Instituição: 'Instituição 1',
        Modalidade: 'Modalidade 1',
        Editar: 'Editar',
        'Inativo/Ativo': 'Ativo'
    },
    {
        id: 2,
        'Descrição do Procedimento': 'Procedimento 2',
        'Código CBHPM': '123457',
        Instituição: 'Instituição 2',
        Modalidade: 'Modalidade 2',
        Editar: 'Editar',
        'Inativo/Ativo': 'Ativo'
    },
    {
        id: 3,
        'Descrição do Procedimento': 'Procedimento 3',
        'Código CBHPM': '123458',
        Instituição: 'Instituição 3',
        Modalidade: 'Modalidade 3',
        Editar: 'Editar',
        'Inativo/Ativo': 'Ativo'
    },
    {
        id: 4,
        'Descrição do Procedimento': 'Procedimento 4',
        'Código CBHPM': '123459',
        Instituição: 'Instituição 4',
        Modalidade: 'Modalidade 4',
        Editar: 'Editar',
        'Inativo/Ativo': 'Ativo'
    },
    {
        id: 5,
        'Descrição do Procedimento': 'Procedimento 5',
        'Código CBHPM': '123460',
        Instituição: 'Instituição 5',
        Modalidade: 'Modalidade 5',
        Editar: 'Editar',
        'Inativo/Ativo': 'Ativo'
    }
];

const Procedure = () => {
    return (
        <>
            <MainCard title="Cadastro de Procedimentos">
                <TextField /// TODO: Pedi orientação para implementar o layout do label "search" inside do textfield
                    id="input-with-icon-textfield"
                    variant="outlined"
                    label="Search"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Box display="flex" alignItems="center">
                                    <Search sx={{ color: 'action.active', mr: 1 }} />
                                </Box>
                            </InputAdornment>
                        )
                        // <Search sx={{ color: 'action.active', mr: 0, my: 0.5 }} />
                    }}
                />
                <Box
                    m="8px 0 0 0"
                    width="100%"
                    height="80vh"
                    sx={{
                        '& .MuiDataGrid-root': {
                            border: 'none'
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none'
                        },
                        '& .name-column--cell': {},
                        '& .MuiDataGrid-columnHeaders': {
                            borderBottom: 'none'
                        },
                        '& .MuiDataGrid-virtualScroller': {},
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: 'none'
                        },
                        '& .MuiCheckbox-root': {},
                        '& .MuiDataGrid-toolbarContainer .MuiButton-text': {}
                    }}
                >
                    <DataGrid rows={rows} columns={columns} components={{ Toolbar: GridToolbar }} />
                </Box>
            </MainCard>
        </>
    );
};

export default Procedure;
