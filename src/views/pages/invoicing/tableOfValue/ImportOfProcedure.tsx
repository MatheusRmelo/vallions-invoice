import React, { useState } from 'react';
import { Dialog, Divider, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Box } from '@mui/material';

interface ImportOfProcedureProps {
    open: boolean;
    handleClose: () => void;
}

const ImportOfProcedure: React.FC<ImportOfProcedureProps> = ({ open, handleClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleImport = () => {
        // Handle import logic here
        console.log('Importing procedures from', startDate, 'to', endDate);
        handleClose();
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
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
                        onClick={handleClose}
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
