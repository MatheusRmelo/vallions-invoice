import { useState, useEffect } from 'react';
import {
    Tabs,
    Tab,
    Box,
    Card,
    CardContent,
    FormControl,
    TextField,
    Grid,
    Select,
    InputLabel,
    MenuItem,
    Button,
    Typography,
    IconButton,
    Chip,
    DialogContent,
    DialogTitle,
    Dialog,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { DataGrid, GridRow } from '@mui/x-data-grid';
import CustomTextField from 'ui-component/inputs/customSearchTextField';
import MainCard from 'ui-component/cards/MainCard';
import { SendOutlined, Search, ExpandMore, ExpandLess } from '@mui/icons-material';
import useAPI from 'hooks/useAPI';
import { MoreVert, DeleteOutline, RemoveRedEyeOutlined } from '@mui/icons-material';
import { Conference, parseConferenceList, generateConference } from 'types/conference';
import { Billing, parseBilling, generateBilling } from 'types/billing';
import { Unity, parseUnityList, generateMockUnity } from 'types/unity';
const BillingConference: React.FC = () => {
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
    const [tabIndex, setTabIndex] = useState(0);
    const [expandedRowIds, setExpandedRowIds] = useState<number[]>([]);
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [billings, setBillings] = useState<Billing[]>([]);
    const mockSelects = ['Teste1', 'Teste2', 'Teste3'];
    const [openDialogAction, setOpenDialogAction] = useState(false);
    const [openBillingReversal, setOpenBillingReversal] = useState(false);
    const [openBillingConfirm, setOpenBillingConfirm] = useState(false);
    const [unities, setUnities] = useState<Unity[]>([]);
    const [unity, setUnity] = useState<Unity>();
    const [valueTotal, setValueTotal] = useState<number>(0);
    const [obsReversal, setObsReversal] = useState<string>('');
    const [open, setOpen] = useState(false);

    const { get, put } = useAPI();

    const handleExpandClick = (id: number) => {
        setExpandedRowIds((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const fetchBilling = async () => {
        const response = await get('/api/billings');

        if (response.ok) {
            const data = await response.result;
            const conference = parseConferenceList(data);
            setConferences(conference);
        } else {
            console.log('Error');
        }

        ///remover em produção
        setConferences(generateConference());
        setBillings(generateBilling());
    };

    const fetchUnity = async () => {
        const response = await get('/api/unities');

        if (response.ok) {
            const data = await response.result;
            const unity = data;
            setUnities(parseUnityList(unity));
        } else {
            console.log('Error');
        }

        ///remover em produção
        setUnities([generateMockUnity()]);
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleReversalBilling = async (id: number, idUnit: number, valueTotal: number, obsReversal: string) => {
        const response = await put(`/api/billings/${id}`, {
            status: 3,
            value_total: valueTotal,
            obs_reversal: obsReversal,
            branch_fk: idUnit
        });

        if (response.ok) {
            fetchBilling();
        } else {
            console.log('Error');
        }
    };

    useEffect(() => {
        fetchBilling();
        fetchUnity();
    }, []);

    return (
        <>
            <MainCard title="Conferência de Laudos para Faturamento">
                <Card>
                    <CardContent>
                        <Grid container spacing={4}>
                            <Grid item xs={1.5}>
                                <TextField
                                    label="Data Início"
                                    type="date"
                                    fullWidth
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={1.5}>
                                <TextField
                                    label="Data Fim"
                                    type="date"
                                    fullWidth
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={1.8}>
                                <FormControl fullWidth>
                                    <InputLabel id="filter">Filtro</InputLabel>
                                    <Select fullWidth label="Filtro" variant="outlined" defaultValue="Teste1">
                                        {mockSelects.map((institution) => (
                                            <MenuItem key={institution} value={institution}>
                                                {institution}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={1.8}>
                                <FormControl fullWidth>
                                    <InputLabel id="institute">Instituição</InputLabel>
                                    <Select fullWidth label="Instituição" variant="outlined" defaultValue="Teste1">
                                        {mockSelects.map((institution) => (
                                            <MenuItem key={institution} value={institution}>
                                                {institution}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={1.8}>
                                <FormControl fullWidth>
                                    <InputLabel id="unity">Unidade</InputLabel>
                                    <Select fullWidth label="Unidade" variant="outlined" defaultValue="Teste1">
                                        {mockSelects.map((institution) => (
                                            <MenuItem key={institution} value={institution}>
                                                {institution}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={1.8}>
                                <FormControl fullWidth>
                                    <InputLabel id="doctor">Médico</InputLabel>
                                    <Select fullWidth label="Médico" variant="outlined" defaultValue="Teste1">
                                        {mockSelects.map((institution) => (
                                            <MenuItem key={institution} value={institution}>
                                                {institution}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={1}>
                                <Button variant="contained" color="primary" fullWidth style={{ height: '90%' }}>
                                    <span style={{ fontSize: '1.45vh' }}>Pesquisar</span>
                                </Button>
                            </Grid>
                        </Grid>
                        <Box mt={'6vh'} />
                        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
                            <Tab label="Conferência" />
                            <Tab label="Faturamento" />
                            <Tab label="Recebimento" />
                        </Tabs>
                        <Box mt={'4vh'} />

                        <Box display="flex" justifyContent="space-between">
                            <CustomTextField label="Search" prefixIcon={<Search sx={{ color: 'action.active', mr: 1 }} />} />
                            <SendOutlined sx={{ color: 'action.active', mr: 1 }} />
                        </Box>
                        <div style={{ height: '45vh', width: '100%', marginTop: 20 }}>
                            {/*Conferência*/}
                            {tabIndex === 0 && (
                                <DataGrid
                                    rows={conferences.map((conference) => {
                                        return {
                                            id: conference.id,
                                            namePatient: conference.namePatient,
                                            study_description: conference.descriptionStudy,
                                            dateOfStudy: formatDate(conference.dateOfStudy),
                                            unity: conference.unity,
                                            quantity: conference.qtn,
                                            valueUnit: conference.valueUnity,
                                            valueTotal: conference.valueTotal
                                        };
                                    })}
                                    columns={[
                                        {
                                            field: 'expand',
                                            headerName: '#',
                                            width: 50,
                                            renderCell: (params) => (
                                                <IconButton onClick={() => handleExpandClick(params.row.id)}>
                                                    {expandedRowIds.includes(params.row.id) ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            )
                                        },
                                        { field: 'namePatient', headerName: 'Nome do Paciente', flex: 2 },
                                        { field: 'study_description', headerName: 'Descrição do Estudo', flex: 2 },
                                        { field: 'dateOfStudy', headerName: 'Data do Estudo', flex: 1 },
                                        { field: 'unity', headerName: 'Unidade', flex: 1 },
                                        { field: 'quantity', headerName: 'Qtn', flex: 1 },
                                        { field: 'valueUnit', headerName: '$ Valor Laudo', flex: 1 },
                                        { field: 'valueTotal', headerName: '$ Total', flex: 1 }
                                    ]}
                                    hideFooter
                                    getRowId={(row) => row.id}
                                    slots={{
                                        row: (props) => {
                                            const { row } = props;
                                            return (
                                                <>
                                                    <GridRow {...props} />
                                                    {expandedRowIds.includes(row.id) && (
                                                        <div style={{ gridColumn: '1 / -1', padding: '16px' }}>
                                                            <Box height={20} />
                                                            <Typography variant="h3">Laudos</Typography>
                                                            <Box height={20} />
                                                            <div style={{ height: 200, width: '100%' }}>
                                                                <DataGrid
                                                                    rows={(
                                                                        conferences.find((conference) => conference.id === row.id)
                                                                            ?.reportsConference || []
                                                                    ).map((report) => {
                                                                        return {
                                                                            namePatient: report.namePatient,
                                                                            reportDate: formatDate(report.dateOfReport),
                                                                            reportTitle: report.titleOfReport,
                                                                            reportValue: report.valueReport,
                                                                            status: report.status
                                                                        };
                                                                    })}
                                                                    columns={[
                                                                        {
                                                                            field: 'namePatient',
                                                                            headerName: 'Nome do Paciente',
                                                                            flex: 2
                                                                        },
                                                                        {
                                                                            field: 'reportDate',
                                                                            headerName: 'Data do Laudo',
                                                                            flex: 2
                                                                        },
                                                                        {
                                                                            field: 'titleOfReport',
                                                                            headerName: 'Título do Laudo',
                                                                            flex: 2
                                                                        },
                                                                        {
                                                                            field: 'valueOfReport',
                                                                            headerName: '$ Valor Laudo',
                                                                            flex: 2
                                                                        },
                                                                        {
                                                                            field: 'status',
                                                                            headerName: 'Status',
                                                                            flex: 2,
                                                                            renderCell(params) {
                                                                                return <Chip label={params.value} />;
                                                                            }
                                                                        },

                                                                        {
                                                                            field: 'action',
                                                                            headerName: ' ',
                                                                            flex: 1,
                                                                            renderCell(params) {
                                                                                return (
                                                                                    <IconButton onClick={() => setOpen(true)}>
                                                                                        <MoreVert sx={{ color: 'action.active' }} />
                                                                                    </IconButton>
                                                                                );
                                                                            }
                                                                        }
                                                                    ]}
                                                                    hideFooter
                                                                    getRowId={(row) => row.namePatient}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        }
                                    }}
                                />
                            )}
                            {/*Faturamento*/}
                            {tabIndex === 1 && (
                                <DataGrid
                                    rows={billings.map((billing) => {
                                        return {
                                            id: billing.id,
                                            unity: billing.unidade,
                                            monthOfBilling: formatDate(billing.dateOfBilling),
                                            statusOfBilling: billing.statusOfBilling,
                                            QTN: billing.qtn,
                                            totalValue: billing.valueTotal
                                        };
                                    })}
                                    columns={[
                                        {
                                            field: 'expand',
                                            headerName: '#',
                                            width: 50,
                                            renderCell: (params) => (
                                                <IconButton onClick={() => handleExpandClick(params.row.id)}>
                                                    {expandedRowIds.includes(params.row.id) ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            )
                                        },
                                        { field: 'unity', headerName: 'Unidade', flex: 1 },
                                        { field: 'monthOfBilling', headerName: 'Mês da Fatura', flex: 1 },
                                        {
                                            field: 'statusOfBilling',
                                            headerName: 'Status da Fatura',
                                            flex: 2,
                                            renderCell(params) {
                                                return <Chip label={params.value} />;
                                            }
                                        },
                                        { field: 'qtn', headerName: 'Qtn', flex: 1 },
                                        { field: 'quantity', headerName: 'Qtn', flex: 1 },
                                        { field: 'valueTotal', headerName: '$ Total', flex: 1 }
                                    ]}
                                    hideFooter
                                    getRowId={(row) => row.id}
                                    slots={{
                                        row: (props) => {
                                            const { row } = props;
                                            return (
                                                <>
                                                    <GridRow {...props} />
                                                    {expandedRowIds.includes(row.id) && (
                                                        <div style={{ gridColumn: '1 / -1', padding: '16px' }}>
                                                            <Box height={20} />
                                                            <Typography variant="h3">Laudos</Typography>
                                                            <Box height={20} />
                                                            <div style={{ height: 200, width: '100%' }}>
                                                                <DataGrid
                                                                    rows={(
                                                                        billings.find((billing) => billing.id === row.id)?.reportsBilling ||
                                                                        []
                                                                    ).map((report) => {
                                                                        return {
                                                                            namePatient: report.namePatient,
                                                                            reportDate: formatDate(report.dateOfReport),
                                                                            doctor: report.doctorName,
                                                                            unity: report.unity,
                                                                            reportTitle: report.titleOfReport,
                                                                            reportValue: report.valueReport
                                                                        };
                                                                    })}
                                                                    columns={[
                                                                        {
                                                                            field: 'namePatient',
                                                                            headerName: 'Nome do Paciente',
                                                                            flex: 2
                                                                        },
                                                                        {
                                                                            field: 'reportDate',
                                                                            headerName: 'Data do Laudo',
                                                                            flex: 2
                                                                        },
                                                                        {
                                                                            field: 'doctor',
                                                                            headerName: 'Médico',
                                                                            flex: 1
                                                                        },
                                                                        {
                                                                            field: 'unity',
                                                                            headerName: 'Unidade',
                                                                            flex: 1
                                                                        },
                                                                        {
                                                                            field: 'reportTitle',
                                                                            headerName: 'Título do Laudo',
                                                                            flex: 1
                                                                        },
                                                                        {
                                                                            field: 'reportValue',
                                                                            headerName: '$ Valor Laudo',
                                                                            flex: 1
                                                                        },

                                                                        {
                                                                            field: 'action',
                                                                            headerName: 'Remover',
                                                                            flex: 1,
                                                                            renderCell(params) {
                                                                                return (
                                                                                    <Box>
                                                                                        <IconButton
                                                                                            onClick={() => setOpenBillingReversal(true)}
                                                                                        >
                                                                                            <DeleteOutline
                                                                                                sx={{ color: 'action.active' }}
                                                                                            />
                                                                                        </IconButton>
                                                                                        <IconButton
                                                                                            onClick={() => setOpenBillingConfirm(true)}
                                                                                        >
                                                                                            <MoreVert sx={{ color: 'action.active' }} />
                                                                                        </IconButton>
                                                                                    </Box>
                                                                                );
                                                                            }
                                                                        }
                                                                    ]}
                                                                    hideFooter
                                                                    getRowId={(row) => row.namePatient}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        }
                                    }}
                                />
                            )}
                            {/*Recebimento*/}
                            {tabIndex === 2 && (
                                <DataGrid
                                    rows={conferences.map((conference) => {
                                        return {
                                            id: conference.id,
                                            namePatient: conference.namePatient,
                                            study_description: conference.descriptionStudy,
                                            dateOfStudy: formatDate(conference.dateOfStudy),
                                            unity: conference.unity,
                                            quantity: conference.qtn,
                                            valueUnit: conference.valueUnity,
                                            valueTotal: conference.valueTotal
                                        };
                                    })}
                                    columns={[
                                        {
                                            field: 'expand',
                                            headerName: '#',
                                            width: 50,
                                            renderCell: (params) => (
                                                <IconButton onClick={() => handleExpandClick(params.row.id)}>
                                                    {expandedRowIds.includes(params.row.id) ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            )
                                        },
                                        { field: 'namePatient', headerName: 'Nome do Paciente', flex: 2 },
                                        { field: 'study_description', headerName: 'Descrição do Estudo', flex: 2 },
                                        { field: 'dateOfStudy', headerName: 'Data do Estudo', flex: 1 },
                                        { field: 'unity', headerName: 'Unidade', flex: 1 },
                                        { field: 'quantity', headerName: 'Qtn', flex: 1 },
                                        { field: 'valueUnit', headerName: '$ Valor Laudo', flex: 1 },
                                        { field: 'valueTotal', headerName: '$ Total', flex: 1 }
                                    ]}
                                    hideFooter
                                    getRowId={(row) => row.id}
                                    slots={{
                                        row: (props) => {
                                            const { row } = props;
                                            return (
                                                <>
                                                    <GridRow {...props} />
                                                    {expandedRowIds.includes(row.id) && (
                                                        <div style={{ gridColumn: '1 / -1', padding: '16px' }}>
                                                            <Box height={20} />
                                                            <Typography variant="h3">Laudos</Typography>
                                                            <Box height={20} />
                                                            <div style={{ height: 200, width: '100%' }}>
                                                                <DataGrid
                                                                    rows={(
                                                                        conferences.find((conference) => conference.id === row.id)
                                                                            ?.reportsConference || []
                                                                    ).map((report) => {
                                                                        return {
                                                                            namePatient: report.namePatient,
                                                                            reportDate: report.dateOfReport,
                                                                            reportTitle: report.titleOfReport,
                                                                            reportValue: report.valueReport,
                                                                            status: report.status
                                                                        };
                                                                    })}
                                                                    columns={[
                                                                        {
                                                                            field: 'namePatient',
                                                                            headerName: 'Nome do Paciente',
                                                                            flex: 2
                                                                        },
                                                                        {
                                                                            field: 'reportDate',
                                                                            headerName: 'Data do Laudo',
                                                                            flex: 2
                                                                        },
                                                                        {
                                                                            field: 'titleOfReport',
                                                                            headerName: 'Título do Laudo',
                                                                            flex: 1
                                                                        },
                                                                        {
                                                                            field: 'valueOfReport',
                                                                            headerName: '$ Valor Laudo'
                                                                        },
                                                                        {
                                                                            field: 'status',
                                                                            headerName: 'Status',
                                                                            flex: 1,
                                                                            renderCell(params) {
                                                                                return <Chip label={params.value} />;
                                                                            }
                                                                        },

                                                                        {
                                                                            field: 'action',
                                                                            headerName: 'Remover',
                                                                            flex: 1,
                                                                            renderCell(params) {
                                                                                return <MoreVert sx={{ color: 'action.active' }} />;
                                                                            }
                                                                        }
                                                                    ]}
                                                                    hideFooter
                                                                    getRowId={(row) => row.namePatient}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </MainCard>
            {/* Dialog de Ações */}
            <Dialog open={openDialogAction} onClose={() => setOpenDialogAction(false)}>
                <Box width={'10vw'} margin={'10px'}>
                    <DialogTitle>
                        <span style={{ fontSize: '2.2vh', fontWeight: 'bold' }}>Ações</span>
                    </DialogTitle>
                    <DialogContent>
                        <Box
                            display="flex"
                            alignItems={'center'}
                            onClick={() => setOpen(false)}
                            sx={{
                                '&:hover': {
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            <RemoveRedEyeOutlined sx={{ color: 'action.active', fontSize: '2.3vh', marginRight: '0.3vh' }} />
                            <Box width={20} />
                            <span style={{ fontSize: '1.5vh', fontWeight: 'bold' }}>Imagens</span>
                        </Box>
                        <Box height={20} />
                        <Box
                            display="flex"
                            alignItems={'center'}
                            onClick={() => setOpen(false)}
                            sx={{
                                '&:hover': {
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            <RemoveRedEyeOutlined sx={{ color: 'action.active', fontSize: '2.3vh', marginRight: '0.3vh' }} />
                            <Box width={20} />
                            <span style={{ fontSize: '1.5vh', fontWeight: 'bold' }}>Laudo</span>
                        </Box>
                    </DialogContent>
                </Box>
            </Dialog>
            {/* Dialog de Confirmação de Faturamento */}
            <Dialog fullWidth maxWidth={'lg'} open={openBillingConfirm} onClose={() => setOpenBillingConfirm(false)}>
                <form>
                    <Box margin={'10px'}>
                        <DialogTitle>
                            <span style={{ fontSize: '2vh', fontWeight: 'bold' }}>Confirmação do Faturamento</span>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText style={{ fontSize: '1.3vh' }}>
                                <span style={{ fontWeight: 'bold' }}>Confirmação de Conferência de Laudos: </span>
                                Verifique se todos os laudos foram revisados e estão corretos antes de prosseguir com o faturamento. Ao
                                confirmar, você estará garantindo que todas as informações estão precisas e prontas para o envio. Deseja
                                continuar com o faturamento?
                            </DialogContentText>
                            <Box height={40} />
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <FormControl fullWidth>
                                        <InputLabel id="select-label">Unidade</InputLabel>
                                        <Select labelId="select-label" label="Select">
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField label="R$ Valor" fullWidth />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField label="Previsão" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField label="Observação" fullWidth />
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </Box>
                    <Box height={60} />
                    <DialogActions>
                        <Button variant="outlined" onClick={() => setOpenBillingConfirm(false)} color="primary" size="large">
                            Fechar
                        </Button>
                        <Box width={5} />
                        <Button
                            size="large"
                            variant="contained"
                            type="submit"
                            sx={{ color: 'white', backgroundColor: 'rgba(103, 58, 183, 1)' }}
                        >
                            Salvar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            {/* Dialog de Estorno de Faturamento */}
            <Dialog fullWidth maxWidth={'lg'} open={openBillingReversal} onClose={() => setOpenBillingReversal(false)}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleReversalBilling(
                            billings.find((billing) => billing.id === unity?.id)?.id || 0,
                            unity?.id || 0,
                            valueTotal,
                            obsReversal
                        );
                    }}
                >
                    <Box margin={'10px'}>
                        <DialogTitle>
                            <span style={{ fontSize: '2vh', fontWeight: 'bold' }}>Estorno do Faturamento</span>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText style={{ fontSize: '1.3vh' }}>
                                <span style={{ fontWeight: 'bold' }}>Atenção: </span>
                                Você está prestes a estornar este faturamento. Ao realizar esta ação, o valor será revertido, e os dados
                                voltarão para a conferência. Certifique-se de que esta ação é necessária, pois o estorno não poderá ser
                                desfeito. Confirme se deseja prosseguir.
                            </DialogContentText>
                            <Box height={40} />
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <FormControl fullWidth>
                                        <InputLabel id="select-label">Unidade</InputLabel>
                                        <Select
                                            labelId="select-label"
                                            label="Select"
                                            onChange={(e) => setUnity(unities.find((unity) => unity.id === Number(e.target.value)))}
                                        >
                                            {unities.map((unity) => (
                                                <MenuItem key={unity.id} value={unity.id}>
                                                    {unity.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField label="R$ Valor" fullWidth onChange={(e) => setValueTotal(Number(e.target.value))} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Motivo do Estorno" fullWidth onChange={(e) => setObsReversal(e.target.value)} />
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </Box>
                    <Box height={60} />
                    <DialogActions>
                        <Button variant="outlined" onClick={() => setOpenBillingReversal(false)} color="primary" size="large">
                            Fechar
                        </Button>
                        <Box width={5} />
                        <Button
                            size="large"
                            variant="contained"
                            type="submit"
                            sx={{ color: 'white', backgroundColor: 'rgba(103, 58, 183, 1)' }}
                        >
                            Salvar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export default BillingConference;
