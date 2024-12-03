import React from 'react';
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
import RuleRow from './ruleRow';
import AddRuleRow from './AddRuleRow';
interface Props {
    open: boolean;
    onClose: () => void;
}

const mockInstitutes = ['Teste1', 'Teste2', 'Teste3'];

const RulesOfInvoicingForm: React.FC<Props> = ({ open, onClose }) => {
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
                                {mockInstitutes.map((institution) => (
                                    <MenuItem key={institution} value={institution}>
                                        {institution}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="institute-label">Unidade</InputLabel>
                            <Select fullWidth id="unidade" label="Unidade" variant="outlined" sx={{ mb: 2 }}>
                                {mockInstitutes.map((institution) => (
                                    <MenuItem key={institution} value={institution}>
                                        {institution}
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
                    >
                        Adicionar Regra
                    </Button>
                </Box>
                <Box mt={'6vh'} />
                <RuleRow mockInstitutes={mockInstitutes} />
                {/* Mocado remove dps */}
                <RuleRow mockInstitutes={mockInstitutes} />
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
                    >
                        Adicionar Regra
                    </Button>
                </Box>
                <Box mt={'6vh'} />
                <AddRuleRow mockInstitutes={mockInstitutes} />
                {/* Mocado remove dps */}
                <AddRuleRow mockInstitutes={mockInstitutes} />
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
