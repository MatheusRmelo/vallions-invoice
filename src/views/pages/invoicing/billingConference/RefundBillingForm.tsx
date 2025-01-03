import { Dialog, Box, DialogTitle, DialogContent, DialogContentText, Grid, FormControl, InputLabel, Select, MenuItem, TextField, DialogActions, Button } from "@mui/material";
import useAPI from "hooks/useAPI";
import { useState } from "react";
import { ReportBilling } from "types/billing";

type Props = {
    open: boolean,
    onClose: (success: boolean) => void,
    billing: ReportBilling | null,
}


const RefundBillingForm = ({ open, onClose, billing }: Props) => {
    const [reason, setReason] = useState("");

    const { post } = useAPI();

    const handleSave = async () => {
        const response = await post(`/api/billing-confirmations/${billing?.id}/refund`, {
            reason
        });
        if (response.ok) {
            onClose(true);
        } else {
            console.log(response);
        }
    }

    return (
        <Dialog fullWidth maxWidth={'lg'} open={open} onClose={() => onClose(false)}>
            {billing == null ? <div></div> :
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
                                    <FormControl fullWidth>
                                        <InputLabel id="select-label">Unidade</InputLabel>
                                        <Select labelId="select-label" label="Select" value={billing?.unity} disabled>
                                            <MenuItem value={billing?.unity}>{billing?.unity}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField label="R$ Valor" fullWidth value={billing?.valueReport} disabled />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Motivo do Estorno" fullWidth value={reason} onChange={(e) => setReason(e.target.value)} />
                                </Grid>
                            </Grid>
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
            }
        </Dialog>
    );
}

export default RefundBillingForm;