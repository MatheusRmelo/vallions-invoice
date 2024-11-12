import React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type SnackBarProps = {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    onClose: (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
};

const SnackBarAlert: React.FC<SnackBarProps> = ({ open, message, severity, onClose }) => {
    const colorBackground =
        severity === 'success' ? 'rgba(185, 246, 202, 1)' : severity === 'error' ? 'rgba(251, 233, 231, 1)' : 'rgba(255, 248, 225, 1)';
    const colorText =
        severity === 'success' ? 'rgba(0, 200, 83, 1)' : severity === 'error' ? 'rgba(216, 67, 21, 1)' : 'rgba(255, 193, 7, 1)';

    return (
        <Snackbar open={open} autoHideDuration={2000} onClose={onClose}>
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{ width: '100%', backgroundColor: colorBackground, color: colorText }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackBarAlert;
