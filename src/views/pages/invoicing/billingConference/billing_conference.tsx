import React from 'react';
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
    Chip
} from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp, GridRow } from '@mui/x-data-grid';
import CustomTextField from 'ui-component/inputs/customSearchTextField';
import MainCard from 'ui-component/cards/MainCard';
import { SendOutlined, Search, ExpandMore, ExpandLess } from '@mui/icons-material';
import useAPI from 'hooks/hooks';
import { MoreVert } from '@mui/icons-material';
import { Conference, parseConferenceList, generateConference } from 'types/conference';

const BillingConference: React.FC = () => {
    const [startDate, setStartDate] = React.useState(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = React.useState(new Date().toISOString().slice(0, 10));
    const [tabIndex, setTabIndex] = React.useState(0);
    const [expandedRowIds, setExpandedRowIds] = React.useState<number[]>([]);
    const [conference, setConference] = React.useState<Conference[]>([]);

    const mockSelects = ['Teste1', 'Teste2', 'Teste3'];

    const { get } = useAPI();

    const handleExpandClick = (id: number) => {
        setExpandedRowIds((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const fetchBilling = async () => {
        const response = await get('/api/billings');

        if (response.ok) {
            const data = await response.result;
            const conference = parseConferenceList(data);
            setConference(conference);
        } else {
            console.log('Error');
        }

        ///remover em produção
        setConference(generateConference());
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    React.useEffect(() => {
        fetchBilling();
    }, []);

    return (
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
                    <div style={{ height: 400, width: '100%', marginTop: 20 }}>
                        {/*Conferência*/}
                        {tabIndex === 0 && (
                            <DataGrid
                                rows={billings.map((billing) => {
                                    return {
                                        id: billing.id,
                                        unity: billing.unity.name,
                                        monthOfBilling: billing.monthOfBilling,
                                        statusOfBilling: billing.statusOfBilling,
                                        QTN: billing.qtn,
                                        totalValue: billing.priceTotal
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
                                    { field: 'statusOfBilling', headerName: 'Status da Fatura', flex: 2 },
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
                                                        <Typography variant="h3">Laudos Sendo Faturados</Typography>
                                                        <Box height={20} />
                                                        <div style={{ height: 200, width: '100%' }}>
                                                            <DataGrid
                                                                rows={(billings.find((billing) => billing.id === row.id)?.report || []).map(
                                                                    (report) => {
                                                                        return {
                                                                            namePatient: report.patientName,
                                                                            reportDate: report.dateReport,
                                                                            reportTitle: report.titleReport,
                                                                            reportValue: report.valueReport,
                                                                            status: report.statusReport
                                                                        };
                                                                    }
                                                                )}
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
                                                                        field: 'titleOfReport',
                                                                        headerName: 'Título do Laudo',
                                                                        flex: 1
                                                                    },
                                                                    {
                                                                        field: 'valueOfReport',
                                                                        headerName: '$ Valor Laudo'
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
                        {/*Faturamento*/}
                        {tabIndex === 1 && (
                            <DataGrid
                                rows={billings.map((billing) => {
                                    return {
                                        id: billing.id,
                                        unity: billing.unity.name,
                                        monthOfBilling: billing.monthOfBilling,
                                        statusOfBilling: billing.statusOfBilling,
                                        QTN: billing.qtn,
                                        totalValue: billing.priceTotal
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
                                                                rows={(billings.find((billing) => billing.id === row.id)?.report || []).map(
                                                                    (report) => {
                                                                        return {
                                                                            namePatient: report.patientName,
                                                                            reportDate: report.dateReport,
                                                                            reportTitle: report.titleReport,
                                                                            reportValue: report.valueReport,
                                                                            status: report.statusReport
                                                                        };
                                                                    }
                                                                )}
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
                                                                        field: 'status',
                                                                        headerName: 'Status',
                                                                        flex: 1
                                                                    },
                                                                    {
                                                                        field: 'action',
                                                                        headerName: ' ',
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
                        {/*Recebimento*/}
                        {tabIndex === 2 && (
                            <DataGrid
                                rows={billings.map((billing) => {
                                    return {
                                        id: billing.id,
                                        unity: billing.unity.name,
                                        monthOfBilling: billing.monthOfBilling,
                                        statusOfBilling: billing.statusOfBilling,
                                        QTN: billing.qtn,
                                        totalValue: billing.priceTotal
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
                                                                rows={(billings.find((billing) => billing.id === row.id)?.report || []).map(
                                                                    (report) => {
                                                                        return {
                                                                            namePatient: report.patientName,
                                                                            reportDate: report.dateReport,
                                                                            reportTitle: report.titleReport,
                                                                            reportValue: report.valueReport,
                                                                            status: report.statusReport
                                                                        };
                                                                    }
                                                                )}
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
                                                                        field: 'status',
                                                                        headerName: 'Status',
                                                                        flex: 1
                                                                    },
                                                                    {
                                                                        field: 'action',
                                                                        headerName: ' ',
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
    );
};

export default BillingConference;
