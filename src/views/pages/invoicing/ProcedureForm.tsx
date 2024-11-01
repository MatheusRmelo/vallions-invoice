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
import { z } from 'zod';

// Mock data
const mockInstitutes = ['Teste1', 'Teste2', 'Teste3'];
const mockModalities = ['Teste1', 'Teste2', 'Teste3'];

// Validation schema using zod
const procedureSchema = z.object({
    description: z.string().min(1, 'Descrição é obrigatória'),
    code: z.string().min(1, 'Código CBHPM é obrigatório'),
    institute: z.array(z.string()).nonempty('Pelo menos uma instituição é obrigatória'),
    modality: z.array(z.string()).nonempty('Pelo menos uma modalidade é obrigatória')
});

type ProcedureFormProps = {
    open: boolean;
    handleClose: () => void;
};

const ProcedureForm: React.FC<ProcedureFormProps> = ({ open, handleClose }) => {
    const [description, setDescription] = React.useState('');
    const [code, setCode] = React.useState('');
    const [institute, setInstitute] = React.useState<string[]>([]);
    const [modality, setModality] = React.useState<string[]>([]);
    const [errors, setErrors] = React.useState({
        description: '',
        code: '',
        institute: '',
        modality: ''
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = {
            description,
            code,
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
                    <Box height={50} />
                    <Box display="flex" justifyContent="space-between" gap={2}>
                        <Box width="180%">
                            <TextField
                                autoFocus
                                required
                                label="Descrição do Procedimento"
                                name="description"
                                variant="outlined"
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                error={Boolean(errors.description)}
                                helperText={errors.description}
                            />
                        </Box>
                        <TextField
                            required
                            label="Código CBHPM"
                            name="code"
                            variant="outlined"
                            fullWidth
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            error={Boolean(errors.code)}
                            helperText={errors.code}
                        />
                    </Box>
                    <Box height={10} />
                    <Box display="flex" justifyContent="space-between">
                        <Box width="60vh">
                            <FormControl fullWidth error={Boolean(errors.institute)}>
                                <InputLabel id="institute-label" style={{ color: 'black' }}>
                                    Instituto
                                </InputLabel>
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
                        </Box>
                        <Box width="52vh">
                            <FormControl fullWidth error={Boolean(errors.modality)}>
                                <InputLabel id="modality-label" style={{ color: 'black' }}>
                                    Modalidade
                                </InputLabel>
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
                        </Box>
                    </Box>
                    <Box height={50} />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose} color="primary">
                        Fechar
                    </Button>
                    <Box width={10} />
                    <Button variant="contained" type="submit" color="primary">
                        Salvar
                    </Button>
                    <Box width={10} />
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProcedureForm;
