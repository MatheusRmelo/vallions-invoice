import { Dialog, Box, DialogTitle, DialogContent, DialogContentText, Grid, FormControl, InputLabel, Select, MenuItem, TextField, DialogActions, Button, SnackbarCloseReason } from "@mui/material";
import useAPI from "hooks/useAPI";
import { useEffect, useState } from "react";
import { Conference } from "types/conference";
import { Unity } from "types/unity";
import SnackBarAlert from "ui-component/SnackBarAlert";

type Props = {
    open: boolean,
    onClose: (success: boolean) => void,
    price: number,
    unity?: Unity,
    conference: Conference | null,
    startAt: string,
    endAt: string,
}

type Month = {
    label: string,
    number: string
}

const dataMonths: Month[] = [
    {
        label: "Janeiro",
        number: "01",
    },
    {
        label: "Fevereiro",
        number: "02",
    },
    {
        label: "Março",
        number: "03",
    },
    {
        label: "Abril",
        number: "04",
    },
    {
        label: "Maio",
        number: "05",
    },
    {
        label: "Junho",
        number: "06",
    },
    {
        label: "Julho",
        number: "07",
    },
    {
        label: "Agosto",
        number: "08",
    },
    {
        label: "Setembro",
        number: "09",
    },
    {
        label: "Outubro",
        number: "10",
    },
    {
        label: "Novembro",
        number: "11",
    },
    {
        label: "Dezembro",
        number: "12",
    }
];

const CompetenceConferenceForm = ({ open, onClose, price, unity, conference, startAt, endAt }: Props) => {
    const [month, setMonth] = useState("");
    const [months, setMonths] = useState<Month[]>([]);
    const [quantity, setQuantity] = useState("");
    const [openSucessSnack, setOpenSucessSnack] = useState(false);
    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');

    const { post } = useAPI();

    useEffect(() => {
        init();
    }, [open]);

    const init = () => {
        var start = new Date(startAt);
        var end = new Date(endAt);
        setMonths(dataMonths.filter((element) => Number(element.number) >= start.getMonth() + 1 && Number(element.number) <= end.getMonth() + 1));
        setMonth("");
    }

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
        if (quantity == "") {
            handleClickSnack({ message: 'Quantidade é obrigatório', severity: 'error' });
            return;
        }
        if (month == "") {
            handleClickSnack({ message: 'Mês é obrigatório', severity: 'error' });
            return;
        }
        var reports = conference?.reports_finished.filter((element) => element.checked);
        if (reports?.length == 0) {
            handleClickSnack({ message: 'Nenhum relatório foi selecionado', severity: 'error' });
            return;
        }
        var monthClosing = months.filter((element) => element.number == month);
        const response = await post(`/api/billings`, {
            value_total: parseInt(quantity) * price,
            month_closing: `${(new Date()).getFullYear()}-${monthClosing[0].number}-01`,
            quantity: parseInt(quantity),
            status: 0,
            branch_fk: unity?.cd_unidade,
        });
        if (response.ok) {
            console.log(response.result);
            for (let i = 0; i < (reports ?? []).length; i++) {
                await post(`/api/billing-confirmations`, {
                    status: 0,
                    report_fk: reports![i].id,
                    branch_fk: unity?.cd_unidade,
                    billing_fk: response.result.id
                });
            }
            onClose(true);
        } else {
            handleClickSnack({ message: response.message ?? 'Error ao criar faturamento', severity: 'error' });
        }
    }

    return (
        <Dialog fullWidth maxWidth={'md'} open={open} onClose={() => onClose(false)}>
            <Box margin={'10px'}>
                <DialogTitle>
                    <span style={{ fontSize: '2vh', fontWeight: 'bold' }}>Competência de Faturamento</span>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ fontSize: '1.3vh' }}>

                    </DialogContentText>
                    <Box height={40} />
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="select-label">Competência</InputLabel>
                                <Select labelId="select-label" label="Select" value={month} onChange={(e) => setMonth(e.target.value)}>
                                    {
                                        months.map((element) => <MenuItem value={element.number}>{element.label}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="select-label">Unidade</InputLabel>
                                <Select labelId="select-label" label="Select" value={unity?.cd_unidade} disabled>
                                    <MenuItem value={unity?.cd_unidade}>{unity?.name}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label="Quantidade" fullWidth value={quantity} onChange={(e) => setQuantity(e.target.value)} />
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
        </Dialog>
    );
}

export default CompetenceConferenceForm;