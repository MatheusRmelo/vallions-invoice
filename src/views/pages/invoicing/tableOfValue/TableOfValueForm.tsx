import React, { useEffect, useState, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    FormControl,
    Grid,
    Select,
    InputLabel,
    MenuItem
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CustomTextField from 'ui-component/inputs/procedureFormTextField';
import CustomTextFieldSearch from 'ui-component/inputs/customSearchTextField';
import Search from '@mui/icons-material/Search';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Add from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Edit from '@mui/icons-material/EditOutlined';
import Delete from '@mui/icons-material/DeleteOutlined';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import ImportOfProcedure from './ImportOfProcedure';
import ProcedureCostForm from './ProcedureCostForm';
import { TableOfValue } from 'types/tableOfValue';
import { parseProcedureCosts, getProcedureCostsMock, ProcedureCost, parseProcedureCost } from 'types/procedures_costs';

import useAPI from 'hooks/useAPI';
import { Institute, parseInstitute, getMockInstitutes } from 'types/institute';
type TableOfValueFormProps = {
    open: boolean;
    handleClose: (refresh: boolean) => void;
    tableOfValue: TableOfValue | null;
};

type TableOfValueFormErrors = {
    description: string | null;
    institute: string | null;
};

const TableOfValueForm: React.FC<TableOfValueFormProps> = ({ open, handleClose, tableOfValue }) => {
    const [errors, setErrors] = useState<TableOfValueFormErrors>({
        description: null,
        institute: null
    });
    const [description, setDescription] = useState('');
    const [institute, setInstitute] = useState<string>("");
    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [importOpen, setImportOpen] = useState(false);
    const [procedureOpen, setProcedureOpen] = useState(false);
    const [proceduresCosts, setProceduresCosts] = useState<ProcedureCost[]>([]);
    const [procedureCost, setProcedureCost] = useState<ProcedureCost | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('');

    const { get, post, put, del } = useAPI();

    useEffect(() => {
        getInstitutes();
    }, [tableOfValue]);

    useEffect(() => {
        getTableOfValue();
    }, [open]);

    const getProceduresCosts = async () => {
        const response = await get(`/api/costs-has-procedures?medicalProcedureCost=${tableOfValue?.id}`);
        if (response.ok) {
            setProceduresCosts(response.result.map(parseProcedureCost));
        } else {
            setError(response.message);
        }
    }

    const getInstitutes = async () => {
        const response = await get('/api/institutionsAccess');
        if (response.ok) {
            setInstitutes(response.result.map(parseInstitute));
            getTableOfValue();
        } else {
            setError(response.message);
        }

    };

    const getTableOfValue = () => {
        if (tableOfValue) {
            var institute = institutes.filter((element) => element.name == tableOfValue.nickname);
            setDescription(tableOfValue.description);
            setInstitute(institute[0].id);
            getProceduresCosts();
        } else {
            setDescription("");
            setInstitute("");
        }
    };

    const getProcedureCostById = (id: number) => {
        let rows = proceduresCosts;
        let filtered = rows.filter((element) => element.id == id);
        if (filtered.length === 0) return null;
        return filtered[0];
    }

    const handleSave = async () => {
        const intituteForeignKeyId = institute;
        if (validate() && intituteForeignKeyId !== null) {
            if (tableOfValue != null) {
                const response = await put(`/api/medical-procedure-costs/${tableOfValue.id}`, {
                    description: description,
                    status: 1,
                    institution_fk: intituteForeignKeyId
                });
                if (response.ok) {
                    handleClose(true);
                } else {
                    setError('Erro ao salvar os procedimentos');
                }
            } else {
                /// Salvando a tabela de valores
                const response = await post('/api/medical-procedure-costs', {
                    description: description,
                    status: 1,
                    institution_fk: intituteForeignKeyId
                });
                if (response.ok) {
                    /// Vinculando os custos dos procedimentos a tabela de valores
                    const results = proceduresCosts.map(async (procedureCost) => {
                        return post('/api/costs-has-procedures', {
                            medical_procedure_cost_fk: response.result.id,
                            billing_procedures_fk: procedureCost.codProcedure,
                            price: procedureCost.valueProcedure,
                            initial_effective_date: procedureCost.validatyStart,
                            final_effective_date: procedureCost.validatyEnd
                        });
                    });

                    const responseCost = await Promise.all(results);

                    if (responseCost.every((res) => res.ok)) {
                        handleClose(true);
                    } else {
                        setError('Erro ao salvar os procedimentos');
                    }
                }
            }
        }
    };

    const handleClickAddProcedureCost = () => {
        setProcedureCost(null);
        setProcedureOpen(true);
    }

    const handleCloseProcedureCost = (procedureCost: ProcedureCost | null) => {
        if (tableOfValue != null) {
            getProceduresCosts();
        } else {
            if (procedureCost) {
                var newArray = [...proceduresCosts];
                newArray.push(procedureCost!)
                setProceduresCosts(newArray);
            }
        }


        setProcedureOpen(false);
    }

    const handleUpdateTableOfValue = async () => {
        if (tableOfValue) {
            const response = await put(`/api/medical-procedure-costs/${tableOfValue.id}`, {
                description: description,
                status: tableOfValue.status,
                institution_fk: institute
            });
            if (response.ok) {
                handleClose(false);
            } else {
                setError(response.message);
            }
        }
    };

    const handleDeleteProcedureCost = async (id: number) => {
        if (tableOfValue == null) {
            let newArray = [...proceduresCosts];
            setProceduresCosts(newArray.filter((element) => element.id != id));
        } else {
            const response = await del(`/api/costs-has-procedures/${id}`);
            if (response.ok) {
                getProceduresCosts();
            } else {
                setError(response.message);
            }
        }
    }

    const validate = () => {
        const newErrors = { ...errors };
        if (!description) {
            newErrors.description = 'Campo obrigatório';
        } else {
            newErrors.description = null;
        }

        if (institute === null) {
            newErrors.institute = 'Campo obrigatório';
        } else {
            newErrors.institute = null;
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== null);
    };

    return (
        <Dialog
            open={open}
            onClose={() => handleClose(false)}
            maxWidth={false}
            fullWidth
            PaperProps={{
                sx: {
                    width: 'auto',
                    height: 'auto',
                    padding: '20px',
                    margin: 0,
                    maxHeight: '100vh'
                }
            }}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                <DialogTitle sx={{ fontSize: '20px' }}>Tabela de Valores</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: '12px' }}>
                        <strong>Cadastro de Tabela de Valores: </strong>
                        Preencha todas as informações necessárias para tabela, como descrição, instituição, e os valores correspondentes aos
                        procedimentos. Certifique-se de que os valores estão corretos e adequados antes de salvar. Confirme se deseja
                        cadastrar esta tabela de valores.
                    </DialogContentText>
                    <Box height={65} />
                    <Grid container spacing={2}>
                        <Grid item xs={10} sm={5}>
                            <CustomTextField
                                label="Descrição da Tabela de Valores"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                error={Boolean(errors.description)}
                                helperText="Campo obrigatório"
                            />
                        </Grid>
                        <Box width={50} />
                        <Grid item xs={12} sm={5}>
                            <FormControl fullWidth error={Boolean(errors.institute)} sx={formControlStyles}>
                                <InputLabel id="institute-label">Instituição</InputLabel>
                                <Select
                                    labelId="institute-label"
                                    id="institute-select"
                                    value={institute}
                                    displayEmpty
                                    label="Instituição"
                                    onChange={(e) => setInstitute(e.target.value as string)}
                                    fullWidth
                                    IconComponent={ArrowDropDownIcon}
                                    sx={selectStyles}
                                >
                                    {institutes.map((institute) => (
                                        <MenuItem key={institute.id} value={institute.id}>
                                            {institute.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={14} sm={4.7}></Grid>
                    </Grid>
                    <Box height="6vh" />
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Box
                            sx={{
                                marginLeft: '30px'
                            }}
                        >
                            <CustomTextFieldSearch
                                label="Search"
                                onChange={(e) => {
                                    setFilter(e.target.value);
                                }}
                                prefixIcon={<Search sx={{ color: 'action.active', mr: 1 }} />}
                            />
                        </Box>
                        <Box
                            display={'flex'}
                            alignItems={'flex-start'}
                            sx={{
                                marginTop: '20px'
                            }}
                        >
                            <CloudUpload
                                onClick={() => {
                                    setImportOpen(true);
                                }}
                                sx={{ color: 'action.active', mr: 2, marginTop: '1px', fontSize: 24 }}
                            />
                            <Fab
                                color="primary"
                                onClick={handleClickAddProcedureCost}
                                sx={{
                                    width: 24,
                                    height: 24,
                                    minHeight: 24,
                                    fontSize: 20,
                                    boxShadow: 'none'
                                }}
                                aria-label="add"
                            >
                                <Add sx={{ fontSize: 20 }} />
                            </Fab>
                        </Box>
                    </Box>
                    <Box height="6vh" />
                    {proceduresCosts !== null && proceduresCosts.length > 0 && (
                        <DataGrid
                            disableRowSelectionOnClick
                            rows={proceduresCosts
                                .filter((procedureCost) => {
                                    return (
                                        filter.length === 0 ||
                                        procedureCost.descriptionProcedure?.toLowerCase().includes(filter.toLowerCase()) ||
                                        procedureCost.codProcedure.toLowerCase().includes(filter.toLowerCase())
                                    );
                                })
                                .map((procedureCost) => ({
                                    id: procedureCost.id,
                                    initDate: procedureCost.validatyStart,
                                    endDate: procedureCost.validatyEnd,
                                    procedureCode: procedureCost.codProcedure,
                                    procedureDescription: procedureCost.descriptionProcedure,
                                    value: procedureCost.valueProcedure
                                }))}
                            columns={[
                                {
                                    field: 'initDate',
                                    headerName: 'Vigência Inicial',
                                    renderHeader: () => <span style={{ fontWeight: 'bold' }}>Vigência Inicial</span>,
                                    flex: 2,
                                    minWidth: 150,
                                },
                                {
                                    field: 'endDate',
                                    headerName: 'Vigência Final',
                                    flex: 2, minWidth: 150,
                                    renderHeader: () => <span style={{ fontWeight: 'bold' }}>Vigência Final</span>
                                },
                                {
                                    field: 'procedureCode',
                                    headerName: 'Cód. Procedimento',
                                    renderHeader: () => <span style={{ fontWeight: 'bold' }}>Cód. Procedimento</span>,
                                    flex: 2,
                                    minWidth: 150,
                                },
                                {
                                    field: 'procedureDescription',
                                    headerName: 'Descrição Procedimento',
                                    renderHeader: () => <span style={{ fontWeight: 'bold' }}>Descrição Procedimento</span>,
                                    flex: 3,
                                    minWidth: 150,
                                    renderCell: (params: GridCellParams) => <span style={{ fontWeight: 'bold' }}>{params.value as string}</span>
                                },
                                { field: 'value', headerName: 'Valor Procedimento', flex: 4 },
                                {
                                    field: 'actions',
                                    headerName: 'Ações',
                                    flex: 1,
                                    minWidth: 150,
                                    cellClassName: 'actions',
                                    type: 'actions',
                                    renderHeader: () => <strong style={{ fontSize: '12px' }}>Ações</strong>,
                                    getActions: ({ id }) => {
                                        return [
                                            <Edit
                                                color="primary"
                                                onClick={() => {
                                                    setProcedureCost(getProcedureCostById(id.valueOf() as number));
                                                    setProcedureOpen(true);
                                                }}
                                            />,
                                            <Delete
                                                color="error"
                                                onClick={() => {
                                                    handleDeleteProcedureCost(id.valueOf() as number);
                                                }}
                                            />
                                        ];
                                    }
                                }
                            ]}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        sx={{
                            width: '10vh',
                            height: '4vh',
                            fontWeight: 'bold',
                            fontSize: '1.5vh'
                        }}
                        onClick={() => handleClose(false)}
                        color="primary"
                    >
                        Fechar
                    </Button>
                    <Box width={5} />
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{
                            width: '10vh',
                            height: '4vh',
                            fontSize: '1.5vh',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: 'rgba(103, 58, 183, 1)'
                        }}
                    >
                        Salvar
                    </Button>
                </DialogActions>
                <ImportOfProcedure open={importOpen} handleClose={() => setImportOpen(false)} />
                <ProcedureCostForm
                    procedureCost={procedureCost}
                    institutes={institutes}
                    open={procedureOpen}
                    tableOfValueId={tableOfValue ? tableOfValue.id.toString() : null}
                    onClose={handleCloseProcedureCost} />
            </form>
        </Dialog>
    );
};

const formControlStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderRadius: '12px'
            // backgroundColor: 'white'
        },
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(198, 40, 40, 1)'
        }
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: 'rgba(198, 40, 40, 1)'
        }
    }
};

const selectStyles = {
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(198, 40, 40, 1)'
        }
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: 'rgba(198, 40, 40, 1)'
        }
    },
    '& .MuiSelect-icon': {
        zIndex: 9999
    }
};

export default TableOfValueForm;
