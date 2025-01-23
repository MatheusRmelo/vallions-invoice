import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Box, SnackbarCloseReason, CircularProgress } from '@mui/material';
import CustomTextField from 'ui-component/inputs/customSearchTextField';
import Search from '@mui/icons-material/Search';
import { DataGrid, GridRowId, GridActionsCellItem } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import TableOfValueForm from './TableOfValueForm';
import { TableOfValue, parseTableOfValues } from 'types/tableOfValue';
import useAPI from 'hooks/useAPI';
import SnackBarAlert from 'ui-component/SnackBarAlert';
import { ThemeMode } from 'types/config';
import useConfig from 'hooks/useConfig';
const TableOfValues = () => {
    const [open, setOpen] = useState(false);
    const [tableOfValues, setTableOfValues] = useState<TableOfValue[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [tableOfValue, setTableOfValue] = useState<TableOfValue | null>(null);
    const [searchKey, setSearchKey] = useState('');
    const [dataRaw, setDataRaw] = useState<TableOfValue[]>([]);
    const [openSucessSnack, setOpenSucessSnack] = useState(false);
    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');
    const { mode } = useConfig();
    const [loading, setLoading] = useState(false);

    const { get, put } = useAPI();

    useEffect(() => {
        getTableOfValues();
    }, []);

    const getTableOfValues = async () => {
        setLoading(true);
        const response = await get('/api/medical-procedure-costs');
        if (response.ok) {
            const data = await response.result;
            const parsedData = parseTableOfValues(data);
            setTableOfValues(parsedData);
            setDataRaw(parsedData);
        } else {
            setError(response.message);
        }

        setLoading(false);
    };

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

    const handleChangeStatus = async (id: GridRowId) => {
        var newArray = [...tableOfValues];
        var found: number = -1;
        for (let i = 0; i < newArray.length; i++) {
            var element = newArray[i];
            if (element.id == id.valueOf()) {
                newArray[i].status = !element.status;
                found = i;
            }
        }
        if (found != -1) {
            setTableOfValues(newArray);
            await put(`/api/medical-procedure-costs/${id.valueOf()}`, {
                ...newArray[found],
                status: newArray[found].status ? 1 : 0
            });
        }
    };

    const handleOpen = () => {
        /// Limpar os campos do formulário
        setTableOfValue(null);
        setOpen(true);
    };

    const handleClose = (refresh = false) => {
        setOpen(false);
        if (refresh) {
            handleClickSnack({ message: 'Tabela de valores salva com sucesso', severity: 'success' });
            getTableOfValues();
        }
    };

    const handleClickSnack = ({ message, severity }: { message: string; severity: 'success' | 'error' | 'warning' | 'info' }) => {
        setMessageSnack(message);
        severity === 'success' ? setOpenSucessSnack(true) : setOpenErrorSnack(true);
    };

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpenSucessSnack(false);
        setOpenErrorSnack(false);
    };

    const handleSearch = (searchKey: string) => {
        setSearchKey(searchKey);
        if (searchKey === '') {
            setTableOfValues(dataRaw);
        } else {
            const filtered = dataRaw.filter((element) => element.description.toLowerCase().includes(searchKey.toLowerCase()));
            setTableOfValues(filtered);
        }
    };

    return (
        <>
            <MainCard title="Tabela de Valores">
                <SnackBarAlert open={openSucessSnack} message="Sucesso!" severity="success" onClose={handleCloseSnack} />
                <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={handleCloseSnack} />
                <Box display="flex" justifyContent="space-between">
                    <CustomTextField
                        label="Search"
                        value={searchKey}
                        onChange={(e) => handleSearch(e.target.value)}
                        prefixIcon={<Search sx={{ color: 'action.active', mr: 1 }} />}
                    />
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
                        '& .MuiDataGrid-cell': { borderBottom: 'none', fontSize: '12px' },
                        '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', fontSize: '12px', fontWeight: 'bold' },
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
                            rows={tableOfValues.map((tableOfValue) => ({
                                id: tableOfValue.id,
                                description: tableOfValue.description,
                                status: tableOfValue.status
                            }))}
                            editMode="row"
                            columns={[
                                { field: 'id', headerName: 'ID', minWidth: 150, flex: 2 },
                                {
                                    field: 'description',
                                    minWidth: 150,
                                    headerName: 'Tabela de valores',
                                    flex: 2,
                                    renderHeader: () => <strong style={{ fontSize: '12px' }}>Descrição Tabela de Valores</strong>
                                },
                                {
                                    field: 'actions',
                                    headerName: 'Editar',
                                    type: 'actions',
                                    flex: 1,
                                    minWidth: 150,
                                    cellClassName: 'actions',
                                    renderHeader: () => <strong style={{ fontSize: '12px' }}>Editar</strong>,
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
                                    field: 'status',
                                    headerName: 'Inativo/Ativo',
                                    type: 'actions',
                                    flex: 1,
                                    minWidth: 150,
                                    renderHeader: () => <strong style={{ fontSize: '12px' }}>Inativo/Ativo</strong>,
                                    getActions: ({ id }) => {
                                        let tableOfValue = getTableById(id);
                                        return [
                                            <Switch checked={tableOfValue?.status ?? false} onChange={(value) => handleChangeStatus(id)} />
                                        ];
                                    }
                                }
                            ]}
                        />
                    )}
                </Box>
                <TableOfValueForm open={open} handleClose={(refresh) => handleClose(refresh)} tableOfValue={tableOfValue} />
            </MainCard>
        </>
    );
};

export default TableOfValues;
