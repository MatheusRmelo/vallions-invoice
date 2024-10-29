// material-ui
// import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';

// ==============================|| Procedure PAGE ||============================== //

const Procedure = () => {
    return (
        <>
            <MainCard title="Cadastro de Procedimentos">
                <TextField
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
            </MainCard>
        </>
    );
};

export default Procedure;
