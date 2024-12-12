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
    InputLabel
} from '@mui/material';
import AddRuleRow from './AddRuleRow';
import { RuleBilling } from 'types/rules_billing';
import { Institute, parseInstitute, getMockInstitutes } from 'types/institute';
import UseAPI from 'hooks/hooks';
import { getMockTableOfValues, parseTableOfValues, TableOfValue } from 'types/tableOfValue';
import { RuleType, RuleAdittion } from './types/RuleType';
import { generateMockTag, parseTagList, Tag } from 'types/tag';
import RuleRow from './RuleRow';
import AddRule from './AddRuleRow';

interface Props {
    open: boolean;
    ruleEdit?: RuleBilling;
    onClose: () => void;
}

const RulesOfInvoicingForm: React.FC<Props> = ({ open, onClose }) => {
    const { get } = UseAPI();

    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [error, setError] = useState<string | undefined>(undefined);
    const [tags, setTags] = React.useState<Tag[]>([]);
    const [tableOfValues, setTableOfValues] = React.useState<TableOfValue[]>([]);
    const [rules, setRules] = useState<RuleType[]>([]);
    const [rulesAddition, setRulesAddition] = useState<RuleAdittion[]>([]);
    const fetchInstitutes = async () => {
        const response = await get('/api/institutionsAccess');
        if (response.ok) {
            const institutes = response.result.map((institute: any) => parseInstitute(institute));
            setInstitutes(institutes);
        } else {
            setError(response.message);
        }

        /// Remover
        if (true) {
            setInstitutes(getMockInstitutes());
        }
    };

    const fetchTags = async () => {
        const response = await get('/api/tags');
        if (response.ok) {
            const tags = parseTagList(response.result);
            setTags(tags);
        } else {
            ///Tratamento de erro
            console.error('Error fetching tags');
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
            ///Tratamento de erro
            console.error('Error fetching table of values');
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
            levelPriority: 0,
            tableOfValues: undefined,
            type: '',
            value: ''
        });

        console.log(newRules);
        setRulesAddition(newRules);
    };

    return (
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
            <DialogTitle>Regras de Faturamento</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <strong>Cadastro de Regras de Faturamento:</strong> Defina as regras de faturamento, incluindo condições e exceções que
                    serão aplicadas. Verifique se todas as configurações estão corretas e de acordo com a instituição antes de salvar.
                    Confirme se deseja cadastrar estas regras de faturamento.
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
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="institute-label">Instituição</InputLabel>

                            <Select fullWidth id="institution" label="Instituição" variant="outlined" sx={{ mb: 2 }}>
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
                            <Select fullWidth id="unidade" label="Unidade" variant="outlined" sx={{ mb: 2 }}>
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
                            <strong>Regras Adicionais:</strong> Estabeleça as regras principais e inclua as regras adicionais, como as
                            prioridades dos estudos, que determinarão o e faturamento
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
                <Button size="large" variant="contained" type="submit" sx={{ color: 'white', backgroundColor: 'rgba(103, 58, 183, 1)' }}>
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RulesOfInvoicingForm;
