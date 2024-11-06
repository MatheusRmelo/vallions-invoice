import MainCard from 'ui-component/cards/MainCard';
import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { DataGrid } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
// Columns for DataGrid
const columns = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'Descrição Tabela de Valores', headerName: 'Descrição do Procedimento', width: 300 },
    { field: 'Editar', headerName: 'Editar', width: 170, renderCell: () => <Edit color="primary" /> },
    { field: 'Inativo/Ativo', headerName: 'Inativo/Ativo', width: 170, renderCell: () => <Switch /> }
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
    return (
        <>
            <MainCard title="Cadastro de Procedimentos">
                <Box display="flex" justifyContent="space-between">
                    <TextField
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
                        }}
                    />
                    <Fab size="small" color="primary" aria-label="add">
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
                        '& .MuiDataGrid-cell': { borderBottom: 'none', fontSize: '10px' },
                        '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', fontSize: '12px' },
                        '& .MuiDataGrid-footerContainer': { borderTop: 'none' }
                    }}
                >
                    <DataGrid disableRowSelectionOnClick rows={mockRows} columns={columns} />
                </Box>
            </MainCard>
        </>
    );
};

export default TableOfValues;
