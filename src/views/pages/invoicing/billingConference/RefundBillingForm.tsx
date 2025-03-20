import {
    Dialog,
    Box,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    DialogActions,
    Button,
    SnackbarCloseReason
} from '@mui/material';
import useAPI from 'hooks/useAPI';
import { useState } from 'react';
import { Billing, ReportBilling } from 'types/billing';
import { Unity } from 'types/unity';
import SnackBarAlert from 'ui-component/SnackBarAlert';

type Props = {
    open: boolean;
    onClose: (success: boolean) => void;
    billing: ReportBilling | null;
    unity?: Unity;
};

const RefundBillingForm = ({ open, onClose, billing, unity }: Props) => {
    const [reason, setReason] = useState('');
    const [openSucessSnack, setOpenSucessSnack] = useState(false);
    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');

    const { post } = useAPI();

    const handleClickSnack = ({ message, severity }: { message: string; severity: 'success' | 'error' | 'warning' | 'info' }) => {
        setMessageSnack(message);
        severity === 'success' ? setOpenSucessSnack(true) : setOpenErrorSnack(true);
    };

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpenSucessSnack(false);
        setOpenErrorSnack(false);
    };

    const handleSave = async () => {
        const response = await post(`/api/billing-confirmations/${billing?.id}/refund`, {
            reason
        });
        if (response.ok) {
            onClose(true);
        } else {
            handleClickSnack({ message: response.message ?? 'Error ao confirmar faturamento', severity: 'error' });
        }
    };

    return (
        <Dialog fullWidth maxWidth={'lg'} open={open} onClose={() => onClose(false)}>
            {billing == null ? (
                <div></div>
            ) : (
                <div>
                    <Box margin={'10px'}>
                        <DialogTitle>
                            <span style={{ fontSize: '2vh', fontWeight: 'bold' }}>Estorno do Faturamento</span>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText style={{ fontSize: '1.3vh' }}>
                                <span style={{ fontWeight: 'bold' }}>Atenção: </span>
                                Você está prestes a estornar este faturamento. Ao realizar esta ação, o valor será revertido, e os dados
                                voltarão para a conferência. Certifique-se de que esta ação é necessária, pois o estorno não poderá ser
                                desfeito. Confirme se deseja prosseguir.
                            </DialogContentText>
                            <Box height={40} />
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="select-label">Unidade</InputLabel>
                                        <Select labelId="select-label" label="Select" value={unity?.cd_unidade} disabled>
                                            <MenuItem value={unity?.cd_unidade}>{unity?.name}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField label="R$ Valor" fullWidth value={billing?.valueReport} disabled />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Motivo do Estorno"
                                        fullWidth
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <SnackBarAlert open={openSucessSnack} message="Sucesso!" severity="success" onClose={handleCloseSnack} />
                            <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={handleCloseSnack} />
                        </DialogContent>
                    </Box>
                    <Box height={60} />
                    <DialogActions>
                        <Button variant="outlined" onClick={() => onClose(false)} color="primary" size="large">
                            Fechar
                        </Button>
                        <Box width={5} />
                        <Button
                            size="large"
                            variant="contained"
                            onClick={handleSave}
                            sx={{ color: 'white', backgroundColor: 'rgba(103, 58, 183, 1)' }}
                        >
                            Salvar
                        </Button>
                    </DialogActions>
                </div>
            )}
        </Dialog>
    );
};

export default RefundBillingForm;
