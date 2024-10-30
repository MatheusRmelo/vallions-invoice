// material-ui
// import Typography from '@mui/material/Typography';

// project imports
import * as React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import Edit from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// ==============================|| Procedure PAGE ||============================== //

const columns: GridColDef<(typeof rows)[number]>[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 170
    },
    {
        field: 'Descrição do Procedimento',
        headerName: 'Descrição do Procedimento',
        width: 170
    },
    {
        field: 'Código CBHPM',
        headerName: 'Código CBHPM',
        width: 170
    },
    {
        field: 'Instituição',
        headerName: 'Instituição',
        width: 170
    },
    {
        field: 'Modalidade',
        headerName: 'Modalidade',
        width: 170
    },
    {
        field: 'Editar',
        headerName: 'Editar',
        width: 170,
        renderCell: () => <Edit color="primary" />
    },
    {
        field: 'Inativo/Ativo',
        headerName: 'Inativo/Ativo',
        width: 170,
        renderCell: () => <Switch />
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
        'Inativo/Ativo': 'Ativo'
    },
    {
        id: 2,
        'Descrição do Procedimento': 'Procedimento 2',
        'Código CBHPM': '123457',
        Instituição: 'Instituição 2',
        Modalidade: 'Modalidade 2',
        'Inativo/Ativo': 'Ativo'
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
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <MainCard title="Cadastro de Procedimentos">
                <Box display="flex" justifyContent="space-between">
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
                    <Fab size="small" color="primary" aria-label="add" onClick={handleClickOpen}>
                        <AddIcon />
                    </Fab>
                </Box>
                <Box m="8px 0 0 0" width="100%" height="01vh" />
                <Box
                    m="8px 0 0 0"
                    width="100%"
                    height="80vh"
                    sx={{
                        '& .MuiDataGrid-root': {
                            border: 'none'
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none',
                            fontSize: '10px'
                        },
                        '& .name-column--cell': {},
                        '& .MuiDataGrid-columnHeaders': {
                            borderBottom: 'none',
                            fontSize: '12px'
                        },
                        '& .MuiDataGrid-virtualScroller': {},
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: 'none'
                        },
                        '& .MuiCheckbox-root': {},
                        '& .MuiDataGrid-toolbarContainer .MuiButton-text': {}
                    }}
                >
                    <DataGrid rows={rows} columns={columns} />
                </Box>
            </MainCard>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={'md'}
                fullWidth={true}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const email = formJson.email;
                        console.log(email);
                        handleClose();
                    }
                }}
            >
                <DialogTitle>Procedimentos</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Cadastro de Procedimento: Insira todas as informações necessárias para o procedimento, incluindo descrição, código,
                        instituição e modalidade. Verifique se os dados estão corretos antes de salvar. Confirme se deseja cadastrar este
                        procedimento.
                    </DialogContentText>
                    <Box display="flex" justifyContent="space-between" gap={2}>
                        <Box width="50vh">
                            <TextField
                                autoFocus
                                required
                                label="Descrição do Procedimento"
                                name="description"
                                variant="outlined"
                                fullWidth
                            />
                        </Box>
                        <TextField required label="Código CBHPM" name="code" variant="outlined" />
                    </Box>
                    <Box height={10} />
                    <Box display="flex" justifyContent="space-between" gap={2}>
                        <Box width="50vh">
                            <TextField
                                autoFocus
                                required
                                label="Descrição do Procedimento"
                                name="description"
                                variant="outlined"
                                fullWidth
                            />
                        </Box>
                        <TextField required label="Código CBHPM" name="code" variant="outlined" />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Fab size="small" color="primary" aria-label="add" type="submit">
                        <AddIcon />
                    </Fab>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Procedure;
