import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    FormControl,
    Grid,
    Select,
    InputLabel,
    MenuItem
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CustomTextField from 'ui-component/inputs/procedureFormTextField';
import CustomTextFieldSearch from 'ui-component/inputs/customSearchTextField';
import Search from '@mui/icons-material/Search';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Add from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Edit from '@mui/icons-material/EditOutlined';
import Delete from '@mui/icons-material/DeleteOutlined';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import ImportOfProcedure from './ImportOfProcedure';
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
    const [importOpen, setImportOpen] = React.useState(false);

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
            maxWidth={false}
            fullWidth
            PaperProps={{
                sx: {
                    width: 'auto',
                    height: 'auto',
                    padding: '20px',
                    margin: 0,
                    maxHeight: '100vh'
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
                    <Box height="6vh" />
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Box
                            sx={{
                                marginLeft: '30px'
                            }}
                        >
                            <CustomTextFieldSearch label="Search" prefixIcon={<Search sx={{ color: 'action.active', mr: 1 }} />} />
                        </Box>
                        <Box
                            display={'flex'}
                            alignItems={'flex-start'}
                            sx={{
                                marginTop: '20px'
                            }}
                        >
                            <CloudUpload
                                onClick={() => {
                                    setImportOpen(true);
                                }}
                                sx={{ color: 'action.active', mr: 2, marginTop: '1px', fontSize: 24 }}
                            />
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
                    <Box height="6vh" />
                    <DataGrid disableRowSelectionOnClick rows={mockRows} columns={columns} />
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
                        onClick={handleClose}
                        color="primary"
                    >
                        Fechar
                    </Button>
                    <Box width={5} />
                    <Button
                        variant="contained"
                        type="submit"
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
                <ImportOfProcedure open={importOpen} handleClose={() => setImportOpen(false)} />
            </form>
        </Dialog>
    );
};

const columns = [
    {
        field: 'initDate',
        headerName: 'Vigência Inicial',
        renderHeader: () => <span style={{ fontWeight: 'bold' }}>Vigência Inicial</span>,
        flex: 2
    },
    {
        field: 'endDate',
        headerName: 'Vigência Final',
        flex: 2,
        renderHeader: () => <span style={{ fontWeight: 'bold' }}>Vigência Final</span>
    },
    {
        field: 'procedureCode',
        headerName: 'Cód. Procedimento',
        renderHeader: () => <span style={{ fontWeight: 'bold' }}>Cód. Procedimento</span>,
        flex: 2
    },
    {
        field: 'procedureDescription',
        headerName: 'Descrição Procedimento',
        renderHeader: () => <span style={{ fontWeight: 'bold' }}>Descrição Procedimento</span>,
        flex: 3,

        renderCell: (params: GridCellParams) => <span style={{ fontWeight: 'bold' }}>{params.value as string}</span>
    },
    { field: 'value', headerName: 'Valor Procedimento', flex: 4 },
    {
        field: 'Ações',
        headerName: 'Ações',
        flex: 1,
        renderCell: () => (
            <>
                <Edit
                    sx={{
                        color: 'rgba(103, 58, 183, 1)'
                    }}
                />
                <Delete sx={{ color: 'rgba(105, 117, 134, 1)' }} />
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
    },
    {
        id: 5,
        initDate: '01/01/2021',
        endDate: '31/12/2021',
        procedureCode: '654321',
        procedureDescription: 'Procedimento 5',
        value: 'R$ 500,00'
    },
    {
        id: 6,
        initDate: '01/01/2021',
        endDate: '31/12/2021',
        procedureCode: '654321',
        procedureDescription: 'Procedimento 6',
        value: 'R$ 600,00'
    },
    {
        id: 7,
        initDate: '01/01/2021',
        endDate: '31/12/2021',
        procedureCode: '654321',
        procedureDescription: 'Procedimento 7',
        value: 'R$ 700,00'
    },
    {
        id: 8,
        initDate: '01/01/2021',
        endDate: '31/12/2021',
        procedureCode: '654321',
        procedureDescription: 'Procedimento 8',
        value: 'R$ 800,00'
    },
    {
        id: 9,
        initDate: '01/01/2021',
        endDate: '31/12/2021',
        procedureCode: '654321',
        procedureDescription: 'Procedimento 9',
        value: 'R$ 900,00'
    },
    {
        id: 10,
        initDate: '01/01/2021',
        endDate: '31/12/2021',
        procedureCode: '654321',
        procedureDescription: 'Procedimento 10',
        value: 'R$ 1000,00'
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
