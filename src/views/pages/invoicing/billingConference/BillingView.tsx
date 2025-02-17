import { ExpandLess, ExpandMore, DeleteOutline, MoreVert, RemoveRedEyeOutlined } from "@mui/icons-material";
import { IconButton, Chip, Box, Typography, Checkbox, Menu, MenuItem } from "@mui/material";
import { DataGrid, GridRow } from "@mui/x-data-grid";
import { useState } from "react";
import { Billing } from "types/billing";

type Props = {
    billings: Billing[],
    expandedRowIds: string[],
    handleExpandClick: (id: string, status: string) => void,
    handleChangeCheckedBilling: (id: number) => void,
    handleChangeCheckedReport: (idBilling: number, idReport: number) => void,
}
const BillingView = ({
    billings,
    expandedRowIds,
    handleExpandClick,
    handleChangeCheckedBilling,
    handleChangeCheckedReport }: Props) => {
    return (
        <Box sx={{
            '& .MuiDataGrid-root': { border: 'none' },
            '& .MuiDataGrid-cell': { borderBottom: 'none', fontSize: '12px' },
            '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', fontSize: '12px', fontWeight: 'bold' },
            '& .MuiDataGrid-footerContainer': { borderTop: 'none' }
        }}>
            <DataGrid
                rows={billings.map((billing) => {
                    return {
                        id: billing.id,
                        unity: billing.unidade,
                        monthOfBilling: billing.dateOfBilling,
                        statusOfBilling: billing.statusOfBilling,
                        quantity: '',
                        totalValue: Number(billing.valueTotal).toLocaleString(),
                        checked: billing.checked,
                    };
                })}
                columns={[
                    {
                        field: 'expand',
                        headerName: '#',
                        width: 100,
                        renderCell: (params) => (
                            <Box>
                                <IconButton onClick={() => handleExpandClick(params.row.id.toString(), params.row.statusOfBilling)}>
                                    {expandedRowIds.includes(params.row.id.toString()) ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                                <Checkbox checked={params.row.checked} onChange={(v) => handleChangeCheckedBilling(params.row.id)} />
                            </Box>
                        )
                    },
                    {
                        field: 'unity', headerName: 'Unidade', flex: 1, minWidth: 150,
                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Unidade</strong>,
                    },
                    {
                        field: 'monthOfBilling', headerName: 'Mês da Fatura',
                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Mês da Fatura</strong>,
                        flex: 1, minWidth: 150,
                    },
                    {
                        field: 'statusOfBilling',
                        headerName: 'Status da Fatura',
                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Status da Fatura</strong>,
                        flex: 2, minWidth: 150,
                        renderCell(params) {
                            return <Chip
                                variant='outlined'
                                color={params.value == 0 ? 'primary' : params.value == 1 ? 'success' : params.value == 2 ? 'error' : 'info'}
                                label={params.value == 0 ? 'Aguardando faturamento' : params.value == 1 ? 'Faturado' : params.value == 2 ? 'Estornado' : 'Conferência'} />;
                        }
                    },
                    {
                        field: 'quantity', headerName: 'Qtn', flex: 1, minWidth: 150,
                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Qtn</strong>,
                    },
                    {
                        field: 'totalValue', headerName: '$ Total', flex: 1, minWidth: 150,
                        renderHeader: () => <strong style={{ fontSize: '12px' }}>$ Total</strong>,
                    }
                ]}
                hideFooter
                getRowId={(row) => row.id}
                slots={{
                    row: (props) => {
                        const { row } = props;
                        return (
                            <>
                                <GridRow {...props} />
                                {expandedRowIds.includes(row.id.toString()) && (
                                    <div style={{ gridColumn: '1 / -1', padding: '16px' }}>
                                        <Box height={20} />
                                        <Typography variant="h3">Laudos</Typography>
                                        <Box height={20} />
                                        <div style={{ height: 200, width: '100%' }}>
                                            <DataGrid
                                                rows={(
                                                    billings.find((billing) => billing.id === row.id)?.reportsBilling ||
                                                    []
                                                ).map((report) => {
                                                    return {
                                                        id: report.id,
                                                        namePatient: report.namePatient,
                                                        reportDate: report.dateOfReport,
                                                        status: report.status,
                                                        unity: report.unity,
                                                        reportTitle: report.titleOfReport,
                                                        reportValue: report.valueReport,
                                                        checked: report.checked,
                                                    };
                                                })}
                                                columns={[
                                                    {
                                                        field: 'id',
                                                        headerName: '#',
                                                        minWidth: 64,
                                                        width: 64,
                                                        renderHeader: () => <strong style={{ fontSize: '12px' }}>ID</strong>,
                                                    },
                                                    {
                                                        field: 'namePatient',
                                                        headerName: 'Nome do Paciente',
                                                        flex: 2,
                                                        minWidth: 150,
                                                        renderHeader: () => (<strong style={{ fontSize: '12px' }}>Nome do Paciente</strong>),
                                                        renderCell: (params) => (
                                                            <Box>
                                                                <Checkbox checked={params.row.checked} onChange={(v) => handleChangeCheckedReport(row.id, params.row.id)} />
                                                                {(params.value as string).split("-")[0]}
                                                            </Box>
                                                        )
                                                    },
                                                    {
                                                        field: 'reportDate',
                                                        headerName: 'Data do Laudo',
                                                        renderHeader: () => (<strong style={{ fontSize: '12px' }}>Data do Laudo</strong>),
                                                        flex: 2,
                                                        minWidth: 150,
                                                    },
                                                    {
                                                        field: 'status',
                                                        headerName: 'Status',
                                                        renderHeader: () => (<strong style={{ fontSize: '12px' }}>Status</strong>),
                                                        flex: 1,
                                                        minWidth: 150,
                                                        renderCell(params) {
                                                            return <Chip
                                                                variant='outlined'
                                                                color={params.value == 0 ? 'primary' : params.value == 1 ? 'success' : params.value == 2 ? 'error' : 'info'}
                                                                label={params.value == 0 ? 'Aguardando faturamento' : params.value == 1 ? 'Faturado' : params.value == 2 ? 'Estornado' : 'Conferência'} />;
                                                        }
                                                    },
                                                    {
                                                        field: 'unity',
                                                        headerName: 'Unidade',
                                                        renderHeader: () => (<strong style={{ fontSize: '12px' }}>Unidade</strong>),
                                                        flex: 1,
                                                        minWidth: 150,
                                                    },
                                                    {
                                                        field: 'reportTitle',
                                                        headerName: 'Título do Laudo',
                                                        renderHeader: () => (<strong style={{ fontSize: '12px' }}>Título do Laudo</strong>),
                                                        flex: 1,
                                                        minWidth: 150,
                                                    },
                                                    {
                                                        field: 'reportValue',
                                                        headerName: '$ Valor Laudo',
                                                        renderHeader: () => (<strong style={{ fontSize: '12px' }}>$ Valor Laudo</strong>),
                                                        flex: 1,
                                                        minWidth: 150,
                                                    },

                                                    {
                                                        field: 'action',
                                                        headerName: 'Remover',
                                                        renderHeader: () => (<strong style={{ fontSize: '12px' }}>Remover</strong>),
                                                        flex: 1,
                                                        minWidth: 150,
                                                        renderCell(params) {
                                                            return (
                                                                <Box>
                                                                    <IconButton
                                                                    >
                                                                        <DeleteOutline
                                                                            sx={{ color: 'action.active' }}
                                                                        />
                                                                    </IconButton>
                                                                    <RowMenu row={params.row} />
                                                                </Box>
                                                            );
                                                        }
                                                    }
                                                ]}
                                                hideFooter
                                                getRowId={(row) => row.namePatient}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    }
                }}
            /></Box>
    );
}

const RowMenu = ({ row }: any) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleAction = (action: any) => {
        handleCloseMenu();
    };

    return (
        <>
            <IconButton onClick={handleOpenMenu}>
                <MoreVert />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => handleAction("edit")}>
                    <RemoveRedEyeOutlined sx={{ color: 'action.active', fontSize: '2.3vh', marginRight: '0.3vh' }} />
                    <Box width={8} />
                    <span style={{ fontSize: '1.5vh', fontWeight: 'bold' }}>Imagens</span>
                </MenuItem>
                <MenuItem onClick={() => handleAction("delete")}>
                    <RemoveRedEyeOutlined sx={{ color: 'action.active', fontSize: '2.3vh', marginRight: '0.3vh' }} />
                    <Box width={8} />
                    <span style={{ fontSize: '1.5vh', fontWeight: 'bold' }}>Laudos</span>
                </MenuItem>
            </Menu>
        </>
    );
};

export default BillingView;