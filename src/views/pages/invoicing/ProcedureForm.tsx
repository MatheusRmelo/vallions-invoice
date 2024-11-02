import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import { z } from 'zod';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Mock data
const mockInstitutes = ['Teste1', 'Teste2', 'Teste3'];
const mockModalities = ['Teste1', 'Teste2', 'Teste3'];

// Validation schema using zod
const procedureSchema = z.object({
    description: z.string().min(1, 'Descrição do Procedimento é obrigatória'),
    ///Caso seja Nan, o texto será 'O código do procedimento deve ser único e seguir o formato somente numeral!'
    /// Caso o erro seja vazio, o texto será 'Código CBHPM é obrigatório'
    code: z
        .union([z.string(), z.number()])
        .refine(
            (value) => {
                const numberValue = Number(value);
                return !isNaN(numberValue) && numberValue > 0;
            },
            {
                message: 'O código do procedimento deve ser único e seguir o formato somente numeral!'
            }
        )
        .refine(
            (value) => {
                console.log('value2 ', value);
                if (typeof value === 'string' && value.trim() === '') {
                    return false;
                }
                return true;
            },
            {
                message: 'Código CBHPM é obrigatório'
            }
        ),
    institute: z.array(z.string()).nonempty('Pelo menos uma instituição é obrigatória'),
    modality: z.array(z.string()).nonempty('Pelo menos uma modalidade é obrigatória')
});

type ProcedureFormProps = {
    open: boolean;
    handleClose: () => void;
};

type SnackBarProps = {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    onClose: (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
};

const SnackBarAlert: React.FC<SnackBarProps> = ({ open, message, severity, onClose }) => (
    <Snackbar open={open} autoHideDuration={2000} onClose={onClose}>
        <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
            {message}
        </Alert>
    </Snackbar>
);

const ProcedureForm: React.FC<ProcedureFormProps> = ({ open, handleClose }) => {
    const [description, setDescription] = React.useState('');
    const [code, setCode] = React.useState('');
    const [institute, setInstitute] = React.useState<string[]>([]);
    const [modality, setModality] = React.useState<string[]>([]);
    const [openSucessSnack, setOpenSucessSnack] = React.useState(false);
    const [openErrorSnack, setOpenErrorSnack] = React.useState(false);
    const [messageSnack, setMessageSnack] = React.useState('');
    const [errors, setErrors] = React.useState({
        description: '',
        code: '',
        institute: '',
        modality: ''
    });

    const handleClickSnack = ({ message, severity }: { message: string; severity: 'success' | 'error' | 'warning' | 'info' }) => {
        setMessageSnack(message);
        switch (severity) {
            case 'success':
                setOpenSucessSnack(true);
                break;
            case 'error':
                setOpenErrorSnack(true);
                break;
            default:
                break;
        }
    };

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSucessSnack(false);
        setOpenErrorSnack(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // if (typeof code.trim() === 'string' && isNaN(Number(code))) {
        //     setErrors({
        //         description: '',
        //         code: 'Código CBHPM deve ser um número',
        //         institute: '',
        //         modality: ''
        //     });
        //     handleClickSnack({
        //         message: 'Erro: O código do procedimento deve ser único e seguir o formato somente numeral!',
        //         severity: 'error'
        //     });

        //     return;
        // }

        const formData = {
            description,
            code: code,
            institute,
            modality
        };

        const result = procedureSchema.safeParse(formData);

        if (!result.success) {
            const newErrors = result.error.format();
            setErrors({
                description: newErrors.description?._errors[0] || '',
                code: newErrors.code?._errors[0] || '',
                institute: newErrors.institute?._errors[0] || '',
                modality: newErrors.modality?._errors[0] || ''
            });
            handleClickSnack({
                message:
                    'Erro: ' +
                    (newErrors.description?._errors[0] ||
                        newErrors.code?._errors[0] ||
                        newErrors.institute?._errors[0] ||
                        newErrors.modality?._errors[0]),
                severity: 'error'
            });
        } else {
            console.log(formData);
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Procedimentos</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Cadastro de Procedimento: Insira todas as informações necessárias para o procedimento, incluindo descrição, código,
                        instituição e modalidade. Verifique se os dados estão corretos antes de salvar. Confirme se deseja cadastrar este
                        procedimento.
                    </DialogContentText>
                    <Box height={20} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoFocus
                                label="Descrição do Procedimento"
                                name="description"
                                variant="outlined"
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                error={Boolean(errors.description)}
                                helperText={errors.description}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Código CBHPM"
                                name="code"
                                variant="outlined"
                                fullWidth
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                error={Boolean(errors.code)}
                                helperText={errors.code}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={Boolean(errors.institute)}>
                                <InputLabel id="institute-label">Instituto</InputLabel>
                                <Select
                                    labelId="institute-label"
                                    id="institute-select"
                                    multiple
                                    value={institute}
                                    label="Instituição"
                                    onChange={(e) => {
                                        setInstitute(e.target.value as string[]);
                                    }}
                                    fullWidth
                                >
                                    {mockInstitutes.map((mockInstitute) => (
                                        <MenuItem key={mockInstitute} value={mockInstitute}>
                                            {mockInstitute}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.institute && <Box color="error.main">{errors.institute}</Box>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={Boolean(errors.modality)}>
                                <InputLabel id="modality-label">Modalidade</InputLabel>
                                <Select
                                    labelId="modality-label"
                                    id="modality-select"
                                    multiple
                                    value={modality}
                                    onChange={(e) => {
                                        setModality(e.target.value as string[]);
                                    }}
                                    fullWidth
                                >
                                    {mockModalities.map((mockModality) => (
                                        <MenuItem key={mockModality} value={mockModality}>
                                            {mockModality}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.modality && <Box color="error.main">{errors.modality}</Box>}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box height={20} />
                    <SnackBarAlert open={openSucessSnack} message="Sucesso!" severity="success" onClose={handleCloseSnack} />
                    <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={handleCloseSnack} />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose} color="primary">
                        Fechar
                    </Button>
                    <Button variant="contained" type="submit" color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProcedureForm;
