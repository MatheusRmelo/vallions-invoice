import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Search from '@mui/icons-material/Search';
import Edit from '@mui/icons-material/Edit';
import { Box, CircularProgress, SnackbarCloseReason } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Switch from '@mui/material/Switch';
import CustomTextField from 'ui-component/inputs/customSearchTextField';
import ProcedureForm from './ProcedureForm';
import useAPI from 'hooks/useAPI';
import { Procedure, parseProcedure } from 'types/procedure';
import 'react-toastify/dist/ReactToastify.css';
import useConfig from 'hooks/useConfig';
import SnackBarAlert from 'ui-component/SnackBarAlert';
import { ThemeMode } from 'types/config';

const ProcedureView = () => {
    const [open, setOpen] = useState(false);
    const [procedure, setProcedure] = useState<Procedure | null>(null);
    const { get, put } = useAPI();
    const [data, setData] = useState<Procedure[]>([]);
    const { mode } = useConfig();
    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [openSucessSnack, setOpenSucessSnack] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [messageSnack, setMessageSnack] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataRaw, setDataRaw] = useState<Procedure[]>([]);

    useEffect(() => {
        getProcedures();
    }, []);
    const getProcedures = async () => {
        setLoading(true);

        const response = await get('/api/billingProcedure?institution=1');
        if (response.ok && Array.isArray(response.result)) {
            let procedures: Procedure[] = response.result.map((item: any) => parseProcedure(item));
            let reqsModalities = procedures.map((procedure) => get(`/api/billingProcedure/${procedure.id}`));
            let modalities = await Promise.all(reqsModalities);
            procedures = procedures.map((procedure, index) => ({
                ...procedure,
                modalities: modalities[index].result.modalities.map((modality: any) => modality.modality)
            }));
            console.log(procedures);

            setData(procedures);
            setDataRaw(procedures);
        } else {
            setOpenErrorSnack(true);
            setMessageSnack(response.message || 'Erro ao buscar procedimentos');
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

    const handleClose = (refresh: boolean) => {
        if (refresh) {
            handleClickSnack({ message: 'Procedimento salvo com sucesso', severity: 'success' });
            getProcedures();
        }
        setOpen(false);
    };

    const handleClickEdit = (id: GridRowId) => {
        setProcedure(getProcedureById(id));
        setOpen(true);
    };

    const handleSearch = (searchKey: string) => {
        setSearchKey(searchKey);
        if (searchKey === '') {
            getProcedures();
        } else {
            const filtered = dataRaw.filter((element) => element.name.toLowerCase().includes(searchKey.toLowerCase()));
            setData(filtered);
        }
    };
    const handleChangeStatus = async (id: GridRowId) => {
        var newArray = [...data];
        var found: number = -1;
        for (let i = 0; i < newArray.length; i++) {
            var element = newArray[i];
            if (element.id === id.valueOf()) {
                newArray[i].status = !element.status;
                found = i;
            }
        }
        if (found !== -1) {
            setData(newArray);
            setDataRaw(newArray);
            const req = await put(`/api/billingProcedure/${id.valueOf()}`, {
                name: newArray[found].name,
                code: newArray[found].code,
                institution: newArray[found].institutions_fk,
                modality: newArray[found].modalities?.join(','),
                status: newArray[found].status ? '1' : '0'
            });

            if (req.ok) {
                setOpenSucessSnack(true);
                setMessageSnack(
                    newArray[found].status ? 'O Procedimento foi ativada com sucesso' : 'O Procedimento foi desativada com sucesso'
                );
            } else {
                setOpenErrorSnack(true);
                setMessageSnack('Não foi possível alterar o status do Procedimento. ');
                newArray[found].status = !newArray[found].status;
            }
        }
    };

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpenErrorSnack(false);
        setOpenSucessSnack(false);
    };

    const handleClickSnack = ({ message, severity }: { message: string; severity: 'success' | 'error' | 'warning' | 'info' }) => {
        setMessageSnack(message);
        severity === 'success' ? setOpenSucessSnack(true) : setOpenErrorSnack(true);
    };

    return (
        <>
            <MainCard title="Cadastro de Procedimentos">
                <Box display="flex" justifyContent="space-between">
                    <CustomTextField
                        label="Search"
                        value={searchKey}
                        onChange={(e) => handleSearch(e.target.value)}
                        prefixIcon={<Search sx={{ color: 'action.active', mr: 1 }} />}
                    />
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
                        '& .MuiDataGrid-cell': { borderBottom: 'none', fontSize: '12px' },
                        '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', fontSize: '12px' },
                        '& .MuiDataGrid-footerContainer': { borderTop: 'none' }
                    }}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <DataGrid
                            disableRowSelectionOnClick
                            rows={data}
                            columns={[
                                {
                                    field: 'id',
                                    headerName: 'ID',
                                    flex: 1,
                                    minWidth: 150
                                },
                                {
                                    field: 'name',
                                    headerName: 'Descrição do Procedimento',
                                    flex: 1,
                                    minWidth: 150
                                },
                                {
                                    field: 'code',
                                    headerName: 'Código CBHPM',
                                    flex: 1,
                                    minWidth: 150
                                },
                                {
                                    field: 'institution_fk',
                                    headerName: 'Instituição',
                                    flex: 1,
                                    minWidth: 150
                                },
                                {
                                    field: 'modalities',
                                    headerName: 'Modalidade',
                                    flex: 1,
                                    minWidth: 150
                                },
                                {
                                    field: 'actions',
                                    type: 'actions',
                                    headerName: 'Editar',
                                    flex: 1,
                                    minWidth: 150,
                                    cellClassName: 'actions',
                                    getActions: ({ id }) => {
                                        return [
                                            <GridActionsCellItem
                                                icon={<Edit sx={{ color: ThemeMode.DARK == mode ? 'white' : 'black' }} />}
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
                                    minWidth: 150,
                                    flex: 2,
                                    getActions: ({ id }) => {
                                        let procedure = getProcedureById(id);
                                        return [
                                            <Switch checked={procedure?.status ?? false} onChange={(value) => handleChangeStatus(id)} />
                                        ];
                                    }
                                }
                            ]}
                        />
                    )}
                </Box>
            </MainCard>
            <ProcedureForm open={open} handleClose={handleClose} procedureEdit={procedure} />
            <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={handleCloseSnack} />
            <SnackBarAlert open={openSucessSnack} message={messageSnack} severity="success" onClose={handleCloseSnack} />
        </>
    );
};

export default ProcedureView;
