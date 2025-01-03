import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import useAPI from "hooks/useAPI";
import { useState } from "react";
import { ReportBilling } from "types/billing";

type Props = {
    open: boolean,
    onClose: (success: boolean) => void,
    billing: ReportBilling | null,
}

const ConfirmBillingForm = ({ open, onClose, billing }: Props) => {
    const [previsionDate, setPrevisionDate] = useState("");
    const [observation, setObservation] = useState("");
    const { post } = useAPI();

    const handleSave = async () => {
        var response = await post(`/api/billing-confirmations/${billing?.id}/confirmation`, {
            observation: observation,
            forecast_date: previsionDate
        });
        if (response.ok) {
            onClose(true);
        } else {
            console.log(response);
        }
    }

    return (
        <Dialog fullWidth maxWidth={'lg'} open={open} onClose={() => onClose(false)}>
            {
                billing == null ? <div></div>
                    :
                    <div>
                        <Box margin={'10px'}>
                            <DialogTitle>
                                <span style={{ fontSize: '2vh', fontWeight: 'bold' }}>Confirmação do Faturamento</span>
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{ fontSize: '1.3vh' }}>
                                    <span style={{ fontWeight: 'bold' }}>Confirmação de Conferência de Laudos: </span>
                                    Verifique se todos os laudos foram revisados e estão corretos antes de prosseguir com o faturamento. Ao
                                    confirmar, você estará garantindo que todas as informações estão precisas e prontas para o envio. Deseja
                                    continuar com o faturamento?
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
                                        <TextField label="R$ Valor" value={billing?.valueReport} fullWidth disabled />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField label="Previsão" value={previsionDate} onChange={(e) => setPrevisionDate(e.target.value)}
                                            type="date" fullWidth InputLabelProps={{ shrink: true }} />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField label="Observação" value={observation} onChange={(e) => setObservation(e.target.value)} fullWidth />
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

export default ConfirmBillingForm;