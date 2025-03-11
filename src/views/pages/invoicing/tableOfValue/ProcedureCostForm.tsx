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
import { z } from 'zod';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ProcedureCost } from 'types/procedures_costs';
import { Institute } from 'types/institute';
import useAPI from 'hooks/useAPI';
import { parseProcedure, Procedure } from 'types/procedure';
import SnackBarAlert from 'ui-component/SnackBarAlert';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type Props = {
    open: boolean;
    procedureCost: ProcedureCost | null;
    institutes: Institute[];
    tableOfValueId: string | null;
    onClose: (procedureCost: ProcedureCost | null) => void;
};

const procedureCostSchema = z.object({
    id: z.number(),
    codProcedure: z.string(),

    descriptionProcedure: z.string(),
    validatyStart: z.string(),
    validatyEnd: z.string(),
    valueProcedure: z.number()
});

const ProcedureCostForm: React.FC<Props> = ({ open, onClose, procedureCost, institutes, tableOfValueId }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [procedure, setProcedure] = useState<string | null>(null);
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
            setStartDate(procedureCost.validatyStart ? new Date(procedureCost.validatyStart) : null);
            setEndDate(procedureCost.validatyEnd ? new Date(procedureCost.validatyEnd) : null);
            if (institutes.length > 0) {
                setInstitute(institutes[0].id_institution);
            }

            setProcedure(procedureCost.codProcedure);
        } else {
            setValue('');
            setStartDate(null);
            setEndDate(null);
            setProcedure(null);
        }
    };

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
    };

    const getProcedureById = (id: string): Procedure | null => {
        let rows = procedures;
        let filtered = rows.filter((element) => element.id.toString() == id);
        if (filtered.length === 0) return null;
        return filtered[0];
    };

    const handleSaveProcedureCost = async () => {
        if (!startDate || !endDate || !procedure || !value || !institute) {
            setOpenErrorSnack(true);
            setMessageSnack('Preencha todos os campos obrigatórios');
            return;
        }

        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        if (procedureCost != null) {
            onClose({
                ...procedureCost,
                codProcedure: procedure ?? null,
                descriptionProcedure: getProcedureById(procedure ?? null)?.name ?? null,
                validatyStart: formattedStartDate,
                validatyEnd: formattedEndDate,
                valueProcedure: parseFloat(value)
            });
            return;
        } else {
            onClose({
                codProcedure: procedure ?? null,
                descriptionProcedure: getProcedureById(procedure ?? null)?.name ?? null,
                id: 0,
                validatyStart: formattedStartDate,
                validatyEnd: formattedEndDate,
                valueProcedure: parseFloat(value)
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
                    width: { xs: '95%', sm: '80%', md: '38%' },
                    height: 'auto',
                    padding: { xs: '10px', sm: '20px' },
                    margin: 0,
                    maxHeight: '100vh',
                    borderRadius: { xs: '10px', sm: '20px' }
                }
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: { xs: '18px', sm: '20px' },
                    padding: { xs: '10px', sm: '16px' }
                }}
            >
                Procedimentos Tabela de Faturamento
            </DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText
                    sx={{
                        fontSize: { xs: '12px', sm: '14px' },
                        padding: { xs: '5px 0', sm: '10px 0' }
                    }}
                >
                    <strong>Cadastro de Procedimento:</strong> Insira todas as informações necessárias para o procedimento, incluindo
                    instituição e modalidade. Verifique se os dados estão corretos antes de salvar.
                </DialogContentText>
                <Box mt={{ xs: '2vh', sm: '4vh', md: '6vh' }} />
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <DatePicker
                            label="Data Início"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            sx={{
                                width: '100%',
                                minWidth: '100px',
                                mb: { xs: 1, sm: 0 }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <DatePicker
                            label="Data Fim"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            sx={{
                                width: '100%', minWidth: '180px',
                                mb: { xs: 1, sm: 0 }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                                    <MenuItem key={procedure.id.toString()} value={procedure.id.toString()}>
                                        {procedure.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
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
                <Box mt={{ xs: '1vh', sm: '2vh' }} />
                <Grid container spacing={{ xs: 1, sm: 2 }}>

                    <Grid item xs={12} sm={6}>
                        <TextField label="Valor" fullWidth value={value} onChange={(e) => setValue(e.target.value)} />
                    </Grid>
                </Grid>
                <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={() => setOpenErrorSnack(false)} />
            </DialogContent>
            <DialogActions
                sx={{
                    padding: { xs: '8px', sm: '16px' },
                    justifyContent: 'end'
                }}
            >
                <Button
                    variant="outlined"
                    sx={{
                        fontWeight: 'bold',
                    }}
                    size="large"
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
                    size="large"
                    sx={{
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
