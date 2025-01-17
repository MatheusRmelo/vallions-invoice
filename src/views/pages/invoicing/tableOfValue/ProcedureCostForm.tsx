import React, { useEffect, useState } from 'react';
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
import { ProcedureCost } from 'types/procedures_costs';
import { Institute } from 'types/institute';
import useAPI from 'hooks/useAPI';
import { parseProcedure, Procedure } from 'types/procedure';
import SnackBarAlert from 'ui-component/SnackBarAlert';


type Props = {
    open: boolean,
    procedureCost: ProcedureCost | null,
    institutes: Institute[],
    tableOfValueId: string | null,
    onClose: (procedureCost: ProcedureCost | null) => void,
}

const ProcedureCostForm: React.FC<Props> = ({ open, onClose, procedureCost, institutes, tableOfValueId }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [procedure, setProcedure] = useState<string>('');
    const [value, setValue] = useState('');
    const [institute, setInstitute] = useState<string>('');
    const [procedures, setProcedures] = useState<Procedure[]>([]);

    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');

    const { get, post, put } = useAPI();

    useEffect(() => {
        getProcedures();
    }, [institute]);

    useEffect(() => {
        getProcedureCost();
    }, [procedureCost, open]);

    const getProcedureCost = () => {
        if (procedureCost) {
            setValue(procedureCost.valueProcedure.toString());
            setStartDate(procedureCost.validatyStart ? new Date(procedureCost.validatyStart!).toISOString().split('T')[0] : '');
            setEndDate(procedureCost.validatyEnd ? new Date(procedureCost.validatyEnd!).toISOString().split('T')[0] : '');
            if (institutes.length > 0) {
                setInstitute(institutes[0].id_institution);
            }
            setProcedure(procedureCost.codProcedure);
        } else {
            setValue('');
            setStartDate('');
            setEndDate('');
            setProcedure('');
        }
    }

    const getProcedures = async () => {
        const response = await get(`/api/billingProcedure?institution=${institute}`);
        if (response.ok) {
            setProcedures(response.result.map((item: any) => parseProcedure(item)));
        } else {
            setOpenErrorSnack(true);
            setMessageSnack(response.message);
        }
    };

    const getInstituteById = (id: string): Institute | null => {
        let rows = institutes;
        let filtered = rows.filter((element) => element.id_institution === id);
        if (filtered.length === 0) return null;
        return filtered[0];
    }

    const getProcedureById = (id: string): Procedure | null => {
        let rows = procedures;
        let filtered = rows.filter((element) => element.id.toString() == id);
        if (filtered.length === 0) return null;
        return filtered[0];
    }

    const handleSaveProcedureCost = async () => {

        if (procedureCost != null) {
            onClose({
                ...procedureCost,
                codProcedure: procedure,
                descriptionProcedure: getProcedureById(procedure)?.name ?? null,
                validatyStart: startDate,
                validatyEnd: endDate,
                valueProcedure: parseFloat(value),
            });
            return;
        } else {
            onClose({
                codProcedure: procedure,
                descriptionProcedure: getProcedureById(procedure)?.name ?? null,
                id: 0,
                validatyStart: startDate,
                validatyEnd: endDate,
                valueProcedure: parseFloat(value),
            });
            return;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => onClose(null)}
            maxWidth={false}
            fullWidth
            PaperProps={{
                sx: {
                    width: '38%',
                    height: 'auto',
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
                                value={institute}
                                label="Instituição"
                                onChange={(e) => setInstitute(e.target.value as string)}
                                fullWidth
                                IconComponent={ArrowDropDownIcon}
                            >
                                {institutes.map((institute) => (
                                    <MenuItem key={institute.id_institution} value={institute.id_institution}>
                                        {institute.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box mt={'2vh'} />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="procedure-label">Procedimento</InputLabel>
                            <Select
                                labelId="procedure-label"
                                id="procedure-select"
                                value={procedure}
                                label="Procedimento"
                                onChange={(e) => setProcedure(e.target.value as string)}
                                fullWidth
                                IconComponent={ArrowDropDownIcon}
                            >
                                {procedures.map((procedure) => (
                                    <MenuItem key={procedure.id} value={procedure.id}>
                                        {procedure.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Valor" fullWidth value={value} onChange={(e) => setValue(e.target.value)} />
                    </Grid>
                </Grid>
                <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={() => setOpenErrorSnack(false)} />

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
                    onClick={() => onClose(null)}
                    color="primary"
                >
                    Fechar
                </Button>
                <Box width={5} />
                <Button
                    variant="contained"
                    type="submit"
                    onClick={handleSaveProcedureCost}
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
    );
};

export default ProcedureCostForm;
