import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    DialogContentText,
    Grid,
    TextField,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress
} from '@mui/material';
import AddRuleRow from './AddRuleRow';
import { RuleBilling, toJSONRuleBilling } from 'types/rules_billing';
import { Institute, parseInstitute } from 'types/institute';
import UseAPI from 'hooks/useAPI';
import { parseTableOfValues, TableOfValue } from 'types/tableOfValue';
import { RuleType, RuleAdittion } from './types/RuleType';
import { parseTagList, Tag } from 'types/tag';
import RuleRow from './RuleRow';
import AddRule from './AddRuleRow';
import SnackBarAlert from 'ui-component/SnackBarAlert';
import { Unity, parseUnityList } from 'types/unity';
import { Rule } from '@mui/icons-material';

interface Props {
    open: boolean;
    ruleEdit?: RuleBilling;
    onClose: (success: boolean) => void;
}

const RulesOfInvoicingForm: React.FC<Props> = ({ open, onClose, ruleEdit }) => {
    const { get, post, put, del } = UseAPI();

    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [error, setError] = useState<string | undefined>(undefined);
    const [tags, setTags] = React.useState<Tag[]>([]);
    const [tableOfValues, setTableOfValues] = React.useState<TableOfValue[]>([]);
    const [rules, setRules] = useState<RuleType[]>([]);
    const [rulesAddition, setRulesAddition] = useState<RuleAdittion[]>([]);
    const [description, setDescription] = useState<string>('');
    const [institution, setInstitution] = useState<Institute | undefined>(undefined);
    const [unit, setUnit] = useState<Unity | undefined>(undefined);
    const [unities, setUnities] = useState<Unity[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [idRules, setIdRules] = React.useState('');
    const [openErrorSnack, setOpenErrorSnack] = React.useState(false);
    const [openSucessSnack, setOpenSucessSnack] = React.useState(false);
    const [messageSnack, setMessageSnack] = React.useState('');
    const [idsForDelete, setIdsForDelete] = React.useState<number[]>([]);
    const [idsForDeleteAddition, setIdsForDeleteAddition] = React.useState<number[]>([]);

    const getInstitutes = async () => {
        const response = await get('/api/institutionsAccess');
        if (response.ok) {
            const institutes = response.result.map((institute: any) => parseInstitute(institute));
            setInstitutes(institutes);
        } else {
            setError(
                'Não foi possível carregar as instituições. Erro:' +
                response.message);
        }
    };

    const getTags = async () => {
        const response = await get('/api/tags');
        if (response.ok) {
            const tags = parseTagList(response.result);
            setTags(tags);
        } else {
            setError('Não foi possível carregar as tags.' + response.message);
        }
    };

    const getTableOfValues = async () => {
        const response = await get('/api/medical-procedure-costs');
        if (response.ok) {
            const tableOfValues = parseTableOfValues(response.result);
            setTableOfValues(tableOfValues);
        } else {
            setError('Não foi possível carregar a tabela de valores.' + response.message);
        }
    };

    /// Init State
    useEffect(() => {
        getInstitutes();
        getTags();
        getTableOfValues();
    }, []);

    // use Effect para ser executado ao abrir o dialog
    useEffect(() => {
        if (ruleEdit) {
            setIdRules(ruleEdit.id?.toString() || '');
            setDescription(ruleEdit.rulesDescription);
            setInstitution(institutes[0]);
            setUnit(ruleEdit.unity);
            setInstitution(institutes[0]);
            setUnit(ruleEdit.unity);
            setRules([]);
            setRulesAddition([]);
            if (ruleEdit.id !== null) {
                getDetailsRule(ruleEdit.id);
            }
        }
    }, [ruleEdit]);

    useEffect(() => {
        if (open && !ruleEdit) {
            setIdRules('');
            setDescription('');
            setUnit(undefined);
            setRules([]);
            setInstitution(undefined);
            setRulesAddition([]);

        } setIdsForDelete([]);
        setIdsForDeleteAddition([]);
    }, [open]);

    const getDetailsRule = async (id: Number) => {
        const response = await get(`/api/billing-rules/${id}`);
        if (response.ok) {
            const rule = response.result;
            let billingRuleGoals: RuleType[] = rule.billing_rule_goals.map((e: any) => {
                let tag = tags.find((tag) => tag.id == e.tag_fk);
                let table = tableOfValues.find((table) => table.id == e.medical_procedure_cost_fk);

                return {
                    type: e.type,
                    value: e.value,
                    tableOfValues: table,
                    tag: tag,
                    id: e.id
                };
            });

            let priorityBillingRules: RuleAdittion[] = rule.priority_billing_rules.map((e: any) => {
                let table = tableOfValues.find((table) => table.id == e.medical_procedure_cost_fk);
                return {
                    levelPriority: e.priority,
                    tableOfValues: table,
                    type: e.type,
                    value: e.value,
                    id: e.id
                };
            });

            setRules(billingRuleGoals);
            setRulesAddition(priorityBillingRules);
        } else {
            setError('Não foi possível carregar as regras.' + response.message);
        }
    };
    const handleClickAddRule = () => {
        var newRules = [...rules];
        newRules.push({
            type: '',
            value: '',
            tableOfValues: undefined,
            tag: undefined,
            id: undefined
        });
        console.log(newRules);
        setRules(newRules);
    };

    const handleClickAddRulesAditional = () => {
        var newRules = [...rulesAddition];
        newRules.push({
            levelPriority: '0',
            tableOfValues: undefined,
            type: '',
            value: '',
            id: undefined
        });

        setRulesAddition(newRules);
    };
    const getUnities = async () => {
        const response = await get(`/api/branchAccessUsersIntitution?institution=${institution?.id_institution}`);
        if (response.ok) {
            const unities = parseUnityList(response.result);
            setUnities(unities);
        } else {
            setError('Não foi possível carregar as unidades.' + response.message);
        }
    };
    const handleCloseSnack = () => {
        setOpenErrorSnack(false);
        setOpenSucessSnack(false);
    };

    const deleteRule = async (index: number) => {
        if (rules[index].id === undefined) {
            let newArray = [...rules];
            newArray = newArray.filter((element, checkIndex) => checkIndex !== index);
            setRules(newArray);
            return;
        }
        // const req = await del(`/api/billing-rule-goals/${rules[index].id}`);
        // if (req.ok) {
        // let newArray = [...rules];
        // newArray = newArray.filter((element, checkIndex) => checkIndex !== index);
        // setRules(newArray);
        setIdsForDelete([...idsForDelete, rules[index].id]);
        // } else {
        //     setError('Falha ao deletar a regra de faturamento.');
        // }
    };

    const deleteRuleAddition = async (index: number) => {
        if (rulesAddition[index].id === undefined) {
            let newArray = [...rulesAddition];
            newArray = newArray.filter((element, checkIndex) => checkIndex !== index);
            setRulesAddition(newArray);
            return;
        }
        // const req = await del(`/api/priority-billing-rules/${rulesAddition[index].id}`);
        // let newArray = [...rulesAddition];
        // newArray = newArray.filter((element, checkIndex) => checkIndex !== index);
        // setRulesAddition(newArray);
        setIdsForDeleteAddition([...idsForDeleteAddition, rulesAddition[index].id]);

        // if (req.ok) {
        //     let newArray = [...rulesAddition];
        //     newArray = newArray.filter((element, checkIndex) => checkIndex !== index);
        //     setRulesAddition(newArray);
        // } else {
        //     setError('Falha ao deletar a regra de faturamento.');
        // }
    };

    useEffect(() => {
        if (error) {
            setOpenErrorSnack(true);
            setMessageSnack(error);
        }
    }, [error]);

    useEffect(() => {
        if (institution) getUnities();
    }, [institution]);

    const getUnityByName = (name: string) => {
        let rows = unities;
        let filtered = rows.filter((element) => element.name === name.valueOf());
        if (filtered.length === 0) return null;
        return filtered[0];
    };

    const saveRules = async () => {
        var newUnity = getUnityByName(unit!.name);
        const rulesBilling: RuleBilling = {
            id: null,
            rulesDescription: description,
            unity: newUnity!,
            status: 1
        };
        console.table(rulesBilling);
        console.log(ruleEdit ? 'edit' : 'new');
        const reqCore = ruleEdit
            ? await put(`/api/billing-rules/${ruleEdit.id}`, toJSONRuleBilling(rulesBilling))
            : await post('/api/billing-rules', toJSONRuleBilling(rulesBilling));
        const reqId = reqCore.result.id;
        setIdRules(reqId);
        if (reqCore.ok) {
            const reqsRulesBillingsRaw = rules.map((e) =>
                ruleEdit && e.id
                    ? put(`/api/billing-rule-goals/${e.id}`, {
                        type: e.type,
                        value: e.value,
                        medical_procedure_cost_fk: e.tableOfValues?.id,
                        billing_rule_fk: reqId,
                        tag_fk: e.tag?.id
                    })
                    : post('/api/billing-rule-goals', {
                        type: e.type,
                        value: e.value,
                        medical_procedure_cost_fk: e.tableOfValues?.id,
                        billing_rule_fk: reqId,
                        tag_fk: e.tag?.id
                    })
            );
            const reqsRulesPriorityRaw = rulesAddition.map((e) =>
                ruleEdit && e.id
                    ? put(`/api/priority-billing-rules/${e.id}`, {
                        priority: e.levelPriority,
                        type: e.type,
                        value: e.value,
                        medical_procedure_cost_fk: e.tableOfValues?.id,
                        billing_rule_fk: reqId
                    })
                    : post('/api/priority-billing-rules', {
                        priority: e.levelPriority,
                        type: e.type,
                        value: e.value,
                        medical_procedure_cost_fk: e.tableOfValues?.id,
                        billing_rule_fk: reqId
                    })
            );
            console.log(reqsRulesBillingsRaw);
            const reqsRulesBillings = await Promise.all(reqsRulesBillingsRaw);
            const reqsRulesPriority = await Promise.all(reqsRulesPriorityRaw);
            if (ruleEdit) {
                const futureReqsDelRulesBillings = idsForDelete.map((id) => del(`/api/billing-rule-goals/${id}`));
                const futureReqsDelRulesPriority = idsForDeleteAddition.map((id) => del(`/api/priority-billing-rules/${id}`));
                const reqsDelRulesBillings = await Promise.all(futureReqsDelRulesBillings);
                const reqsDelRulesPriority = await Promise.all(futureReqsDelRulesPriority);
                if (reqsDelRulesBillings.every((e) => e.ok) && reqsDelRulesPriority.every((e) => e.ok)) {
                    const updatedRulesAddition = rulesAddition.filter(rule =>
                        !idsForDeleteAddition.includes(rule.id!)
                    );
                    setRulesAddition(updatedRulesAddition);

                    const updatedRules = rules.filter(rule =>
                        !idsForDelete.includes(rule.id!)
                    );
                    setRules(updatedRules);

                    setIdsForDelete([]);
                    setIdsForDeleteAddition([]);
                } else {
                    const error: string[] = reqsDelRulesBillings
                        .concat(reqsDelRulesPriority)
                        .filter((e) => !e.ok)
                        .map((e) => e.message);
                    setError('Falha ao deletar algumas regras de faturamento: ' + error.join(', '));
                }
            }
            if (reqsRulesBillings.every((e) => e.ok) && reqsRulesPriority.every((e) => e.ok)) {
                onClose(true);
                setOpenSucessSnack(true);
                setMessageSnack('Regras de faturamento salvas com sucesso!');
                setError(undefined);
            } else {
                const error: string[] = reqsRulesBillings
                    .concat(reqsRulesPriority)
                    .filter((e) => !e.ok)
                    .map((e) => e.message);
                setError('Falha ao salvar às Regras de faturamento: ' + error.join(', '));
            }
        } else {
            setError('Falha ao salvar às Regras de faturamento');
        }
    };

    const editRules = async () => {
        const rulesBilling: RuleBilling = {
            id: ruleEdit?.id || null,
            rulesDescription: description,
            unity: unit!,
            status: ruleEdit?.status || 1
        };
        console.log('Regras de faturamento: ' + rulesBilling);
        const reqCore = await put('/api/billing-rules', toJSONRuleBilling(rulesBilling));
        const reqId = reqCore.result.id;
        if (reqCore.ok) {
            const reqsRulesBillingsRaw = rules.map((e) =>
                post('/api/billing-rule-goals', {
                    type: e.type,
                    value: e.value,
                    medical_procedure_cost_fk: e.tableOfValues?.id,
                    billing_rule_fk: reqId,
                    tag_fk: `${e.tag?.id}`
                })
            );
            const reqsRulesPriorityRaw = rulesAddition.map((e) =>
                post('/api/billing-rule-priority', {
                    priority: e.levelPriority,
                    type: e.type,
                    value: e.value,
                    medical_procedure_cost_fk: e.tableOfValues?.id,
                    billing_rule_fk: reqId
                })
            );
            console.log(reqsRulesBillingsRaw);
            const reqsRulesBillings = await Promise.all(reqsRulesBillingsRaw);
            const reqsRulesPriority = await Promise.all(reqsRulesPriorityRaw);

            if (reqsRulesBillings.every((e) => e.ok) && reqsRulesPriority.every((e) => e.ok)) {
                setError(undefined);
            } else {
                const error: string[] = reqsRulesBillings
                    .concat(reqsRulesPriority)
                    .filter((e) => !e.ok)
                    .map((e) => e.message);
                setError('Falha ao salvar às Regras de faturamento: ' + error.join(', '));
            }
        } else {
            setError('Falha ao salvar às Regras de faturamento');
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={() => onClose(false)}
                maxWidth={false}
                fullWidth
                PaperProps={{
                    sx: {
                        width: { xs: '100%', md: '60%' },
                        height: 'auto',
                        padding: '20px',
                        margin: 0,
                        maxHeight: '100vh',
                        borderRadius: '20px'
                    }
                }}
            >
                {loading ? (
                    <Box sx={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <DialogTitle sx={{ fontSize: '20px' }}>Regras de Faturamento</DialogTitle>
                        <DialogContent>
                            <DialogContentText sx={{ fontSize: '12px' }}>
                                <strong>Cadastro de Regras de Faturamento:</strong> Defina as regras de faturamento, incluindo condições e
                                exceções que serão aplicadas. Verifique se todas as configurações estão corretas e de acordo com a
                                instituição antes de salvar. Confirme se deseja cadastrar estas regras de faturamento.
                            </DialogContentText>
                            <Box mt={'6vh'} />
                            <Grid container spacing={2}>
                                {
                                    ruleEdit != null ?
                                        <Grid item xs={12} md={2}>
                                            <TextField value={idRules} fullWidth id="idRules" label="ID Regra" variant="outlined" sx={{ mb: 2 }} />
                                        </Grid> : <></>
                                }

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        id="rulesDescription"
                                        label="Descrição da Regra de Faturamento"
                                        variant="outlined"
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="institute-label">Instituição</InputLabel>
                                        <Select
                                            fullWidth
                                            id="institution"
                                            label="Instituição"
                                            variant="outlined"
                                            sx={{ mb: 2 }}
                                            value={institution?.id_institution || ''}
                                            onChange={(event) => {
                                                const institute = institutes.find(
                                                    (institute) => institute.id_institution === event.target.value
                                                );
                                                setInstitution(institute);
                                                getUnities();
                                            }}
                                        >
                                            {institutes.map((institution) => (
                                                <MenuItem key={institution.id_institution} value={institution.id_institution}>
                                                    {institution.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="unity-label">Unidade</InputLabel>
                                        <Select
                                            fullWidth
                                            id="unidade"
                                            label="Unidade"
                                            variant="outlined"
                                            sx={{ mb: 2 }}
                                            value={unit?.name || ''}
                                            onChange={(event) => {
                                                const unit: Unity | undefined = unities.find((unit) => unit.name === event.target.value);
                                                setUnit(unit!);
                                            }}
                                        >
                                            {unities.map((unity) => (
                                                <MenuItem key={unity.name} value={unity.name}>
                                                    {unity.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Box mt={'6vh'} />
                            <Box display={'flex'} justifyContent={'space-between'} flexDirection={{ xs: 'column', md: 'row' }}>
                                <Box display={'flex'} flexDirection={'column'} marginRight={{ md: '16px' }} mb={{ xs: '16px', md: 0 }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '12px' }}>DEFINA AS REGRAS</span>
                                    <Box height={'0.8vh'} />
                                    <span style={{ fontSize: '12px' }}>
                                        <strong>Definição da Regra Principal:</strong> Estabeleça a regra principal que guiará o processo de
                                        faturamento. Esta regra será a base para todas as condições e execuções do faturamento.
                                    </span>
                                </Box>
                                <Button
                                    variant="contained"
                                    sx={{
                                        width: '18vh',
                                        height: '3.5vh',
                                        fontWeight: 'bold',
                                        margin: '0',
                                        padding: '0',
                                        fontSize: '12px',
                                        backgroundColor: 'rgba(103, 58, 183, 1)',
                                        minWidth: '10vh'
                                    }}
                                    onClick={handleClickAddRule}
                                >
                                    Adicionar Regra
                                </Button>
                            </Box>
                            <Box mt={'6vh'} />
                            {rules
                                .filter(rule => !idsForDelete.includes(rule.id!))
                                .map((element, index) => (
                                    <RuleRow
                                        rule={element}
                                        tableOfValues={tableOfValues}
                                        tags={tags}
                                        setRule={(value) => {
                                            let newArray = [...rules];
                                            newArray[index] = value;
                                            setRules(newArray);
                                        }}
                                        onDelete={() => {
                                            deleteRule(index);
                                        }}
                                    />
                                ))}

                            {/* Mocado remove dps */}
                            <Box mt={'6vh'} />
                            <Box display={'flex'} justifyContent={'space-between'} flexDirection={{ xs: 'column', md: 'row' }}>
                                <Box display={'flex'} flexDirection={'column'} marginRight={{ md: '16px' }} mb={{ xs: '16px', md: 0 }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '12px' }}>REGRAS ADICIONAIS</span>
                                    <Box height={'0.8vh'} />
                                    <span style={{ fontSize: '12px' }}>
                                        <strong>Regras Adicionais:</strong> Estabeleça as regras principais e inclua as regras adicionais,
                                        como as prioridades dos estudos, que determinarão o e faturamento
                                    </span>
                                </Box>
                                <Button
                                    variant="contained"
                                    sx={{
                                        width: '18vh',
                                        height: '3.5vh',
                                        fontWeight: 'bold',
                                        margin: '0',
                                        padding: '0',
                                        fontSize: '12px',
                                        backgroundColor: 'rgba(103, 58, 183, 1)',
                                        minWidth: '10vh'
                                    }}
                                    onClick={handleClickAddRulesAditional}
                                >
                                    Adicionar Regra
                                </Button>
                            </Box>
                            <Box mt={'6vh'} />
                            {rulesAddition
                                .filter(rule => !idsForDeleteAddition.includes(rule.id!))
                                .map((element, index) => (
                                    <AddRuleRow
                                        rule={element}
                                        tableOfValues={tableOfValues}
                                        setRule={(value) => {
                                            let newArray = [...rulesAddition];
                                            newArray[index] = value;
                                            setRulesAddition(newArray);
                                        }}
                                        onDelete={() => {
                                            deleteRuleAddition(index);
                                        }}
                                    />
                                ))}
                            {/* <AddRuleRow mockInstitutes={mockInstitutes} /> */}
                            {/* Mocado remove dps */}
                            {/* <AddRuleRow mockInstitutes={mockInstitutes} /> */}
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" onClick={() => onClose(false)} color="primary" size="large">
                                Fechar
                            </Button>
                            <Box width={5} />
                            <Button
                                size="large"
                                variant="contained"
                                onClick={() => {
                                    saveRules();
                                }}
                                sx={{ color: 'white', backgroundColor: 'rgba(103, 58, 183, 1)' }}
                            >
                                Salvar
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
            <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={handleCloseSnack} />
            <SnackBarAlert open={openSucessSnack} message={messageSnack} severity="success" onClose={handleCloseSnack} />
        </>
    );
};

export default RulesOfInvoicingForm;
