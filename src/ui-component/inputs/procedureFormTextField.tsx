import * as React from 'react';
import TextField from '@mui/material/TextField';

interface ProcedureFormFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: boolean;
    helperText: string;
}

const ProcedureFormField: React.FC<ProcedureFormFieldProps> = ({ label, name, value, onChange, error, helperText, ...props }) => {
    return (
        <TextField
            label={label}
            name={name}
            variant="outlined"
            fullWidth
            value={value}
            onChange={onChange}
            error={error}
            size='small'
            /// Removido pela incerteza se é necessário
            // helperText={helperText}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderRadius: '12px'
                        // backgroundColor: 'white'
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'rgba(198, 40, 40, 1)'
                    },
                    backgroundColor: value ? 'white' : 'inherit',
                    color: value ? 'black' : 'inherit'
                },
                '& .MuiInputBase-input': {
                    color: 'black' // Define explicitamente a cor do texto
                },
                '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                        color: 'rgba(198, 40, 40, 1)'
                    },
                    left: 0,
                    right: 0
                    // textAlign: 'center'
                    // transformOrigin: 'center'
                },

                /// Definir Height
                '& .MuiInputBase-root': {
                    height: '43px'
                }
            }}
            {...props}
        />
    );
};

export default ProcedureFormField;
