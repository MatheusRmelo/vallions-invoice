import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Box, IconButton } from '@mui/material';
import Delete from '@mui/icons-material/DeleteOutline';
import { Tag } from 'types/tag';
import { TableOfValue } from 'types/tableOfValue';
import { RuleType } from './types/RuleType';

interface RuleRowProps {
    rule: RuleType;
    setRule: (value: RuleType) => void;
    onDelete: () => void;

    tags: Tag[];
    tableOfValues: TableOfValue[];
}

enum TypeChargeEnum {
    FIXED = 'FIXO',
    PERCENTAGE = 'PERCENTUAL'
}

const RuleRow: React.FC<RuleRowProps> = ({ rule, tags, tableOfValues, setRule, onDelete }) => {
    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
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
                <FormControl fullWidth size="small">
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
                    size="small"
                    sx={{ mb: 2 }}
                />
            </Grid>
            <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                    <InputLabel id="tag-label">Selecione a TAG</InputLabel>
                    <Select
                        fullWidth
                        id="tag"
                        label="TAG"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={rule.tag?.id || ''}
                        onChange={(event) => {
                            const selectedTag = tags.find((t) => t.id === event.target.value);
                            setRule({ ...rule, tag: selectedTag || undefined });
                        }}
                    >
                        {tags.map((tag) => (
                            <MenuItem key={tag.id} value={tag.id}>
                                {tag.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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

export default RuleRow;
