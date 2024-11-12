import React from 'react';
import { Dialog, DialogTitle, DialogContentText } from '@mui/material';
import { Box } from '@mui/material';
type TableOfValueFormProps = {
    open: boolean;
    handleClose: () => void;
};

const TableOfValueForm: React.FC<TableOfValueFormProps> = ({ open, handleClose }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: '50%',
                    height: 300
                }
            }}
        >
            ,
            <Box m="8px 0 0 0" width="100%" height="01vh">
                <DialogTitle sx={{ fontSize: '20px' }}>Procedimentos</DialogTitle>
                <DialogContentText sx={{ fontSize: '12px' }}>
                    <strong>Cadastro de Tabela de Valores: </strong>
                    Preencha todas as informações necessárias para tabela, como descrição, instituição, e os valores correspondentes aos
                    procedimentos. Certifique-se de que os valores estão corretos e adequados antes de salvar. Confirme se deseja cadastrar
                    esta tabela de valores.
                </DialogContentText>
            </Box>
        </Dialog>
    );
};

export default TableOfValueForm;
