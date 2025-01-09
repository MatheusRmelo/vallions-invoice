import React, { useState } from 'react';
import { Dialog, Divider, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Box, SnackbarCloseReason } from '@mui/material';
import useAPI from 'hooks/useAPI';
import SnackBarAlert from 'ui-component/SnackBarAlert';

interface ImportOfProcedureProps {
    open: boolean;
    billingProcedureId: number,
    institutionId: string,
    handleClose: (success: boolean) => void;
}

const ImportOfProcedure: React.FC<ImportOfProcedureProps> = ({ open, billingProcedureId, institutionId, handleClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [openSucessSnack, setOpenSucessSnack] = useState(false);
    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');

    const { post } = useAPI();

    const handleImport = async () => {
        const response = await post('/api/costs-has-procedures/import', {
            institution: institutionId,
            billing_procedures_fk: billingProcedureId,
            initial_effective_date: startDate,
            final_effective_date: endDate
        });
        if (response.ok) {
            handleClose(true);
        } else {
            handleClickSnack({ message: response.message ?? 'Error importar', severity: 'error' });
        }
    };

    const handleClickSnack = ({ message, severity }: { message: string; severity: 'success' | 'error' | 'warning' | 'info' }) => {
        setMessageSnack(message);
        severity === 'success' ? setOpenSucessSnack(true) : setOpenErrorSnack(true);
    };

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpenSucessSnack(false);
        setOpenErrorSnack(false);
    };


    return (
        <div>
            <Dialog
                open={open}
                onClose={() => handleClose(false)}
                maxWidth={false}
                fullWidth
                PaperProps={{
                    sx: {
                        width: '40%',
                        height: 'auto',
                        padding: '20px',
                        margin: 0,
                        maxHeight: '100vh',
                        borderRadius: '20px',
                        fontWeight: 'bold'
                    }
                }}
            >
                <DialogTitle>Importação de Procedimentos</DialogTitle>
                <Divider />

                <DialogContent>
                    <DialogContentText sx={{ fontSize: '2vh' }}>
                        Você gostaria de importar os procedimentos cadastrados para a tabela de valores? Caso sim, informe abaixo a data de
                        vigência inicial e final para os procedimentos que serão importados.
                    </DialogContentText>
                    <Box height="2vh" />
                    <Box display="flex" justifyContent="space-between">
                        <Box width="18%" />
                        <TextField
                            margin="dense"
                            label="Data Início"
                            type="date"
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <Box width="3vw" />
                        <TextField
                            margin="dense"
                            label="Data Fim"
                            type="date"
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <Box width="18%" />
                    </Box>
                    <SnackBarAlert open={openSucessSnack} message="Sucesso!" severity="success" onClose={handleCloseSnack} />
                    <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={handleCloseSnack} />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        sx={{
                            width: '10vh',
                            height: '4vh',
                            fontWeight: 'bold',
                            fontSize: '1.5vh'
                        }}
                        onClick={() => handleClose(false)}
                        color="primary"
                    >
                        Fechar
                    </Button>
                    <Box width={5} />
                    <Button
                        variant="contained"
                        onClick={handleImport}
                        sx={{
                            width: '10vh',
                            height: '4vh',
                            fontSize: '1.5vh',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: 'rgba(103, 58, 183, 1)'
                        }}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ImportOfProcedure;
