import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Box } from '@mui/material';
import CustomTextField from 'ui-component/inputs/customSearchTextField';
import Search from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import useAPI from 'hooks/hooks';
import { RuleBilling, parseRuleBillingList, generateMockRuleBilling } from 'types/rules_billing';
import RulesOfInvoicingForm from './rulesOfInvoicingForm';

const RulesOfInvoicing = () => {
    const [open, setOpen] = React.useState(false);
    const { get } = useAPI();
    const [rules, setRules] = React.useState<RuleBilling[]>([]);
    const [rule, setRule] = React.useState<RuleBilling | undefined>(undefined);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchBillingRules = async () => {
        const response = await get('/api/billing-rules');
        if (response.ok) {
            const data = response.result;
            const rules = parseRuleBillingList(data);
            setRules(rules);
        } else {
            ///Tratamento de erro
            console.error('Error fetching billing rules');
        }
        /// Remover
        if (true) {
            setRules(generateMockRuleBilling());
        }
    };

    const getRuleById = (id: number): RuleBilling | undefined => {
        return rules.find((rule) => rule.id === id);
    };

    React.useEffect(() => {
        fetchBillingRules();
    }, []);

    return (
        <>
            <MainCard title="Regras de Faturamento">
                <Box display="flex" justifyContent="space-between">
                    <CustomTextField label="Search" prefixIcon={<Search sx={{ color: 'action.active', mr: 1 }} />} />

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
                        '& .MuiDataGrid-cell': { borderBottom: 'none', fontSize: '1.2vh' },
                        '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', fontSize: '1.5vh' },
                        '& .MuiDataGrid-footerContainer': { borderTop: 'none' }
                    }}
                >
                    <DataGrid
                        disableRowSelectionOnClick
                        rows={rules.map((rule) => ({
                            id: rule.id,
                            rulesDescription: rule.rulesDescription,
                            institution: rule.institution,
                            unity: rule.unity,
                            status: rule.status
                        }))}
                        columns={[
                            { field: 'rulesDescription', headerName: 'Descrição Regra', flex: 2 },
                            { field: 'institution', headerName: 'Instituição', flex: 3 },
                            { field: 'unity', headerName: 'Unidade', flex: 1 },
                            {
                                field: 'actions',
                                headerName: 'Editar',
                                flex: 1,
                                renderCell: (params) => (
                                    <Box display="flex" justifyContent="center">
                                        <Edit
                                            onClick={() => {
                                                setRule(getRuleById(params.row.id));
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
                                headerName: 'Inativo/Ativo',
                                flex: 1,
                                renderCell: (params) => (
                                    <Switch
                                        checked={params.value === '1'}
                                        color="primary"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                )
                            }
                        ]}
                    />
                </Box>
                <RulesOfInvoicingForm open={open} onClose={handleClose} ruleEdit={rule} />
            </MainCard>
        </>
    );
};

export default RulesOfInvoicing;
