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
    DialogActions,
    useMediaQuery,
    useTheme,
    Checkbox,
    SnackbarCloseReason,
    CircularProgress
} from '@mui/material';
import { DataGrid, GridRow } from '@mui/x-data-grid';
import CustomTextField from 'ui-component/inputs/customSearchTextField';
import MainCard from 'ui-component/cards/MainCard';
import { SendOutlined, Search, ExpandMore, ExpandLess, RefreshOutlined, MoneyOutlined, MonetizationOn } from '@mui/icons-material';
import useAPI from 'hooks/useAPI';
import { MoreVert, DeleteOutline, RemoveRedEyeOutlined } from '@mui/icons-material';
import { Conference, parseConferenceList, ReportConference } from 'types/conference';
import { Billing, parseBilling, parseBillingList, parseReportBillingList, ReportBilling } from 'types/billing';
import { Unity, parseUnityList, generateMockUnity } from 'types/unity';
import { Institute, parseInstitute } from 'types/institute';
import ConfirmBillingForm from './ConfirmBillingForm';
import BillingView from './BillingView';
import ConferenceView from './ConferenceView';
import RefundBillingForm from './RefundBillingForm';
import ReceiptView from './ReceiptView';
import SnackBarAlert from 'ui-component/SnackBarAlert';
import { Doctor, parseDoctor } from 'types/doctor';
import CompetenceConferenceForm from './CompetenceConferenceForm';


