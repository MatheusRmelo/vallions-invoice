import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Box, IconButton } from '@mui/material';
import Delete from '@mui/icons-material/DeleteOutline';
import { TableOfValue } from 'types/tableOfValue';
import { RuleAdittion } from './types/RuleType';

interface AddRuleProps {
    rule: RuleAdittion;
    setRule: (value: RuleAdittion) => void;
    onDelete: () => void;

    tableOfValues: TableOfValue[];
}

const AddRule: React.FC<AddRuleProps> = ({ rule, tableOfValues, setRule, onDelete }) => {
    const levelPriorityList = ['5', '4', '3', '2', '1'];
    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                    <InputLabel id="level-label">Nivel de Prioridade</InputLabel>
                    <Select
                        fullWidth
                        id="level"
                        label="level"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={rule.levelPriority || ''}
                        onChange={(event) => {
                            let values = event.target.value;
                            setRule({ ...rule, levelPriority: values });
                        }}
                    >
                        {levelPriorityList.map((levelPriority) => (
                            <MenuItem key={levelPriority} value={levelPriority}>
                                {`NIVEL ${levelPriority}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                    <InputLabel id="tableValue-label">Selecione Tabela de Valores</InputLabel>
                    <Select
                        fullWidth
                        id="tableOfValue"
                        value={rule.tableOfValues?.id || ''}
                        onChange={(event) => {
                            const selectedTableOfValue = tableOfValues.find((tov) => tov.id === event.target.value);
                            setRule({ ...rule, tableOfValues: selectedTableOfValue });
                        }}
                        label="Tabela de Valores"
                        variant="outlined"
                        sx={{ mb: 2 }}
                    >
                        {tableOfValues.map((tableOfValue) => (
                            <MenuItem key={tableOfValue.id} value={tableOfValue.id}>
                                {tableOfValue.description}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                    <InputLabel id="typeCharge-label">Selecione Tipo de Cobrança</InputLabel>
                    <Select
                        fullWidth
                        id="typeCharge"
                        value={rule.type}
                        onChange={(event) => {
                            setRule({ ...rule, type: event.target.value });
                        }}
                        label="Tipo de cobrança"
                        variant="outlined"
                        sx={{ mb: 2 }}
                    >
                        <MenuItem key={'fixed'} value={'fixed'}>
                            {'FIXO'}
                        </MenuItem>
                        <MenuItem key={'percentage'} value={'percentage'}>
                            {'PORCENTAGEM'}
                        </MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    fullWidth
                    id="value"
                    value={rule.value}
                    onChange={(event) => {
                        setRule({ ...rule, value: event.target.value });
                    }}
                    label="Valor/Percentual"
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
            </Grid>

            <Grid item xs={12} sm={1}>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <IconButton onClick={onDelete}>
                        <Delete />
                    </IconButton>
                </Box>
            </Grid>
        </Grid>
    );
};

export default AddRule;
