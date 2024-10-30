// material-ui
// import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import DataGrid, { ColumnProps } from 'ui-component/table/dataGrid';
// ==============================|| Procedure PAGE ||============================== //

type GridData = {
    id: number;
    'Descrição do Procedimento': string;
    'Código CBHPM': string;
    Instituição: string;
    Modalidade: string;
    Editar: string;
    'Inativo/Ativo': string;
};

const columns: ColumnProps<GridData>[] = [
    {
        key: 'id',
        header: 'ID'
    },
    {
        key: 'Descrição do Procedimento',
        header: 'Descrição do Procedimento'
    },
    {
        key: 'Código CBHPM',
        header: 'Código CBHPM'
    },
    {
        key: 'Instituição',
        header: 'Instituição'
    },
    {
        key: 'Modalidade',
        header: 'Modalidade'
    },
    {
        key: 'Editar',
        header: 'Editar'
    },
    {
        key: 'Inativo/Ativo',
        header: 'Inativo/Ativo'
    }
];

const mockRows: GridData[] = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    'Descrição do Procedimento': `Procedimento ${index + 1}`,
    'Código CBHPM': `12345${index + 6}`,
    Instituição: `Instituição ${index + 1}`,
    Modalidade: `Modalidade ${index + 1}`,
    Editar: 'Editar',
    'Inativo/Ativo': 'Ativo'
}));

// // Mocked Row. TODO: Implementar a chamada da API para popular a tabela
// const rows = [
//     {
//         id: 1,
//         'Descrição do Procedimento': 'Procedimento 1',
//         'Código CBHPM': '123456',
//         Instituição: 'Instituição 1',
//         Modalidade: 'Modalidade 1',
//         Editar: 'Editar',
//         'Inativo/Ativo': 'Ativo'
//     },
//     {
//         id: 2,
//         'Descrição do Procedimento': 'Procedimento 2',
//         'Código CBHPM': '123457',
//         Instituição: 'Instituição 2',
//         Modalidade: 'Modalidade 2',
//         Editar: 'Editar',
//         'Inativo/Ativo': 'Ativo'
//     },
//     {
//         id: 3,
//         'Descrição do Procedimento': 'Procedimento 3',
//         'Código CBHPM': '123458',
//         Instituição: 'Instituição 3',
//         Modalidade: 'Modalidade 3',
//         Editar: 'Editar',
//         'Inativo/Ativo': 'Ativo'
//     },
//     {
//         id: 4,
//         'Descrição do Procedimento': 'Procedimento 4',
//         'Código CBHPM': '123459',
//         Instituição: 'Instituição 4',
//         Modalidade: 'Modalidade 4',
//         Editar: 'Editar',
//         'Inativo/Ativo': 'Ativo'
//     },
//     {
//         id: 5,
//         'Descrição do Procedimento': 'Procedimento 5',
//         'Código CBHPM': '123460',
//         Instituição: 'Instituição 5',
//         Modalidade: 'Modalidade 5',
//         Editar: 'Editar',
//         'Inativo/Ativo': 'Ativo'
//     }
// ];

const Procedure = () => {
    return (
        <>
            <MainCard title="Cadastro de Procedimentos">
                <TextField /// TODO: Pedi orientação para implementar o layout do label "search" inside do textfield
                    id="input-with-icon-textfield"
                    variant="outlined"
                    label="Search"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Box display="flex" alignItems="center">
                                    <Search sx={{ color: 'action.active', mr: 1 }} />
                                </Box>
                            </InputAdornment>
                        )
                        // <Search sx={{ color: 'action.active', mr: 0, my: 0.5 }} />
                    }}
                />
                <DataGrid columns={columns} data={mockRows} />
            </MainCard>
        </>
    );
};

export default Procedure;
