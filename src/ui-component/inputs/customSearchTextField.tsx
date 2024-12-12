import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { styled } from '@mui/system';

// interface CustomTextFieldProps {
//     hasValue: boolean;
// }

type CustomTextFieldProps = {
    hasValue: boolean;
};

type SearchFieldProps = {
    label?: string;
    prefixIcon?: React.ReactNode;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== 'hasValue'
})<CustomTextFieldProps>(({ theme, hasValue }) => ({
    '& .MuiInputBase-root': {
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        padding: '0 16px',
    },
    '& .custom-label': {
        position: 'absolute',
        left: theme.spacing(6),
        color: theme.palette.text.secondary,
        pointerEvents: 'none',
        transition: '0.2s ease',
        transform: hasValue ? 'translateY(-1.5em) scale(0.75)' : 'none'
    },
    '& .Mui-focused .custom-label': {
        transform: 'translateY(-1.8em) scale(0.75) translateX(-4.0em)',
        color: theme.palette.primary.main,
        padding: '0 6px',
        backgroundColor: 'transparent',
        zIndex: 9999
    },
    '& .MuiInputBase-input': {
    },
    '& .MuiInputLabel-root': {
        paddingLeft: '16px',
    },
    /// Color white all field
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
        }
    }
}));

/**
 * SearchField component renders a custom text field with a search icon and label.
 *
 * @param {SearchFieldProps} props - The properties for the SearchField component.
 * @param {string} [props.label='Search'] - The label to display inside the text field when it is empty.
 * @param {React.ReactNode} [props.prefixIcon=<Search color="action" />] - The icon to display at the start of the text field.
 * @param {string} props.value - The value of the text field.
 * @param {function} props.onChange - The function to call when the text field value changes.
 *
 */
const SearchField: React.FC<SearchFieldProps> = ({
    label = 'Search',
    prefixIcon = <Search color="action" fontSize="small" />,
    value: propValue,
    onChange
}) => {
    const hashValueClick: string = Math.random().toString(36).substring(7);

    const [value, setValue] = useState<string>(propValue || '');
    ///Click icon focus field
    const clickIcon = () => {
        console.log('clickIcon: ', hashValueClick);
        document.getElementById(hashValueClick)?.focus();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        if (onChange) {
            onChange(event);
        }
    };

    return (
        <Box display="flex" alignItems="center" position="relative">

            <Box sx={{ marginLeft: '20px' }}><Box
                onClick={clickIcon}
                sx={{
                    zIndex: 1000,
                    position: 'absolute',
                    top: '55%',
                    transform: 'translateY(-50%)',
                    marginRight: '8px'
                }}
            >
                {prefixIcon}
            </Box>
                <CustomTextField
                    id={hashValueClick}
                    variant="outlined"
                    value={value}
                    onChange={handleChange}
                    label={label}
                    hasValue={Boolean(value)}
                />
            </Box>
        </Box>
    );
};

export default SearchField;
