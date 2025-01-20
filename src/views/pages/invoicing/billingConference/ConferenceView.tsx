import { ExpandLess, ExpandMore, MoreVert } from "@mui/icons-material";
import { Box, IconButton, Checkbox, Typography, Chip } from "@mui/material";
import { DataGrid, GridRow } from "@mui/x-data-grid";
import { Billing } from "types/billing";

type Props = {
    conferences: Billing[],
    expandedRowIds: number[],
    handleExpandClick: (id: number) => void,
    handleChangeCheckedConference: (id: number) => void,
    handleChangeCheckedReport: (idBilling: number, idReport: number) => void,
}
const ConferenceView = ({ conferences, expandedRowIds, handleExpandClick, handleChangeCheckedConference, handleChangeCheckedReport }: Props) => {
    return (
        <DataGrid
            rows={conferences.map((conference) => {
                return {
                    id: conference.id,
                    namePatient: '',
                    study_description: '',
                    dateOfStudy: conference.dateOfBilling,
                    unity: conference.unidade,
                    quantity: '',
                    valueUnit: '',
                    valueTotal: conference.valueTotal,
                    checked: conference.checked,
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
                            <Checkbox checked={params.row.checked} onChange={(v) => handleChangeCheckedConference(params.row.id)} />
                        </Box>
                    )
                },
                {
                    field: 'namePatient', headerName: 'Nome do Paciente', flex: 2, minWidth: 150
                    , renderHeader: () => <strong style={{ fontSize: '12px' }}>Nome do Paciente</strong>,

                },
                {
                    field: 'study_description', minWidth: 150, headerName: 'Descrição do Estudo', flex: 2,
                    renderHeader: () => <strong style={{ fontSize: '12px' }}>Descrição do Estudo</strong>,
                },
                {
                    field: 'dateOfStudy', minWidth: 150, headerName: 'Data do Estudo', flex: 1,
                    renderHeader: () => <strong style={{ fontSize: '12px' }}>Data do Estudo</strong>
                },
                {
                    field: 'unity', minWidth: 150, headerName: 'Unidade', flex: 1,
                    renderHeader: () => <strong style={{ fontSize: '12px' }}>Unidade</strong>
                },
                {
                    field: 'quantity', minWidth: 150, headerName: 'Qtn', flex: 1,
                    renderHeader: () => <strong style={{ fontSize: '12px' }}>Qtn</strong>
                },
                {
                    field: 'valueUnit', minWidth: 150, headerName: '$ Valor Laudo', flex: 1,
                    renderHeader: () => <strong style={{ fontSize: '12px' }}>$ Valor Laudo</strong>
                },
                {
                    field: 'valueTotal', minWidth: 150, headerName: '$ Total', flex: 1,
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
                                                conferences.find((conference) => conference.id === row.id)
                                                    ?.reportsBilling || []
                                            ).map((report) => {
                                                return {
                                                    id: report.id,
                                                    namePatient: report.namePatient,
                                                    reportDate: report.dateOfReport,
                                                    reportTitle: report.titleOfReport,
                                                    reportValue: report.valueReport,
                                                    status: '0',
                                                    checked: report.checked,
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
                                                    minWidth: 150,
                                                    flex: 2,
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
                                                    minWidth: 150,

                                                    flex: 2
                                                },
                                                {
                                                    field: 'reportTitle',
                                                    headerName: 'Título do Laudo',
                                                    minWidth: 150,

                                                    flex: 2
                                                },
                                                {
                                                    field: 'reportValue',
                                                    headerName: '$ Valor Laudo',
                                                    minWidth: 150,

                                                    flex: 2
                                                },
                                                {
                                                    field: 'status',
                                                    headerName: 'Status',
                                                    minWidth: 150,

                                                    flex: 2,
                                                    renderCell(params) {
                                                        return <Chip
                                                            variant='outlined'
                                                            color={params.value == 0 ? 'error' : 'success'}
                                                            label={params.value == 0 ? 'Em aberto' : ''} />;
                                                    }
                                                },

                                                {
                                                    field: 'action',
                                                    headerName: ' ',
                                                    minWidth: 150,

                                                    flex: 1,
                                                    renderCell(params) {
                                                        return (
                                                            <IconButton>
                                                                <MoreVert sx={{ color: 'action.active' }} />
                                                            </IconButton>
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
        />
    );
}

export default ConferenceView;