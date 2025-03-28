import React, { useEffect, useState } from 'react';
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
import useAPI from 'hooks/useAPI';
import { Institute, parseInstitute } from 'types/institute';
import { getMockModalities, Modality, parseModality } from 'types/modality';

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
    institute: z.string().nonempty('Pelo menos uma instituição é obrigatória'),
    modality: z.array(z.string()).nonempty('Pelo menos uma modalidade é obrigatória')
});

type ProcedureFormProps = {
    open: boolean;
    handleClose: (success: boolean) => void;
    procedureEdit?: Procedure | null;
};

const ProcedureForm: React.FC<ProcedureFormProps> = ({ open, handleClose, procedureEdit }) => {
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [institute, setInstitute] = useState<string>('');
    const [modality, setModality] = useState<string[]>([]);

    const [openSucessSnack, setOpenSucessSnack] = useState(false);
    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');
    const [error, setError] = useState<string | null>(null);
    const modalities = ['CT', 'MR', 'US', 'CR', 'DO', 'OT', 'DX', 'MG', 'SC'];
    const [errors, setErrors] = useState({
        description: '',
        code: '',
        institute: '',
        modality: ''
    });

    const { get, post, put } = useAPI();

    const getInstitutes = async () => {
        const response = await get('/api/institutionsAccess');
        if (response.ok) {
            setInstitutes(response.result.map((institute: any) => parseInstitute(institute)));
        } else {
            setError(response.message);
        }
    };

    const handleClickSnack = ({ message, severity }: { message: string; severity: 'success' | 'error' | 'warning' | 'info' }) => {
        setMessageSnack(message);
        severity === 'success' ? setOpenSucessSnack(true) : setOpenErrorSnack(true);
    };

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpenSucessSnack(false);
        setOpenErrorSnack(false);
    };

    const handleCreateProcedure = async () => {
        // const idsInstitute = institutes
        //     .filter((instituteCheck) => institute.includes(instituteCheck.name))
        //     .map((institute) => institute.id_institution);
        // console.log(institute);
        const response = await post('/api/billingProcedure', {
            name: description,
            code: code,
            institution: institute,
            modality: modality.join(',')
        });
        if (response.ok) {
            handleClose(true);
            handleClickSnack({ message: 'Procedimento cadastrado com sucesso!', severity: 'success' });
        } else {
            handleClickSnack({ message: response.message, severity: 'error' });
        }
    };

    const handleEditProcedure = async () => {
        const response = await put(`/api/billingProcedure/${procedureEdit!.id}`, {
            name: description,
            code: code,
            institution: institute,
            modality: modality.join(','),
            status: procedureEdit!.status
        });
        if (response.ok) {
            handleClose(true);
            handleClickSnack({ message: 'Procedimento editado com sucesso!', severity: 'success' });
        } else {
            handleClickSnack({ message: response.message, severity: 'error' });
        }
    };

    const handleReceiveProcedure = () => {
        if (procedureEdit) {
            setDescription(procedureEdit.name);
            setCode(procedureEdit.code);
            var newInstitute = getInstituteByName(procedureEdit.institution_name);
            setInstitute(newInstitute != null ? newInstitute.id_institution : '');
            setModality(procedureEdit.modalities || []);
        } else {
            setDescription('');
            setCode('');
            setInstitute('');
            setModality([]);
        }
    };

    const getInstituteByName = (name: string) => {
        var newArray = institutes.filter((element) => element.name == name);
        if (newArray.length > 0) {
            return newArray[0];
        }
        return null;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // const modalityToApi = modality.join(',');
        // const instituteToApi = institute.join(',');
        const formData = { description, code, institute, modality };
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
            procedureEdit ? handleEditProcedure() : handleCreateProcedure();
        }
    };

    useEffect(() => {
        getInstitutes();
    }, []);

    useEffect(() => {
        if (open) {
            handleReceiveProcedure();
        }
    }, [procedureEdit, open]);

    return (
        <Dialog open={open} onClose={() => handleClose(false)} maxWidth="md" fullWidth>
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
                            <FormControl fullWidth size="small" error={Boolean(errors.institute)} sx={formControlStyles}>
                                <InputLabel id="institute-label">Instituição</InputLabel>
                                <Select
                                    labelId="institute-label"
                                    id="institute-select"
                                    value={institute}
                                    label="Instituição"
                                    onChange={(e) => setInstitute(e.target.value as string)}
                                    fullWidth
                                    IconComponent={ArrowDropDownIcon}
                                    sx={selectStyles}
                                >
                                    {institutes.map((institute) => (
                                        <MenuItem key={institute.id_institution} value={institute.id_institution}>
                                            {institute.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {/* {errors.institute && <Box color="error.main">{errors.institute}</Box>} */}
                            </FormControl>
                        </Grid>
                        <Box width={10} />
                        <Grid item xs={12} sm={5.8}>
                            <FormControl fullWidth size="small" error={Boolean(errors.modality)} sx={formControlStyles}>
                                <InputLabel id="modality-label">Modalidade</InputLabel>
                                <Select
                                    labelId="modality-label"
                                    id="modality-select"
                                    label="Modalidade"
                                    multiple
                                    value={Array.isArray(modality) ? modality : []}
                                    onChange={(e) => setModality(e.target.value as string[])}
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
                    <Button variant="outlined" onClick={() => handleClose(false)} color="primary" size="medium">
                        Fechar
                    </Button>
                    <Box width={5} />
                    <Button
                        size="medium"
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
