import React from 'react';
import { Dialog, DialogTitle, DialogContentText, Box, FormControl, Grid, Select, InputLabel, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CustomTextField from 'ui-component/inputs/procedureFormTextField';
type TableOfValueFormProps = {
    open: boolean;
    handleClose: () => void;
};

type TableOfValueFormErrors = {
    description: string | null;
    institute: string | null;
};

const TableOfValueForm: React.FC<TableOfValueFormProps> = ({ open, handleClose }) => {
    const [description, setDescription] = React.useState('');
    const [errors, setErrors] = React.useState<TableOfValueFormErrors>({
        description: null,
        institute: null
    });
    const [institute, setInstitute] = React.useState<string[]>([]);

    const validate = () => {
        const newErrors = { ...errors };
        if (!description) {
            newErrors.description = 'Campo obrigatório';
        } else {
            newErrors.description = null;
        }

        if (institute.length === 0) {
            newErrors.institute = 'Campo obrigatório';
        } else {
            newErrors.institute = null;
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== null);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            PaperProps={{
                sx: {
                    width: '70%',
                    height: 'auto',
                    padding: '20px'
                }
            }}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (validate()) {
                        console.log('Formulário válido');
                    } else {
                        console.log('Formulário inválido');
                    }
                }}
            >
                <DialogTitle sx={{ fontSize: '20px' }}>Tabela de Valores</DialogTitle>
                <DialogContentText sx={{ fontSize: '12px' }}>
                    <strong>Cadastro de Tabela de Valores: </strong>
                    Preencha todas as informações necessárias para tabela, como descrição, instituição, e os valores correspondentes aos
                    procedimentos. Certifique-se de que os valores estão corretos e adequados antes de salvar. Confirme se deseja cadastrar
                    esta tabela de valores.
                </DialogContentText>
                <Box height={65} />
                <Grid container spacing={2}>
                    <Grid item xs={10} sm={5}>
                        <CustomTextField
                            label="Descrição da Tabela de Valores"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            error={Boolean(errors.description)}
                            helperText="Campo obrigatório"
                        />
                    </Grid>
                    <Box width={50} />
                    <Grid item xs={12} sm={5}>
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
                                {mockInstitutes.map((mockInstitute) => (
                                    <MenuItem key={mockInstitute} value={mockInstitute}>
                                        {mockInstitute}
                                    </MenuItem>
                                ))}
                            </Select>
                            {/* {errors.institute && <Box color="error.main">{errors.institute}</Box>} */}
                        </FormControl>
                    </Grid>
                    <Grid item xs={14} sm={4.7}></Grid>
                </Grid>
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
const mockInstitutes = ['Teste1', 'Teste2', 'Teste3'];

export default TableOfValueForm;
