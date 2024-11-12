import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogContentText, Box, FormControl, Grid, Select, InputLabel, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CustomTextField from 'ui-component/inputs/procedureFormTextField';
import CustomTextFieldSearch from 'ui-component/inputs/customSearchTextField';
import Search from '@mui/icons-material/Search';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Add from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
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
            fullWidth
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
                <DialogContent>
                    <DialogContentText sx={{ fontSize: '12px' }}>
                        <strong>Cadastro de Tabela de Valores: </strong>
                        Preencha todas as informações necessárias para tabela, como descrição, instituição, e os valores correspondentes aos
                        procedimentos. Certifique-se de que os valores estão corretos e adequados antes de salvar. Confirme se deseja
                        cadastrar esta tabela de valores.
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
                    <Box height={25} />
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <CustomTextFieldSearch label="Search" prefixIcon={<Search sx={{ color: 'action.active', mr: 1 }} />} />

                        <Box
                            display={'flex'}
                            alignItems={'flex-start'}
                            sx={{
                                marginTop: '20px'
                            }}
                        >
                            <CloudUpload sx={{ color: 'action.active', mr: 2, marginTop: '1px', fontSize: 24 }} />
                            <Fab
                                color="primary"
                                sx={{
                                    width: 24,
                                    height: 24,
                                    minHeight: 24,
                                    fontSize: 20,
                                    boxShadow: 'none'
                                }}
                                aria-label="add"
                            >
                                <Add sx={{ fontSize: 20 }} />
                            </Fab>
                        </Box>
                    </Box>
                    <DataGrid disableRowSelectionOnClick rows={mockRows} columns={columns} />
                </DialogContent>
            </form>
        </Dialog>
    );
};
const columns = [
    { field: 'Vigência Inicial', headerName: 'initDate', width: 200 },
    { field: 'Vigência Final', headerName: 'endDate', width: 200 },
    {
        field: 'Cód. Procedimento',
        headerName: 'procedureCode',
        width: 200
    },
    { field: 'Descrição Procedimento', headerName: 'procedureDescription', width: 300 },
    { field: 'Valor Procedimento', headerName: 'value', width: 200 },
    {
        field: 'Ações',
        headerName: 'actions',
        width: 200,
        renderCell: () => (
            <>
                <Edit color="primary" />
                <Delete color="error" />
            </>
        )
    }
];

const mockRows = [
    {
        id: 1,
        initDate: '01/01/2021',
        endDate: '31/12/2021',
        procedureCode: '123456',
        procedureDescription: 'Procedimento 1',
        value: 'R$ 100,00'
    },
    {
        id: 2,
        initDate: '01/01/2021',
        endDate: '31/12/2021',
        procedureCode: '654321',
        procedureDescription: 'Procedimento 2',
        value: 'R$ 200,00'
    },
    {
        id: 3,
        initDate: '01/01/2021',
        endDate: '31/12/2021',
        procedureCode: '654321',
        procedureDescription: 'Procedimento 3',
        value: 'R$ 300,00'
    },
    {
        id: 4,
        initDate: '01/01/2021',
        endDate: '31/12/2021',
        procedureCode: '654321',
        procedureDescription: 'Procedimento 4',
        value: 'R$ 400,00'
    }
];
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
