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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

const BillingConference: React.FC = () => {
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
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

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
    const [keySearch, setKeySearch] = useState<string>('');
    const [openSucessSnack, setOpenSucessSnack] = useState(false);
    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');

    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));
    const { get, put, post } = useAPI();

    const handleExpandClick = async (id: string, status = '0') => {
        if (tabIndex == 1) {
            await getDetailBilling(parseInt(id), status);
        }
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
            handleClickSnack({ message: response.message ?? `Não foi possível carregar as unidades.`, severity: 'error' });
        }
    };

    const getDoctors = async () => {
        const response = await post(`/api/referenceAccess`, {});
        if (response.ok) {
            setDoctors([...response.result.map((element: any) => parseDoctor(element))]);
        } else {
            handleClickSnack({ message: response.message ?? `Não foi possível carregar os médicos.`, severity: 'error' });
        }
    };

    const getDetailReceipt = async (id: number) => {
        const response = await get(`/api/billing-confirmations?billing=${id}&branches=${institute}&status=1`);
        if (response.ok) {
            const reports = parseReportBillingList(response.result);
            var newArray = [...receipts];
            for (let i = 0; i < newArray.length; i++) {
                if (newArray[i].id === id) {
                    newArray[i].reportsBilling = reports.map((element) => ({ ...element, status: '1' }));
                }
            }
            setReceipts(newArray);
        } else {
            handleClickSnack({ message: response.message ?? `Error ao buscar detalhes da receita ${id}`, severity: 'error' });
        }
    };

    const getDetailBilling = async (id: number, status: string) => {
        const response = await get(
            `/api/billing-confirmations?billing=${id}&branches=${institute}&status=${status}${doctor ? `&physician=${doctor}` : ''}${filter ? `&type_date=${filter == 'Data Laudo' ? 1 : 2}` : ''}`
        );
        if (response.ok) {
            const reports = parseReportBillingList(response.result);
            var newArray = [...billings];
            for (let i = 0; i < newArray.length; i++) {
                if (newArray[i].id == id) {
                    newArray[i].reportsBilling = reports.map((element) => ({ ...element, status: '0' }));
                }
            }

            setBillings(newArray);
        } else {
            handleClickSnack({ message: response.message ?? `Error ao buscar detalhes do fatumento ${id}`, severity: 'error' });
        }
    };

    const getRefunds = async (id: number) => {
        const response = await get(`/api/billing-confirmations?billing=${id}&branches=${institute}&status=2`);
        if (response.ok) {
            return parseReportBillingList(response.result);
        }

        return [];
    };

    const getInstitutes = async () => {
        const response = await get('/api/institutionsAccess');
        if (response.ok) {
            var result: Institute[] = response.result.map((institute: any) => parseInstitute(institute));
            setInstitutes(result);
            if (result.length > 0) {
                setInstitute(result[0].id_institution);
            }
        } else {
            handleClickSnack({ message: response.message ?? 'Error ao buscar instituições', severity: 'error' });
        }
    };

    const getConferences = async () => {
        setLoading(true);
        const response = await get(
            `/api/conference?date_init=${startDate.toISOString().slice(0, 10)}&date_end=${endDate.toISOString().slice(0, 10)}&institution=${institute}&branch=${unity}${doctor ? `&physician=${doctor}` : ''}${filter ? `&type_date=${filter == 'Data Laudo' ? 1 : 2}` : ''}`
        );
        if (response.ok) {
            setConferences(parseConferenceList(response.result));
        } else {
            handleClickSnack({ message: response.message ?? 'Error ao buscar conferências', severity: 'error' });
        }
        setLoading(false);
    };

    const getBillings = async () => {
        setLoading(true);
        const response = await get(
            `/api/billings?date_init=${startDate.toISOString().slice(0, 10)}&date_end=${endDate.toISOString().slice(0, 10)}&institution=${institute}&branches=${unity}${doctor ? `&physician=${doctor}` : ''}${filter ? `&type_date=${filter == 'Data Laudo' ? 1 : 2}` : ''}`
        );
        if (response.ok) {
            const billings = parseBillingList(response.result);
            setBillings(billings);
            setReceipts(billings);
        } else {
            handleClickSnack({ message: response.message ?? 'Error ao buscar faturamentos', severity: 'error' });
        }
        setLoading(false);
    };

    const handleChangeCheckedConference = (idBilling: string) => {
        var newArray = [...conferences];
        for (let i = 0; i < newArray.length; i++) {
            if (`${newArray[i].id}${newArray[i].patient_name}` == idBilling) {
                if (!newArray[i].checked) {
                    if (newArray[i].reports_finished.length == 0) {
                        handleClickSnack({ message: 'Não é possível faturar, pois não foi encontrado o ReportID', severity: 'error' });
                        return;
                    }
                }
                newArray[i].checked = !newArray[i].checked;
                for (let x = 0; x < newArray[i].reports_finished.length; x++) {
                    newArray[i].reports_finished[x].checked = newArray[i].checked;
                }
            }
        }
        setConferences(newArray);
    };

    const handleChangeCheckedBilling = (idBilling: number) => {
        var newArray = [...billings];
        for (let i = 0; i < newArray.length; i++) {
            if (newArray[i].id == idBilling) {
                newArray[i].checked = !newArray[i].checked;
            }
        }
        setBillings(newArray);
    };

    const handleChangeCheckedReport = (idBilling: string, idReport: number) => {
        var newArray = [...conferences];
        for (let i = 0; i < newArray.length; i++) {
            if (`${newArray[i].id}${newArray[i].patient_name}` == idBilling) {
                for (let x = 0; x < newArray[i].reports_finished.length; x++) {
                    if (newArray[i].reports_finished[x].id == idReport) {
                        newArray[i].reports_finished[x].checked = !newArray[i].reports_finished[x].checked;
                    }
                }
            }
        }

        setConferences(newArray);
    };

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
    };

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
        if (institute == undefined || unity == undefined) {
            handleClickSnack({ message: 'E necessário informar a instituição e a Unidade para pesquisar ', severity: 'error' });
            return;
        }

        getBillings();
        getConferences();
        setExpandedRowIds([]);
    };

    const handleOpenConferenceChecked = () => {
        var array: Conference[] = [...conferences.filter((element) => element.checked)];

        setCheckedConferences(array);
        if (array.length > 0) {
            setCurrentConference(array[0]);
            setOpenCompetenceConference(true);
        }
    };

    const handleOpenRefundBilling = () => {
        var array: ReportBilling[] = [];
        billings.forEach((element) => {
            //if (element.checked) {
            array = [...array, ...element.reportsBilling.filter((element) => element.checked)];
            //}
        });
        setCheckedBillings(array);
        if (array.length > 0) {
            setCurrentBilling(array[0]);
            setOpenBillingReversal(true);
        }
    };

    const handleOpenConfirmBilling = () => {
        var array: ReportBilling[] = [];
        billings.forEach((element) => {
            //if (element.checked) {
            array = [...array, ...element.reportsBilling.filter((element) => element.checked)];
            //}
        });
        setCheckedBillings(array);
        if (array.length > 0) {
            setCurrentBilling(array[0]);
            setOpenBillingConfirm(true);
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
    };

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
    };

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
    };

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
            <MainCard title="Conferência de Laudos para Faturamento" sx={{ bgcolor: 'background.default' }}>
                <SnackBarAlert open={openSucessSnack} message="Sucesso!" severity="success" onClose={handleCloseSnack} />
                <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={handleCloseSnack} />

                <Card>
                    <CardContent sx={{ bgcolor: 'background.default' }}>
                        <Grid container spacing={4}>
                            <Grid item xs={isMobile ? 12 : 1.5} minWidth={'190px'}>
                                <DatePicker
                                    sx={{ width: '100%' }}
                                    label="Data Início"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue ?? new Date())}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: 'small'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={isMobile ? 12 : 1.5} minWidth={'190px'}>
                                <DatePicker
                                    sx={{ width: '100%' }}
                                    label="Data Fim"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue ?? new Date())}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: 'small'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={isMobile ? 12 : 1.3} minWidth={'150px'}>
                                <FormControl fullWidth size='small'>
                                    <InputLabel id="filter">Filtro</InputLabel>
                                    <Select
                                        fullWidth
                                        label="Filtro"
                                        variant="outlined"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        sx={{ height: '100%' }}
                                    >
                                        {['Data Laudo', 'Data Estudo'].map((value) => (
                                            <MenuItem key={value} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={isMobile ? 12 : 1.2} minWidth={'150px'}>
                                <FormControl fullWidth size='small'>
                                    <InputLabel id="institute">Instituição</InputLabel>
                                    <Select
                                        fullWidth
                                        label="Instituição"
                                        variant="outlined"
                                        value={institute}
                                        onChange={(e) => setInstitute(e.target.value as string)}
                                        sx={{ height: '100%' }}
                                    >
                                        {institutes.map((institution) => (
                                            <MenuItem key={institution.id_institution} value={institution.id_institution}>
                                                {institution.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={isMobile ? 12 : 1.2} minWidth={'150px'}>
                                <FormControl fullWidth size='small'>
                                    <InputLabel id="unity">Unidade</InputLabel>
                                    <Select
                                        fullWidth
                                        label="Unidade"
                                        variant="outlined"
                                        value={unity}
                                        onChange={(e) => setUnity(e.target.value as string)}
                                        sx={{ height: '100%' }}
                                    >
                                        {unities.map((unity) => (
                                            <MenuItem key={unity.cd_unidade} value={unity.cd_unidade}>
                                                {unity.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={isMobile ? 12 : 1.2} minWidth={'150px'}>
                                <FormControl fullWidth size='small'>
                                    <InputLabel id="doctor">Médico</InputLabel>
                                    <Select
                                        fullWidth
                                        label="Médico"
                                        variant="outlined"
                                        value={doctor}
                                        onChange={(e) => setDoctor(e.target.value as string)}
                                        sx={{ height: '100%' }}
                                    >
                                        {doctors.map((doctor) => (
                                            <MenuItem key={doctor.id_physician} value={doctor.id_physician}>
                                                {doctor.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={isMobile ? 12 : 2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    style={{ height: '100%', width: 'auto' }}
                                    onClick={handleSearch}
                                    disabled={!(startDate && endDate)}
                                >
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

                        <Box display="flex" alignItems={'center'} justifyContent="space-between">
                            <CustomTextField
                                label="Search"
                                onChange={(e) => setKeySearch(e.target.value)}
                                prefixIcon={<Search sx={{ color: 'action.active', mr: 1 }} />}
                            />
                            {tabIndex === 0 ? (
                                <IconButton onClick={() => handleOpenConferenceChecked()}>
                                    <SendOutlined sx={{ color: 'action.active', mr: 1 }} />
                                </IconButton>
                            ) : tabIndex === 1 ? (
                                <Box display="flex">
                                    <RefreshOutlined onClick={() => handleOpenRefundBilling()} sx={{ color: 'action.active', mr: 2 }} />
                                    <MonetizationOn onClick={() => handleOpenConfirmBilling()} sx={{ color: 'action.active', mr: 1 }} />
                                </Box>
                            ) : null}
                        </Box>
                        {loading ? (
                            <div style={{ height: '45vh', width: '100%', marginTop: 20 }}>
                                <CircularProgress />
                            </div>
                        ) : (
                            <div style={{ height: '45vh', width: '100%', marginTop: 20 }}>
                                {/*Conferência*/}
                                {tabIndex === 0 && (
                                    <ConferenceView
                                        conferences={conferences}
                                        keySearch={keySearch}
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
                                        handleExpandClick={(id, status) => handleExpandClick(id, status)}
                                        handleChangeCheckedBilling={(id) => handleChangeCheckedBilling(id)}
                                        handleChangeCheckedReport={(idBilling, idReport) =>
                                            handleChangeCheckedReportBilling(idBilling, idReport)
                                        }
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
                        )}
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
            <RefundBillingForm
                open={openBillingReversal}
                onClose={(value) => handleCloseRefundBilling(value)}
                billing={currentBilling}
                unity={getUnityById(unity ?? '')}
            />
            {/* Dialog de Competência de faturamento */}
            <CompetenceConferenceForm
                open={openCompetenceConference}
                onClose={(value) => handleCloseCompetenceConference(value)}
                price={currentConference?.reports_finished?.map((e) => Number(e.report_price)).reduce((a, b) => a + b, 0) ?? 0}
                unity={getUnityById(unity ?? '')}
                conference={currentConference}
                startAt={startDate}
                endAt={endDate}
            />
        </>
    );
};

const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export default BillingConference;
