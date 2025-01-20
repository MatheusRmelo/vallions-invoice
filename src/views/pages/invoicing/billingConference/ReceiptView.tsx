import { ExpandLess, ExpandMore, DeleteOutline, MoreVert } from "@mui/icons-material";
import { IconButton, Chip, Box, Typography, Checkbox } from "@mui/material";
import { DataGrid, GridRow } from "@mui/x-data-grid";
import { stat } from "fs";
import { Billing } from "types/billing";

type Props = {
    billings: Billing[],
    expandedRowIds: number[],
    handleExpandClick: (id: number) => void,
}
const ReceiptView = ({
    billings,
    expandedRowIds,
    handleExpandClick }: Props) => {
    return (
        <DataGrid
            rows={billings.map((billing) => {
                return {
                    id: billing.id,
                    unity: billing.unidade,
                    monthOfBilling: billing.dateOfBilling,
                    statusOfBilling: billing.statusOfBilling,
                    quantity: '',
                    totalValue: billing.valueTotal,
                };
            })}
            columns={[
                {
                    field: 'expand',
                    headerName: '#',
                    width: 100,
                    renderCell: (params) => (
                        <Box>
                            <IconButton onClick={() => handleExpandClick(params.row.id)}>
                                {expandedRowIds.includes(params.row.id) ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </Box>
                    )
                },
                {
                    field: 'unity', headerName: 'Unidade', flex: 1, minWidth: 150,
                    renderHeader: () => <strong style={{ fontSize: '12px' }}>Unidade</strong>

                },
                {
                    field: 'monthOfBilling', headerName: 'Mês da Fatura', flex: 1, minWidth: 150,
                    renderHeader: () => <strong style={{ fontSize: '12px' }}>Mês da Fatura</strong>
                },
                {
                    field: 'statusOfBilling',
                    headerName: 'Status da Fatura',
                    renderHeader: () => <strong style={{ fontSize: '12px' }}>Status da Fatura</strong>,
                    flex: 2, minWidth: 150,
                    renderCell(params) {
                        return <Chip
                            variant='outlined'
                            color={params.value == 0 ? 'primary' : 'success'}
                            label={params.value == 0 ? 'Fatura em aberto' : ''} />;
                    }
                },
                {
                    field: 'quantity', headerName: 'Qtn', flex: 1, minWidth: 150,
                    renderHeader: () => <strong style={{ fontSize: '12px' }}>Qtn</strong>
                },
                {
                    field: 'valueTotal', headerName: '$ Total', flex: 1, minWidth: 150,
                    renderHeader: () => <strong style={{ fontSize: '12px' }}>$ Total</strong>
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
                            {expandedRowIds.includes(row.id) && (
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
                                                    unity: report.unity,
                                                    reportTitle: report.titleOfReport,
                                                    reportValue: report.valueReport,
                                                    status: report.status
                                                };
                                            })}
                                            columns={[
                                                {
                                                    field: 'id',
                                                    headerName: '#',
                                                    minWidth: 64,
                                                    width: 64,
                                                },
                                                {
                                                    field: 'namePatient',
                                                    headerName: 'Nome do Paciente',
                                                    flex: 2,
                                                    minWidth: 150,
                                                    renderCell: (params) => (
                                                        <Box>
                                                            {(params.value as string).split("-")[0]}
                                                        </Box>
                                                    )
                                                },
                                                {
                                                    field: 'reportDate',
                                                    headerName: 'Data do Laudo',
                                                    flex: 2,
                                                    minWidth: 150,
                                                },
                                                {
                                                    field: 'status',
                                                    headerName: 'Status',
                                                    flex: 1,
                                                    minWidth: 150,
                                                    renderCell(params) {
                                                        return <Chip
                                                            variant='outlined'
                                                            color={params.value == 2 ? 'error' : 'success'}
                                                            label={params.value == 2 ? 'Estornado' : 'Recebido'} />;
                                                    }
                                                },
                                                {
                                                    field: 'unity',
                                                    headerName: 'Unidade',
                                                    flex: 1,
                                                    minWidth: 150,
                                                },
                                                {
                                                    field: 'reportTitle',
                                                    headerName: 'Título do Laudo',
                                                    flex: 1,
                                                    minWidth: 150,
                                                },
                                                {
                                                    field: 'reportValue',
                                                    headerName: '$ Valor Laudo',
                                                    flex: 1,
                                                    minWidth: 150,
                                                },
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
        />
    );
}

export default ReceiptView;