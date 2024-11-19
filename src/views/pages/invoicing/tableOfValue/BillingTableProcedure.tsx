import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    DialogContentText,
    Divider,
    Box,
    Select,
    FormControl,
    InputLabel,
    MenuItem
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
const BillingTableProcedureDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [institution, setInstitution] = useState<string[]>([]);
    const [procedure, setProcedure] = useState('');
    const [value, setValue] = useState('');
    const mockInstitutes = ['Teste1', 'Teste2', 'Teste3'];

    const handleSave = () => {
        // Handle save logic here
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            fullWidth
            PaperProps={{
                sx: {
                    width: '38%',
                    height: '40%',
                    padding: '20px',
                    margin: 0,
                    maxHeight: '100vh',
                    borderRadius: '20px'
                }
            }}
        >
            <DialogTitle>Procedimentos Tabela de Faturamento</DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText>
                    <strong>Cadastro de Procedimento:</strong> Insira todas as informações necessárias para o procedimento, incluindo
                    instituição e modalidade. Verifique se os dados estão corretos antes de salvar. Confirme se deseja cadastrar este
                    procedimento.
                </DialogContentText>
                <Box mt={'6vh'} />
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <TextField
                            label="Data Inicio"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Data Fim"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="institute-label">Instituição</InputLabel>
                            <Select
                                labelId="institute-label"
                                id="institute-select"
                                multiple
                                value={institution}
                                label="Instituição"
                                onChange={(e) => setInstitution(e.target.value as string[])}
                                fullWidth
                                IconComponent={ArrowDropDownIcon}
                            >
                                {mockInstitutes.map((mockInstitute) => (
                                    <MenuItem key={mockInstitute} value={mockInstitute}>
                                        {mockInstitute}
                                    </MenuItem>
                                ))}
                            </Select>
                            {/* {errors.institute && <Box color="error.main">{errors.institute}</Box>} */}
                        </FormControl>
                    </Grid>
                    <Box mt={'8vh'} />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField label="Procedimento" fullWidth value={procedure} onChange={(e) => setProcedure(e.target.value)} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Valor" fullWidth value={value} onChange={(e) => setValue(e.target.value)} />
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleSave} color="primary">
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BillingTableProcedureDialog;
