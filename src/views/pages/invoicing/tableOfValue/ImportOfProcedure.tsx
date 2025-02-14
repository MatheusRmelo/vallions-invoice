import React, { useState } from 'react';
import { Dialog, Divider, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Box, SnackbarCloseReason } from '@mui/material';
import useAPI from 'hooks/useAPI';
import SnackBarAlert from 'ui-component/SnackBarAlert';
import { parseProcedureCost, ProcedureCost } from 'types/procedures_costs';

interface ImportOfProcedureProps {
    open: boolean;
    billingProcedureId: number,
    institutionId: string,
    handleClose: (result: ProcedureCost[] | null, startDate: string | null, endDate: string | null) => void;
}

const ImportOfProcedure: React.FC<ImportOfProcedureProps> = ({ open, billingProcedureId, institutionId, handleClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [openSucessSnack, setOpenSucessSnack] = useState(false);
    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');

    const { get } = useAPI();

    const handleImport = async () => {
        const response = await get(`/api/procedures-by-date?institution=1&initial_effective_date=${startDate}&final_effective_date=${endDate}`);
        if (response.ok) {
            handleClose(response.result.map(parseProcedureCost), startDate, endDate);
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
                onClose={() => handleClose(null, null, null)}
                maxWidth={false}
                fullWidth
                PaperProps={{
                    sx: {
                        width: { xs: '95%', sm: '80%', md: '40%' },
                        height: 'auto',
                        padding: { xs: '10px', sm: '20px' },
                        margin: 0,
                        maxHeight: '100vh',
                        borderRadius: { xs: '10px', sm: '20px' },
                        fontWeight: 'bold'
                    }
                }}
            >
                <DialogTitle sx={{
                    fontSize: { xs: '18px', sm: '20px' },
                    padding: { xs: '10px', sm: '16px' }
                }}>
                    Importação de Procedimentos
                </DialogTitle>
                <Divider />

                <DialogContent>
                    <DialogContentText sx={{
                        fontSize: { xs: '14px', sm: '2vh' },
                        padding: { xs: '10px 0', sm: '16px 0' }
                    }}>
                        Você gostaria de importar os procedimentos cadastrados para a tabela de valores? Caso sim, informe abaixo a data de
                        vigência inicial e final para os procedimentos que serão importados.
                    </DialogContentText>
                    <Box height={{ xs: '1vh', sm: '2vh' }} />
                    <Box
                        display="flex"
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        sx={{ px: { xs: 0, sm: '18%' } }}
                    >
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
                            sx={{ mb: { xs: 2, sm: 0 } }}
                        />
                        <Box width={{ xs: 0, sm: '3vw' }} height={{ xs: '1vh', sm: 0 }} />
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
                    </Box>
                    <SnackBarAlert
                        open={openSucessSnack}
                        message="Sucesso!"
                        severity="success"
                        onClose={handleCloseSnack}
                    />
                    <SnackBarAlert
                        open={openErrorSnack}
                        message={messageSnack}
                        severity="error"
                        onClose={handleCloseSnack}
                    />
                </DialogContent>
                <DialogActions sx={{
                    padding: { xs: '8px', sm: '16px' },
                    justifyContent: 'center'
                }}>
                    <Button
                        variant="outlined"
                        sx={{
                            width: { xs: '80px', sm: '10vh' },
                            height: { xs: '36px', sm: '4vh' },
                            fontWeight: 'bold',
                            fontSize: { xs: '14px', sm: '1.5vh' }
                        }}
                        onClick={() => handleClose(null, null, null)}
                        color="primary"
                    >
                        Fechar
                    </Button>
                    <Box width={5} />
                    <Button
                        variant="contained"
                        onClick={handleImport}
                        sx={{
                            width: { xs: '80px', sm: '10vh' },
                            height: { xs: '36px', sm: '4vh' },
                            fontSize: { xs: '14px', sm: '1.5vh' },
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
