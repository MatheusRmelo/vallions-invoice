import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";

type Props = {
    open: boolean,
    onClose: () => void,
}

const ConfirmBillingForm = ({ open, onClose }: Props) => {

    return (
        <Dialog fullWidth maxWidth={'lg'} open={open} onClose={onClose}>
            <form>
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
                                    <Select labelId="select-label" label="Select">
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField label="R$ Valor" fullWidth />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField label="Previsão" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={10}>
                                <TextField label="Observação" fullWidth />
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Box>
                <Box height={60} />
                <DialogActions>
                    <Button variant="outlined" onClick={onClose} color="primary" size="large">
                        Fechar
                    </Button>
                    <Box width={5} />
                    <Button
                        size="large"
                        variant="contained"
                        type="submit"
                        sx={{ color: 'white', backgroundColor: 'rgba(103, 58, 183, 1)' }}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ConfirmBillingForm;