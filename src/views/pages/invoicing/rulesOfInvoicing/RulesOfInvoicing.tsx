import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Box, CircularProgress } from '@mui/material';
import CustomTextField from 'ui-component/inputs/customSearchTextField';
import Search from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import useAPI from 'hooks/useAPI';
import { RuleBilling, parseRuleBillingList, toJSONRuleBilling } from 'types/rules_billing';
import RulesOfInvoicingForm from './RulesOfInvoicingForm';
import SnackBarAlert from 'ui-component/SnackBarAlert';

const RulesOfInvoicing = () => {
    const [open, setOpen] = React.useState(false);
    const { get, put } = useAPI();
    const [rules, setRules] = React.useState<RuleBilling[]>([]);
    const [rule, setRule] = React.useState<RuleBilling | undefined>(undefined);
    const [loading, setLoading] = React.useState(false);
    const [openErrorSnack, setOpenErrorSnack] = React.useState(false);
    const [openSucessSnack, setOpenSucessSnack] = React.useState(false);
    const [messageSnack, setMessageSnack] = React.useState('');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleCloseSnack = () => {
        setOpenErrorSnack(false);
        setOpenSucessSnack(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchBillingRules = async () => {
        setLoading(true);
        const response = await get('/api/billing-rules');
        if (response.ok) {
            const data = response.result;
            const rules = parseRuleBillingList(data);
            setRules(rules);
        } else {
            setMessageSnack('Erro' + response.message);
            setOpenErrorSnack(true);
        }
        setLoading(false);
    };

    const getRuleById = (id: number): RuleBilling | undefined => {
        return rules.find((rule) => rule.id === id);
    };

    const updateStatusRule = async (rule: RuleBilling) => {
        const reqCore = await put(`/api/billing-rules/${rule.id}/status`, {
            status: rule.status === 1 ? 0 : 1
        });
        if (reqCore.ok) {
            fetchBillingRules();
            setMessageSnack('Status da Regra de faturamento atualizada com sucesso');
            setOpenSucessSnack(true);
        } else {
            setMessageSnack('Erro ao atualizar situação regra de faturamento');
            setOpenErrorSnack(true);
        }
    };

    React.useEffect(() => {
        fetchBillingRules();
    }, []);

    return (
        <>
            <MainCard title="Regras de Faturamento">
                <Box display="flex" justifyContent="space-between">
                    <CustomTextField label="Search" prefixIcon={<Search sx={{ color: 'action.active', mr: 1 }} />} />

                    <Fab
                        size="small"
                        color="primary"
                        aria-label="add"
                        onClick={() => {
                            setRule(undefined);

                            handleOpen();
                        }}
                    >
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
                        '& .MuiDataGrid-cell': { borderBottom: 'none', fontSize: '1.2vh' },
                        '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', fontSize: '1.5vh' },
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
                            rows={rules.map((rule) => ({
                                id: rule.id,
                                rulesDescription: rule.rulesDescription,
                                institution: '',
                                unity: rule.unity,
                                status: rule.status
                            }))}
                            columns={[
                                { field: 'rulesDescription', minWidth: 150, headerName: 'Descrição Regra', flex: 1 },
                                { field: 'institution', minWidth: 150, headerName: 'Instituição', flex: 1 },
                                { field: 'unity', minWidth: 150, headerName: 'Unidade', flex: 1 },
                                {
                                    field: 'actions',
                                    minWidth: 150,
                                    headerName: 'Editar',
                                    flex: 1,
                                    renderCell: (params) => (
                                        <Box display="flex" justifyContent="center">
                                            <Edit
                                                onClick={() => {
                                                    setRule(getRuleById(params.row.id as number));
                                                    handleOpen();
                                                }}
                                                style={{
                                                    fontSize: '2.5vh',
                                                    marginBottom: '1vh',
                                                    color: 'rgba(103, 58, 183, 1)'
                                                }}
                                            />
                                        </Box>
                                    )
                                },
                                {
                                    field: 'status',
                                    minWidth: 150,
                                    headerName: 'Inativo/Ativo',
                                    flex: 1,
                                    renderCell: (params) => (
                                        <Switch
                                            checked={params.value === 1}
                                            onChange={() => {
                                                updateStatusRule(getRuleById(params.row.id as number) as RuleBilling);
                                            }}
                                            color="primary"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    )
                                }
                            ]}
                        />
                    )}
                </Box>
                <RulesOfInvoicingForm open={open} onClose={handleClose} ruleEdit={rule} />
                <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={handleCloseSnack} />
                <SnackBarAlert open={openSucessSnack} message={messageSnack} severity="success" onClose={handleCloseSnack} />
            </MainCard>
        </>
    );
};

export default RulesOfInvoicing;
