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
    onClose: (procedureCost: ProcedureCost | null) => void,
}

const ProcedureCostForm: React.FC<Props> = ({ open, onClose, procedureCost, institutes }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [procedure, setProcedure] = useState<Procedure | null>(null);
    const [value, setValue] = useState('');
    const [institute, setInstitute] = useState<Institute | null>(null);
    const [procedures, setProcedures] = useState<Procedure[]>([]);

    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');

    const { get, post, put } = useAPI();

    useEffect(() => {
        getProcedures();
    }, []);


    const getProcedures = async () => {
        const response = await get('/api/billingProcedure?institution=2');
        if (response.ok) {
            setProcedures(response.result.map((item: any) => parseProcedure(item)));
        } else {
            setOpenErrorSnack(true);
            setMessageSnack(response.message);
        }
    };

    const getInstituteById = (id: string): Institute | null => {
        let rows = institutes;
        let filtered = rows.filter((element) => element.id === id);
        if (filtered.length === 0) return null;
        return filtered[0];
    }

    const getProcedureById = (id: string): Procedure | null => {
        let rows = procedures;
        let filtered = rows.filter((element) => element.id.toString() == id);
        if (filtered.length === 0) return null;
        return filtered[0];
    }

    const handleCreateProcedureCost = async () => {
        const response = await post('/api/costs-has-procedures', {
            price: parseFloat(value),
            billing_procedures_fk: procedure?.id,
            medical_procedure_cost_fk: institute?.id,
            date_start: startDate,
            date_end: endDate
        });
        if (response.ok) {
            onClose(response.result);
        } else {
            setOpenErrorSnack(true);
            setMessageSnack(response.message);
        }

        //TODO - REMOVE AFTER CONNECT API
        if (true) {
            onClose({
                codProcedure: procedure!.id.toString(),
                descriptionProcedure: procedure!.name,
                id: 1,
                validatyStart: startDate,
                validatyEnd: endDate,
                valueProcedure: parseFloat(value),
            })
        }
    };

    const handleEditProcedureCost = async () => {
        const response = await put(`/api/costs-has-procedures/${procedureCost!.id}`, {
            price: value,
            billing_procedures_fk: procedure?.id,
            medical_procedure_cost_fk: institute?.id,
            date_start: startDate,
            date_end: endDate
        });
        if (response.ok) {
            onClose(null);
        } else {
            setOpenErrorSnack(true);
            setMessageSnack(response.message);
        }
    }

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
                                value={institute?.id}
                                label="Instituição"
                                onChange={(e) => setInstitute(getInstituteById(e.target.value as string))}
                                fullWidth
                                IconComponent={ArrowDropDownIcon}
                            >
                                {institutes.map((institute) => (
                                    <MenuItem key={institute.id} value={institute.id}>
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
                                value={procedure?.id}
                                label="Procedimento"
                                onChange={(e) => setProcedure(getProcedureById(e.target.value as string))}
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
                    onClick={procedureCost ? handleEditProcedureCost : handleCreateProcedureCost}
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
