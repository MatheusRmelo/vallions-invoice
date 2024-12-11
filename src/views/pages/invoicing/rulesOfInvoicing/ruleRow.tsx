import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import Delete from '@mui/icons-material/DeleteOutline';
import { Tag, parseTagList, generateMockTag } from 'types/tag';
import UseAPI from 'hooks/hooks';
import { TableOfValue, parseTableOfValues, getMockTableOfValues } from 'types/tableOfValue';

interface RuleRowProps {
    mockInstitutes: string[];
    tableOfValue: TableOfValue | null;
    setTableOfValue: (value: TableOfValue | null) => void;
    value: string;
    setValue: (value: string) => void;
    tag: Tag | null;
    setTag: (value: Tag | null) => void;
    type: string;
    setType: (value: string) => void;
}

const RuleRow: React.FC<RuleRowProps> = ({ tableOfValue, setTableOfValue, value, setValue, tag, setTag, type, setType }) => {
    const typeCharge = ['FIXO', 'PERCENTUAL'];

    const [tags, setTags] = React.useState<Tag[]>([]);
    const [tableOfValues, setTableOfValues] = React.useState<TableOfValue[]>([]);
    const { get } = UseAPI();

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

    React.useEffect(() => {
        fetchTags();
        fetchTableOfValues();
    }, []);

    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                    <InputLabel id="tableValue-label">Selecione Tabela de Valores</InputLabel>
                    <Select
                        fullWidth
                        id="tableOfValue"
                        value={tableOfValue?.id || ''}
                        onChange={(event) => {
                            const selectedTableOfValue = tableOfValues.find((tov) => tov.id === event.target.value);
                            setTableOfValue(selectedTableOfValue || null);
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
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                        label="Tipo de cobrança"
                        variant="outlined"
                        sx={{ mb: 2 }}
                    >
                        {typeCharge.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    fullWidth
                    id="value"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    label="Valor/Percentual"
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
            </Grid>
            <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                    <InputLabel id="tag-label">Selecione a TAG</InputLabel>
                    <Select
                        fullWidth
                        id="tag"
                        label="TAG"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={tag?.id || ''}
                        onChange={(event) => {
                            const selectedTag = tags.find((t) => t.id === event.target.value);
                            setTag(selectedTag || null);
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
                    <Delete
                        style={{
                            fontSize: '2.5vh',
                            marginBottom: '1vh'
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default RuleRow;
