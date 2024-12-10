import React from 'react';
import {
    Button,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Dialog,
    Grid
} from '@mui/material';
import { z } from 'zod';
import { SnackbarCloseReason } from '@mui/material/Snackbar';
import ProcedureFormTextField from 'ui-component/inputs/procedureFormTextField';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SnackBarAlert from './../../../../ui-component/SnackBarAlert';
import { Procedure } from 'types/procedure';
import useAPI from 'hooks/hooks';
import { Institute, parseInstitute } from 'types/institute';

const procedureSchema = z.object({
    description: z.string().min(1, 'Descrição do Procedimento é obrigatória'),
    code: z
        .union([z.string(), z.number()])
        .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
            message: 'O código do procedimento deve ser único e seguir o formato somente numeral!'
        })
        .refine((value) => !(typeof value === 'string' && value.trim() === ''), {
            message: 'Código CBHPM é obrigatório'
        }),
    institute: z.array(z.string()).nonempty('Pelo menos uma instituição é obrigatória'),
    modality: z.array(z.string()).nonempty('Pelo menos uma modalidade é obrigatória')
});

type ProcedureFormProps = {
    open: boolean;
    handleClose: () => void;
    procedureEdit?: Procedure | null;
};

const ProcedureForm: React.FC<ProcedureFormProps> = ({ open, handleClose, procedureEdit }) => {
    const [description, setDescription] = React.useState('');
    const [code, setCode] = React.useState('');
    const [procedure, setProcedure] = React.useState<Procedure | null>(null);
    const [institute, setInstitute] = React.useState<string[]>([]);
    const [modalities, setModalities] = React.useState<string[]>([]);
    const [openSucessSnack, setOpenSucessSnack] = React.useState(false);
    const [openErrorSnack, setOpenErrorSnack] = React.useState(false);
    const [messageSnack, setMessageSnack] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const { get, post } = useAPI();

    const [errors, setErrors] = React.useState({
        description: '',
        code: '',
        institute: '',
        modality: ''
    });

    const fetchInstitutes = async () => {
        const response = await get('/api/institutionsAccess');
        if (response.ok) {
            const institutes = response.result.map((institute: any) => parseInstitute(institute));
            setInstitute(institutes);
        } else {
            setError(response.message);
        }
    };

    const fetchModalities = async () => {
        const response = await get('/api/modalities');
        if (response.ok) {
            const modalities = response.result.map((modality: any) => modality.name);
            setModalities(modalities);
        } else {
            setError(response.message);
        }
    };

    React.useEffect(() => {
        fetchInstitutes();
        fetchModalities();
    }, []);

    const handleClickSnack = ({ message, severity }: { message: string; severity: 'success' | 'error' | 'warning' | 'info' }) => {
        setMessageSnack(message);
        severity === 'success' ? setOpenSucessSnack(true) : setOpenErrorSnack(true);
    };

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpenSucessSnack(false);
        setOpenErrorSnack(false);
    };

    const handleProcedure = async () => {
        const response = await post('/api/billingProcedure', {
            name: description,
            code: code,
            institution: institute,
            modality: modalities.join(',')
        });
        /// TODO: Tratar a resposta da API
        if (response.ok) {
            handleClickSnack({ message: 'Procedimento cadastrado com sucesso!', severity: 'success' });
        } else {
            handleClickSnack({ message: response.message, severity: 'error' });
        }
    };

    const putInfo = () => {
        if (procedureEdit) {
            setDescription(procedureEdit.description);
            setCode(procedureEdit.codeCbhpm);
            setInstitute(procedureEdit.institute);
            setModalities([procedureEdit.modality]);
        }
    };

    React.useEffect(() => {
        putInfo();
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = { description, code, institute, modalities };
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
            handleProcedure();
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ fontSize: '20px' }}>
                    Procedimentos
                    <Box width={'100%'} borderBottom={'1px solid #E3F2FD'} marginTop={'16px'} />
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: '12px' }}>
                        <strong>Cadastro de Procedimento: </strong>
                        Insira todas as informações necessárias para o procedimento, incluindo descrição, código, instituição e modalidade.
                        Verifique se os dados estão corretos antes de salvar. Confirme se deseja cadastrar este procedimento.
                    </DialogContentText>
                    <Box height={56} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={7}>
                            <ProcedureFormTextField
                                label="Descrição do Procedimento"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                error={Boolean(errors.description)}
                                helperText={errors.description}
                            />
                        </Grid>
                        <Box width={20} />
                        <Grid item xs={14} sm={4.7}>
                            <ProcedureFormTextField
                                label="Código CBHPM"
                                name="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                error={Boolean(errors.code)}
                                helperText={errors.code}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={Boolean(errors.institute)} sx={formControlStyles}>
                                <InputLabel id="institute-label">Instituição</InputLabel>
                                <Select
                                    labelId="institute-label"
                                    id="institute-select"
                                    multiple
                                    value={institute}
                                    label="Instituição"
                                    onChange={(e) => setInstitute(e.target.value as string[])}
                                    fullWidth
                                    IconComponent={ArrowDropDownIcon}
                                    sx={selectStyles}
                                >
                                    {institute.map((institute) => (
                                        <MenuItem key={institute} value={institute}>
                                            {institute}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {/* {errors.institute && <Box color="error.main">{errors.institute}</Box>} */}
                            </FormControl>
                        </Grid>
                        <Box width={10} />
                        <Grid item xs={12} sm={5.8}>
                            <FormControl fullWidth error={Boolean(errors.modality)} sx={formControlStyles}>
                                <InputLabel id="modality-label">Modalidade</InputLabel>
                                <Select
                                    labelId="modality-label"
                                    id="modality-select"
                                    label="Modalidade"
                                    multiple
                                    value={modalities}
                                    onChange={(e) => setModalities(e.target.value as string[])}
                                    fullWidth
                                    sx={selectStyles}
                                >
                                    {modalities.map((modality) => (
                                        <MenuItem key={modality} value={modality}>
                                            {modality}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {/* {errors.modality && <Box color="error.main">{errors.modality}</Box>} */}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box height={20} />
                    <SnackBarAlert open={openSucessSnack} message="Sucesso!" severity="success" onClose={handleCloseSnack} />
                    <SnackBarAlert open={openErrorSnack} message={messageSnack} severity="error" onClose={handleCloseSnack} />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose} color="primary" size="large">
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
};

const formControlStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderRadius: '12px'
            // backgroundColor: 'white'
        },
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(198, 40, 40, 1)'
        }
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: 'rgba(198, 40, 40, 1)'
        }
    }
};

const selectStyles = {
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(198, 40, 40, 1)'
        }
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: 'rgba(198, 40, 40, 1)'
        }
    },
    '& .MuiSelect-icon': {
        zIndex: 9999
    }
};

export default ProcedureForm;
