import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import Delete from '@mui/icons-material/DeleteOutline';

interface RuleRowProps {
    mockInstitutes: string[];
}

const RuleRow: React.FC<RuleRowProps> = ({ mockInstitutes }) => {
    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                    <InputLabel id="tableValue-label">Selecione Tabela de Valores</InputLabel>
                    <Select fullWidth id="tableOfValue" label="Tabela de Valores" variant="outlined" sx={{ mb: 2 }}>
                        {mockInstitutes.map((institution) => (
                            <MenuItem key={institution} value={institution}>
                                {institution}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                    <InputLabel id="-label">Selecione Tipo de Cobrança</InputLabel>
                    <Select fullWidth id="typeCharge" label="Tipo de cobrança" variant="outlined" sx={{ mb: 2 }}>
                        {mockInstitutes.map((institution) => (
                            <MenuItem key={institution} value={institution}>
                                {institution}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField fullWidth id="value" label="Valor/Percentual" variant="outlined" sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                    <InputLabel id="tag-label">Selecione a TAG</InputLabel>
                    <Select fullWidth id="tag" label="TAG" variant="outlined" sx={{ mb: 2 }}>
                        {mockInstitutes.map((institution) => (
                            <MenuItem key={institution} value={institution}>
                                {institution}
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
