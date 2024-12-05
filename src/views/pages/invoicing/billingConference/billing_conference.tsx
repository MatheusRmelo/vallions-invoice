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
    IconButton
} from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import CustomTextField from 'ui-component/inputs/customSearchTextField';
import MainCard from 'ui-component/cards/MainCard';
import { SendOutlined, Search, ExpandMore, ExpandLess } from '@mui/icons-material';
import { JSX } from 'react/jsx-runtime';

const BillingConference: React.FC = () => {
    const [startDate, setStartDate] = React.useState(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = React.useState(new Date().toISOString().slice(0, 10));
    const [expandedRowIds, setExpandedRowIds] = React.useState<number[]>([]); // Estado para gerenciar linhas expandidas

    const handleExpandClick = (id: number) => {
        setExpandedRowIds((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const mockColumnsSearch: GridColDef[] = [
        {
            field: 'expand',
            headerName: '',
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
    ];

    const mockRowsSearch: GridRowsProp = [
        {
            id: 1,
            namePatient: 'John Doe',
            study_description: 'Estudo 1',
            dateOfStudy: '01/01/2021',
            unity: 'Unidade 1',
            quantity: 1,
            valueUnit: 100.0,
            valueTotal: 100.0
        },
        {
            id: 2,
            namePatient: 'Jane Smith',
            study_description: 'Estudo 2',
            dateOfStudy: '02/01/2021',
            unity: 'Unidade 2',
            quantity: 1,
            valueUnit: 200.0,
            valueTotal: 200.0
        }
    ];

    const [tabIndex, setTabIndex] = React.useState(0);
    const mockSelects = ['Teste1', 'Teste2', 'Teste3'];

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    const getRowsWithDetails = () => {
        var listT: { [x: string]: any; id?: string; isDetail?: boolean; details?: JSX.Element }[] = [];

        mockRowsSearch.forEach((row) => {
            listT.push(row);
            if (expandedRowIds.includes(row.id)) {
                listT.push({
                    ...row,
                    id: `${row.id}-details`,
                    isDetail: true,
                    details: (
                        <Box mt={2} p={2} bgcolor="grey.100">
                            <div>Detalhes da linha {row.id}</div>
                        </Box>
                    )
                });
            }
        });
        console.log(listT);
        const rowsWithDetails: GridRowsProp = [...listT];
        console.log(rowsWithDetails);
        return rowsWithDetails;
    };

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
                    <div style={{ height: 'auto', width: '100%', marginTop: 20 }}>
                        <DataGrid
                            rows={getRowsWithDetails()}
                            columns={mockColumnsSearch}
                            hideFooter
                            getRowId={(row) => row.id}
                            components={{
                                Row: (props) => {
                                    const { row } = props;
                                    return (
                                        <>
                                            <div {...props} />
                                            {row.isDetail && <div style={{ gridColumn: '1 / -1' }}>{row.details}</div>}
                                        </>
                                    );
                                }
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </MainCard>
    );
};

export default BillingConference;
