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
import { Institute, parseInstitute, getMockInstitutes } from 'types/institute';
import UseAPI from 'hooks/useAPI';
import { getMockTableOfValues, parseTableOfValues, TableOfValue } from 'types/tableOfValue';
import { RuleType, RuleAdittion } from './types/RuleType';
import { generateMockTag, parseTagList, Tag } from 'types/tag';
import RuleRow from './RuleRow';
import AddRule from './AddRuleRow';
import SnackBarAlert from 'ui-component/SnackBarAlert';

interface Props {
    open: boolean;
    ruleEdit?: RuleBilling;
    onClose: () => void;
}

const RulesOfInvoicingForm: React.FC<Props> = ({ open, onClose, ruleEdit }) => {
    const { get, post, put } = UseAPI();

    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [error, setError] = useState<string | undefined>(undefined);
    const [tags, setTags] = React.useState<Tag[]>([]);
    const [tableOfValues, setTableOfValues] = React.useState<TableOfValue[]>([]);
    const [rules, setRules] = useState<RuleType[]>([]);
    const [rulesAddition, setRulesAddition] = useState<RuleAdittion[]>([]);
    const [description, setDescription] = useState<string>('');
    const [institution, setInstitution] = useState<Institute | undefined>(undefined);
    const [unit, setUnit] = useState<string | undefined>(undefined);
    const [loading, setLoading] = React.useState(false);

    const [openErrorSnack, setOpenErrorSnack] = React.useState(false);
    const [openSucessSnack, setOpenSucessSnack] = React.useState(false);
    const [messageSnack, setMessageSnack] = React.useState('');
    const fetchInstitutes = async () => {
        const response = await get('/api/institutionsAccess');
        if (response.ok) {
            const institutes = response.result.map((institute: any) => parseInstitute(institute));
            setInstitutes(institutes);
        } else {
            setError(response.message);
        }
    };

    const fetchTags = async () => {
        const response = await get('/api/tags');
        if (response.ok) {
            const tags = parseTagList(response.result);
            setTags(tags);
        } else {
            setError('Não foi possível carregar as tags.' + response.message);
        }
        /// Remover
        if (true) {
            setTags(generateMockTag());
        }
    };

    const fetchTableOfValues = async () => {
        const response = await get('/api/medical-procedure-costs');
        if (response.ok) {
            const tableOfValues = parseTableOfValues(response.result);
            setTableOfValues(tableOfValues);
        } else {
            setError('Não foi possível carregar a tabela de valores.' + response.message);
        }
        /// Remover
        if (true) {
            setTableOfValues(getMockTableOfValues());
        }
    };

    /// Init State
    useEffect(() => {
        fetchInstitutes();
        fetchTags();
        fetchTableOfValues();
    }, []);

    const handleClickAddRule = () => {
        var newRules = [...rules];
        newRules.push({
            type: '',
            value: '',
            tableOfValues: undefined,
            tag: undefined
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
            value: ''
        });

        console.log(newRules);
        setRulesAddition(newRules);
    };

    const handleCloseSnack = () => {
        setOpenErrorSnack(false);
        setOpenSucessSnack(false);
    };

    useEffect(() => {
        setOpenErrorSnack(true);
    }, [error]);

    const saveRules = async () => {
        const rulesBilling: RuleBilling = {
            id: null,
            rulesDescription: description,
            institution: institution?.id || '',
            unity: unit || '',
            status: '1'
        };
        const reqCore = await post('/api/billing-rules', toJSONRuleBilling(rulesBilling));
        const reqId = reqCore.result.id;
        if (reqCore.ok) {
            const reqsRulesBillingsRaw = rules.map((e) =>
                post('/api/billing-rule-goals', {
                    type: e.type,
                    value: e.value,
                    medical_procedure_cost_fk: e.tableOfValues?.id,
                    billing_rule_fk: reqId,
                    tag_fk: e.tag?.id
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
        <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                console.log('Click submit');
                event.preventDefault();
                saveRules();
            }}
        >
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth={false}
                fullWidth
                PaperProps={{
                    sx: {
                        width: '60%',
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
                        <DialogTitle>Regras de Faturamento</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <strong>Cadastro de Regras de Faturamento:</strong> Defina as regras de faturamento, incluindo condições e
                                exceções que serão aplicadas. Verifique se todas as configurações estão corretas e de acordo com a
                                instituição antes de salvar. Confirme se deseja cadastrar estas regras de faturamento.
                            </DialogContentText>
                            <Box mt={'6vh'} />
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <TextField fullWidth id="idRules" label="ID Regra" variant="outlined" sx={{ mb: 2 }} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        id="rulesDescription"
                                        label="Descrição da Regra de Faturamento"
                                        variant="outlined"
                                        onChange={(event) => setDescription(event.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="institute-label">Instituição</InputLabel>

                                        <Select
                                            fullWidth
                                            id="institution"
                                            label="Instituição"
                                            variant="outlined"
                                            sx={{ mb: 2 }}
                                            onChange={(event) => {
                                                const institute = institutes.find((institute) => institute.id === event.target.value);
                                                setInstitution(institute);
                                            }}
                                        >
                                            {institutes.map((institution) => (
                                                <MenuItem key={institution.id} value={institution.id}>
                                                    {institution.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    {/* Não Há get de unidade */}
                                    <FormControl fullWidth>
                                        <InputLabel id="institute-label">Unidade</InputLabel>
                                        <Select
                                            fullWidth
                                            id="unidade"
                                            label="Unidade"
                                            variant="outlined"
                                            sx={{ mb: 2 }}
                                            onChange={(event) => {
                                                setUnit(event.target.value as string);
                                            }}
                                        >
                                            {institutes.map((institution) => (
                                                <MenuItem key={institution.id} value={institution.id}>
                                                    {institution.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Box mt={'6vh'} />
                            <Box display={'flex'} justifyContent={'space-between'}>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.5vh' }}>DEFINA AS REGRAS</span>
                                    <Box height={'0.8vh'} />
                                    <span style={{ fontSize: '1.2vh', color: 'grey' }}>
                                        <strong>Definição da Regra Principal:</strong> Estabeleça a regra principal que guiará o processo de
                                        faturamento. Esta regra será a base para todas as condições e execuções do faturamento.
                                    </span>
                                </Box>
                                <Button
                                    variant="contained"
                                    sx={{
                                        width: '15vh',
                                        height: '3.5vh',
                                        fontWeight: 'bold',
                                        fontSize: '1.5vh',
                                        backgroundColor: 'rgba(103, 58, 183, 1)'
                                    }}
                                    onClick={handleClickAddRule}
                                >
                                    Adicionar Regra
                                </Button>
                            </Box>
                            <Box mt={'6vh'} />
                            {rules.map((element, index) => (
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
                                        let newArray = [...rules];
                                        newArray = newArray.filter((element, checkIndex) => checkIndex !== index);
                                        setRules(newArray);
                                    }}
                                />
                            ))}

                            {/* Mocado remove dps */}
                            <Box mt={'6vh'} />
                            <Box display={'flex'} justifyContent={'space-between'}>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.5vh' }}>REGRAS ADICIONAIS</span>
                                    <Box height={'0.8vh'} />
                                    <span style={{ fontSize: '1.2vh', color: 'grey' }}>
                                        <strong>Regras Adicionais:</strong> Estabeleça as regras principais e inclua as regras adicionais,
                                        como as prioridades dos estudos, que determinarão o e faturamento
                                    </span>
                                </Box>
                                <Button
                                    variant="contained"
                                    sx={{
                                        width: '15vh',
                                        height: '3.5vh',
                                        fontWeight: 'bold',
                                        fontSize: '1.5vh',
                                        backgroundColor: 'rgba(103, 58, 183, 1)'
                                    }}
                                    onClick={handleClickAddRulesAditional}
                                >
                                    Adicionar Regra
                                </Button>
                            </Box>
                            <Box mt={'6vh'} />
                            {rulesAddition.map((element, index) => (
                                <AddRuleRow
                                    rule={element}
                                    tableOfValues={tableOfValues}
                                    setRule={(value) => {
                                        let newArray = [...rulesAddition];
                                        newArray[index] = value;
                                        setRulesAddition(newArray);
                                    }}
                                    onDelete={() => {
                                        let newArray = [...rulesAddition];
                                        newArray = newArray.filter((element, checkIndex) => checkIndex !== index);
                                        setRulesAddition(newArray);
                                    }}
                                />
                            ))}
                            {/* <AddRuleRow mockInstitutes={mockInstitutes} /> */}
                            {/* Mocado remove dps */}
                            {/* <AddRuleRow mockInstitutes={mockInstitutes} /> */}
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" onClick={onClose} color="primary" size="large">
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
                    </>
                )}
            </Dialog>
            <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={handleCloseSnack} />
            <SnackBarAlert open={openSucessSnack} message={messageSnack} severity="success" onClose={handleCloseSnack} />
        </form>
    );
};

export default RulesOfInvoicingForm;