const BillingConference: React.FC = () => {
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
    const [tabIndex, setTabIndex] = useState(0);
    const [expandedRowIds, setExpandedRowIds] = useState<string[]>([]);
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [billings, setBillings] = useState<Billing[]>([]);
    const [receipts, setReceipts] = useState<Billing[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialogAction, setOpenDialogAction] = useState(false);
    const [openBillingReversal, setOpenBillingReversal] = useState(false);
    const [openBillingConfirm, setOpenBillingConfirm] = useState(false);
    const [openCompetenceConference, setOpenCompetenceConference] = useState(false);

    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [institute, setInstitute] = useState<string>();
    const [unity, setUnity] = useState<string>();
    const [unities, setUnities] = useState<Unity[]>([]);
    const [doctor, setDoctor] = useState<string>();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filter, setFilter] = useState<string>();

    const [error, setError] = useState<string | null>(null);
    const [currentBilling, setCurrentBilling] = useState<ReportBilling | null>(null);
    const [checkedBillings, setCheckedBillings] = useState<ReportBilling[]>([]);
    const [currentConference, setCurrentConference] = useState<Conference | null>(null);
    const [checkedConferences, setCheckedConferences] = useState<Conference[]>([]);

    const [openSucessSnack, setOpenSucessSnack] = useState(false);
    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');

    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));
    const { get, put, post } = useAPI();

    const handleExpandClick = async (id: string) => {
        if (tabIndex == 2) {
            await getDetailReceipt(parseInt(id));
        }

        setExpandedRowIds((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const getUnities = async () => {
        const response = await get(`/api/branchAccessUsersIntitution?institution=${institute}`);
        if (response.ok) {
            const unities = parseUnityList(response.result);
            setUnities(unities);
        } else {
            setError('Não foi possível carregar as unidades.' + response.message);
        }
    };

    const getDoctors = async () => {
        const response = await post(`/api/referenceAccess`, {});
        if (response.ok) {
            setDoctors([...response.result.map((element: any) => parseDoctor(element))]);
        } else {
            setError('Não foi possível carregar os médicos.' + response.message);
        }
    };

    const getDetailReceipt = async (id: number) => {
        const response = await get(`/api/billing-confirmations?billing=${id}&branches=${institute}&status=3`);
        if (response.ok) {
            const reports = parseReportBillingList(response.result);
            var newArray = [...receipts];
            for (let i = 0; i < newArray.length; i++) {
                if (newArray[i].id == id) {
                    newArray[i].reportsBilling = reports.map((element) => ({ ...element, status: '3' }));
                    let refunds = await getRefunds(id);
                    newArray[i].reportsBilling = [...newArray[i].reportsBilling, ...refunds.map((element) => ({ ...element, status: '2' }))];

                }
            }
            setReceipts(newArray);
        } else {
            console.log('Error');
        }
    }

    const getDetailBilling = async (id: number) => {
        const response = await get(`/api/billing-confirmations?billing=${id}&branches=${institute}&status=${tabIndex}`);
        if (response.ok) {
            const reports = parseReportBillingList(response.result);
            var newArray = tabIndex == 1 ? [...billings] : [];
            for (let i = 0; i < newArray.length; i++) {
                if (newArray[i].id == id) {
                    newArray[i].reportsBilling = reports;
                }
            }
            if (tabIndex == 1) {
                setBillings(newArray);
            }
        } else {
            console.log('Error');
        }
    }

    const getRefunds = async (id: number) => {
        const response = await get(`/api/billing-confirmations?billing=${id}&branches=${institute}&status=2`);
        if (response.ok) {
            return parseReportBillingList(response.result);
        }

        return [];
    }

    const getInstitutes = async () => {
        const response = await get('/api/institutionsAccess');
        if (response.ok) {
            var result: Institute[] = response.result.map((institute: any) => parseInstitute(institute));
            setInstitutes(result);
            if (result.length > 0) {
                setInstitute(result[0].id_institution);
                getBillings();
            }
        } else {
            setError(response.message);
        }
    };

    const getConferences = async () => {
        setLoading(true);
        const response = await get(`/api/conference?date_init=${startDate}&date_end=${endDate}&institution=${institute}&branch=${unity}${doctor ? `&reference=${doctor}` : ''}${filter ? `&filter=${filter}` : ''}`);
        if (response.ok) {
            setConferences(parseConferenceList(response.result));
        } else {
            console.log('Error');
        }
        setLoading(false);
    };

    const getBillings = async () => {
        setLoading(true);
        const response = await get(`/api/billings?date_init=${startDate}&date_end=${endDate}&institution=${institute}&branches=${unity}${doctor ? `&reference=${doctor}` : ''}`);
        if (response.ok) {
            const billings = parseBillingList(response.result);
            setBillings(billings);
            setReceipts(billings);
        } else {
            console.log('Error');
        }
        setLoading(false);
    };

    const handleChangeCheckedConference = (idBilling: string) => {
        var newArray = [...conferences];
        for (let i = 0; i < newArray.length; i++) {
            if (`${newArray[i].id}${newArray[i].price}${newArray[i].patient_name}` == idBilling) {
                newArray[i].checked = !newArray[i].checked;
            }
        }
        setConferences(newArray);
    }

    const handleChangeCheckedBilling = (idBilling: number) => {
        var newArray = [...billings];
        for (let i = 0; i < newArray.length; i++) {
            if (newArray[i].id == idBilling) {
                newArray[i].checked = !newArray[i].checked;
            }
        }
        setBillings(newArray);
    }

    const handleChangeCheckedReport = (idBilling: number, idReport: number) => {
        var newArray = [...conferences];
        for (let i = 0; i < newArray.length; i++) {
            if (newArray[i].id == idBilling) {
                // for (let x = 0; x < newArray[i].reportsBilling.length; x++) {
                //     if (newArray[i].reportsBilling[x].id == idReport) {
                //         newArray[i].reportsBilling[x].checked = !newArray[i].reportsBilling[x].checked;
                //     }
                // }
            }
        }

        setConferences(newArray);
    }

    const handleChangeCheckedReportBilling = (idBilling: number, idReport: number) => {
        var newArray = [...billings];
        for (let i = 0; i < newArray.length; i++) {
            if (newArray[i].id == idBilling) {
                for (let x = 0; x < newArray[i].reportsBilling.length; x++) {
                    if (newArray[i].reportsBilling[x].id == idReport) {
                        newArray[i].reportsBilling[x].checked = !newArray[i].reportsBilling[x].checked;
                    }
                }
            }
        }

        setBillings(newArray);
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
        setExpandedRowIds([]);
    };

    const handleReversalBilling = async (id: number, idUnit: number, valueTotal: number, obsReversal: string) => {
        const response = await put(`/api/billings/${id}`, {
            status: 3,
            value_total: valueTotal,
            obs_reversal: obsReversal,
            branch_fk: idUnit
        });

        if (response.ok) {
            getBillings();
        } else {
            console.log('Error');
        }
    };

    useEffect(() => {
        getInstitutes();
        getDoctors();
    }, []);

    const handleSearch = () => {
        getBillings();
        getConferences();
        setExpandedRowIds([]);
    }

    const handleOpenConferenceChecked = () => {
        var array: Conference[] = [...conferences.filter((element) => element.checked)];

        setCheckedConferences(array);
        if (array.length > 0) {
            setCurrentConference(array[0]);
            setOpenCompetenceConference(true);
        }
    }

    const handleOpenRefundBilling = () => {
        var array: ReportBilling[] = [];
        billings.forEach((element) => {
            if (element.checked) {
                array = [...array, ...element.reportsBilling.filter((element) => element.checked)]
            }
        });
        setCheckedBillings(array);
        if (array.length > 0) {
            setCurrentBilling(array[0]);
            setOpenBillingReversal(true);
        }
    }

    const handleClickSnack = ({ message, severity }: { message: string; severity: 'success' | 'error' | 'warning' | 'info' }) => {
        setMessageSnack(message);
        severity === 'success' ? setOpenSucessSnack(true) : setOpenErrorSnack(true);
    };

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpenSucessSnack(false);
        setOpenErrorSnack(false);
    };

    const handleCloseConfirmBilling = (success: boolean) => {
        if (success) {
            var newArray = [...checkedBillings];
            newArray.splice(0);
            setCheckedBillings(newArray);
            setExpandedRowIds([]);
            if (newArray.length > 0) {
                setCurrentBilling(newArray[0]);
            } else {
                getBillings();
                handleClickSnack({ message: 'successo', severity: 'success' });
            }
        }

        setOpenBillingConfirm(false);
    }

    const handleCloseRefundBilling = (success: boolean) => {
        if (success) {
            var newArray = [...checkedBillings];
            newArray.splice(0);
            setCheckedBillings(newArray);
            setExpandedRowIds([]);
            if (newArray.length > 0) {
                setCurrentBilling(newArray[0]);
            } else {
                getBillings();
                handleClickSnack({ message: 'successo', severity: 'success' });
            }
        }

        setOpenBillingReversal(false);
    }

    const handleCloseCompetenceConference = (success: boolean) => {
        if (success) {
            var newArray = [...checkedConferences];
            newArray.splice(0);
            setCheckedConferences(newArray);
            setExpandedRowIds([]);
            if (newArray.length > 0) {
                setCurrentConference(newArray[0]);
            } else {
                setTabIndex(1);
                getBillings();
                handleClickSnack({ message: 'successo', severity: 'success' });
                setOpenCompetenceConference(false);
            }
        } else {
            setOpenCompetenceConference(false);
        }
    }

    const getUnityById = (id: string) => {
        let filtered = unities.filter((element) => element.cd_unidade === id);
        if (filtered.length === 0) return undefined;
        return filtered[0];
    };

    useEffect(() => {
        if (institute) getUnities();
    }, [institute]);

    return (
        <>
            <MainCard title="Conferência de Laudos para Faturamento">
                <SnackBarAlert open={openSucessSnack} message="Sucesso!" severity="success" onClose={handleCloseSnack} />
                <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={handleCloseSnack} />

                <Card>
                    <CardContent>
                        <Grid container spacing={4}>
                            <Grid item xs={isMobile ? 6 : 1.5}>
                                <TextField
                                    label="Data Início"
                                    type="date"
                                    fullWidth
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={isMobile ? 6 : 1.5}>
                                <TextField
                                    label="Data Fim"
                                    type="date"
                                    fullWidth
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={isMobile ? 12 : 1.5}>
                                <FormControl fullWidth>
                                    <InputLabel id="filter">Filtro</InputLabel>
                                    <Select fullWidth label="Filtro" variant="outlined" value={filter} onChange={(e) => setFilter(e.target.value)}>
                                        {['Data Laudo', 'Data Estudo'].map((value) => (
                                            <MenuItem key={value} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={isMobile ? 12 : 1.5}>
                                <FormControl fullWidth>
                                    <InputLabel id="institute">Instituição</InputLabel>
                                    <Select fullWidth label="Instituição" variant="outlined"
                                        value={institute}
                                        onChange={(e) => setInstitute(e.target.value as string)}
                                    >
                                        {institutes.map((institution) => (
                                            <MenuItem key={institution.id_institution} value={institution.id_institution}>
                                                {institution.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={isMobile ? 12 : 1.5}>
                                <FormControl fullWidth>
                                    <InputLabel id="unity">Unidade</InputLabel>
                                    <Select fullWidth label="Unidade" variant="outlined" value={unity}
                                        onChange={(e) => setUnity(e.target.value as string)}>
                                        {unities.map((unity) => (
                                            <MenuItem key={unity.cd_unidade} value={unity.cd_unidade}>
                                                {unity.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={isMobile ? 12 : 1.5}>
                                <FormControl fullWidth>
                                    <InputLabel id="doctor">Médico</InputLabel>
                                    <Select fullWidth label="Médico" variant="outlined" value={doctor}
                                        onChange={(e) => setDoctor(e.target.value as string)}>
                                        {doctors.map((doctor) => (
                                            <MenuItem key={doctor.id_physician} value={doctor.id_physician}>
                                                {doctor.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={isMobile ? 12 : 2}>
                                <Button variant="contained" color="primary" fullWidth style={{ height: '90%' }} onClick={handleSearch} disabled={!(startDate && endDate)}>
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
                            {
                                tabIndex == 0 ?
                                    <IconButton onClick={() => handleOpenConferenceChecked()}>
                                        <SendOutlined sx={{ color: 'action.active', mr: 1 }} />
                                    </IconButton> :
                                    tabIndex == 1 ? (
                                        <Box display="flex">
                                            <RefreshOutlined onClick={() => handleOpenRefundBilling()} sx={{ color: 'action.active', mr: 2 }} />
                                            <MonetizationOn sx={{ color: 'action.active', mr: 1 }} />
                                        </Box>
                                    ) : null
                            }


                        </Box>
                        {
                            loading ? <div style={{ height: '45vh', width: '100%', marginTop: 20 }}>
                                <CircularProgress />
                            </div> :
                                <div style={{ height: '45vh', width: '100%', marginTop: 20 }}>
                                    {/*Conferência*/}
                                    {tabIndex === 0 && (
                                        <ConferenceView
                                            conferences={conferences}
                                            expandedRowIds={expandedRowIds}
                                            handleChangeCheckedConference={(id) => handleChangeCheckedConference(id)}
                                            handleChangeCheckedReport={(idBilling, idReport) => handleChangeCheckedReport(idBilling, idReport)}
                                            handleExpandClick={(id) => handleExpandClick(id)}
                                        />
                                    )}
                                    {/*Faturamento*/}
                                    {tabIndex === 1 && (
                                        <BillingView
                                            billings={billings}
                                            expandedRowIds={expandedRowIds}
                                            handleExpandClick={(id) => handleExpandClick(id)}
                                            handleChangeCheckedBilling={(id) => handleChangeCheckedBilling(id)}
                                            handleChangeCheckedReport={(idBilling, idReport) => handleChangeCheckedReportBilling(idBilling, idReport)}
                                        />
                                    )}
                                    {/*Recebimento*/}
                                    {tabIndex === 2 && (
                                        <ReceiptView
                                            billings={receipts}
                                            expandedRowIds={expandedRowIds}
                                            handleExpandClick={(id) => handleExpandClick(id)}
                                        />
                                    )}
                                </div>
                        }

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
                            onClick={() => { }}
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
                            onClick={() => { }}
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
            <ConfirmBillingForm open={openBillingConfirm} billing={currentBilling} onClose={(value) => handleCloseConfirmBilling(value)} />
            {/* Dialog de Estorno de Faturamento */}
            <RefundBillingForm open={openBillingReversal} onClose={(value) => handleCloseRefundBilling(value)} billing={currentBilling} />
            {/* Dialog de Competência de faturamento */}
            <CompetenceConferenceForm open={openCompetenceConference} onClose={(value) => handleCloseCompetenceConference(value)}
                price={Number(currentConference?.price ?? 0)}
                unity={getUnityById(unity ?? '')}
            />
        </>
    );
};

const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export default BillingConference;
