import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Search from '@mui/icons-material/Search';
import Edit from '@mui/icons-material/Edit';
import { Box, CircularProgress, SnackbarCloseReason } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Switch from '@mui/material/Switch';
import CustomTextField from 'ui-component/inputs/customSearchTextField';
import ProcedureForm from './ProcedureForm';
import useAPI from 'hooks/hooks';
import { Procedure, getMockProcedures, parseProcedure } from 'types/procedure';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeMode } from 'types/config';
import useConfig from 'hooks/useConfig';
import SnackBarAlert from 'ui-component/SnackBarAlert';

const ProcedureView = () => {
    const [open, setOpen] = useState(false);
    const [procedure, setProcedure] = useState<Procedure | null>(null);
    const { get, put } = useAPI();
    const [data, setData] = useState<Procedure[]>([]);
    const { mode } = useConfig();
    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProcedures();
    }, []);


    const getProcedures = async () => {
        setLoading(true);
        const response = await get('/api/billingProcedure');
        if (response.ok) {
            setData(response.result.map((item: any) => parseProcedure(item)));
        } else {
            setOpenErrorSnack(true);
            setMessageSnack(response.message);
        }

        //TODO - REMOVE AFTER CONNECT API
        if (true) {
            setData(getMockProcedures());
        }
        setLoading(false);
    };

    const getProcedureById = (id: GridRowId) => {
        let filtered = data.filter((element) => element.id === id.valueOf());
        if (filtered.length === 0) return null;
        return filtered[0];
    };

    const handleClickOpen = () => {
        setProcedure(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickEdit = (id: GridRowId) => {
        setProcedure(getProcedureById(id));
        setOpen(true);
    };

    const handleChangeStatus = async (id: GridRowId) => {
        var newArray = [...data];
        var found: number = -1;
        for (let i = 0; i < newArray.length; i++) {
            var element = newArray[i];
            if (element.id == id.valueOf()) {
                newArray[i].status = !element.status;
                found = i;
            }
        }
        if (found != -1) {
            setData(newArray);
            await put(`/api/billingProcedure/${id.valueOf()}`, {
                ...newArray[found]
            });
        }
    }

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpenErrorSnack(false);
    };


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
                    {
                        loading ? <Box sx={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                            : <DataGrid
                                disableRowSelectionOnClick
                                rows={data.map((item) => ({
                                    ...item,
                                    institute: item.institute.join(', '),
                                }))}
                                columns={[
                                    {
                                        field: 'id',
                                        headerName: 'ID',
                                        flex: 2,
                                        renderHeader: () => <strong style={{ fontSize: '12px' }}>ID</strong>
                                    },
                                    {
                                        field: 'description',
                                        headerName: 'Descrição do Procedimento',
                                        flex: 2,
                                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Descrição do Procedimento</strong>
                                    },
                                    {
                                        field: 'codeCbhpm',
                                        headerName: 'Código CBHPM',
                                        flex: 2,
                                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Código CBHPM</strong>
                                    },
                                    {
                                        field: 'institute',
                                        headerName: 'Instituição',
                                        flex: 2,

                                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Instituição</strong>
                                    },
                                    {
                                        field: 'modality',
                                        headerName: 'Modalidade',
                                        flex: 2,
                                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Modalidade</strong>
                                    },
                                    {
                                        field: 'actions',
                                        type: 'actions',
                                        headerName: 'Editar',
                                        flex: 1,
                                        cellClassName: 'actions',
                                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Editar</strong>,

                                        getActions: ({ id }) => {
                                            return [
                                                <GridActionsCellItem
                                                    icon={<Edit sx={{ color: 'black' }} />}
                                                    label="Editar"
                                                    className="textPrimary"
                                                    onClick={() => handleClickEdit(id)}
                                                    color="inherit"
                                                />
                                            ];
                                        }
                                    },
                                    {
                                        type: 'actions',
                                        field: 'status',
                                        headerName: 'Inativo/Ativo',
                                        flex: 2,
                                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Inativo/Ativo</strong>,
                                        getActions: ({ id }) => {
                                            let procedure = getProcedureById(id);
                                            return [<Switch checked={procedure?.status ?? false} onChange={(value) => handleChangeStatus(id)} />];
                                        }
                                    }
                                ]}
                            />
                    }

                </Box>
            </MainCard>
            <ProcedureForm open={open} handleClose={handleClose} procedureEdit={procedure} />
            <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={handleCloseSnack} />
        </>
    );
};

export default ProcedureView;
