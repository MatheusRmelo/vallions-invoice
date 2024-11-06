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
    console.log(value);
    return (
        <TextField
            label={label}
            name={name}
            variant="outlined"
            fullWidth
            value={value}
            onChange={onChange}
            error={error}
            helperText={helperText}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: 'rgba(198, 40, 40, 1)'
                    },
                    backgroundColor: value ? 'white' : 'inherit',
                    color: value ? 'black' : 'inherit',
                    borderRadius: '60px'
                },

                '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                        color: 'rgba(198, 40, 40, 1)'
                    }
                }
            }}
            {...props}
        />
    );
};

export default ProcedureFormField;
