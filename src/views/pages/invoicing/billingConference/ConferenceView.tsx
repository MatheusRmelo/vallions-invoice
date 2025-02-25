import { ExpandLess, ExpandMore, MoreVert, RemoveRedEyeOutlined } from '@mui/icons-material';
import { Box, IconButton, Checkbox, Typography, Chip, Menu, MenuItem, Button } from '@mui/material';
import { DataGrid, GridRow } from '@mui/x-data-grid';
import { useState } from 'react';
import { Conference } from 'types/conference';

type Props = {
    conferences: Conference[];
    expandedRowIds: string[];
    handleExpandClick: (id: string) => void;
    handleChangeCheckedConference: (id: string) => void;
    handleChangeCheckedReport: (idBilling: string, idReport: number) => void;
};
const ConferenceView = ({
    conferences,
    expandedRowIds,
    handleExpandClick,
    handleChangeCheckedConference,
    handleChangeCheckedReport
}: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                '& .MuiDataGrid-root': {
                    border: 'none',
                    maxHeight: '65vh'
                },
                '& .MuiDataGrid-cell': {
                    borderBottom: 'none',
                    fontSize: '12px'
                },
                '& .MuiDataGrid-columnHeaders': {
                    borderBottom: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold'
                },
                '& .MuiDataGrid-footerContainer': {
                    borderTop: 'none'
                },
                '& .MuiDataGrid-virtualScroller': {
                    overflow: 'auto'
                }
            }}
        >
            <DataGrid
                rows={conferences.map((conference) => {
                    return {
                        id: `${conference.id}${conference.patient_name}`,
                        namePatient: conference.patient_name,
                        study_description: conference.description,
                        dateOfStudy: conference.date_study,
                        unity: conference.branch_name,
                        quantity: conference.reports_finished_count,
                        valueUnit: Number(
                            conference.reports_finished.map((e) => Number(e.report_price)).reduce((a, b) => a + b, 0)
                        ).toLocaleString(),
                        valueTotal: (
                            Number(conference.reports_finished_count) *
                            Number(conference.reports_finished.map((e) => Number(e.report_price)).reduce((a, b) => a + b, 0))
                        ).toLocaleString(),
                        checked: conference.checked
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
                        field: 'namePatient',
                        headerName: 'Nome do Paciente',
                        flex: 2,
                        minWidth: 150,
                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Nome do Paciente</strong>
                    },
                    {
                        field: 'study_description',
                        minWidth: 150,
                        headerName: 'Descrição do Estudo',
                        flex: 2,
                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Descrição do Estudo</strong>
                    },
                    {
                        field: 'dateOfStudy',
                        minWidth: 150,
                        headerName: 'Data do Estudo',
                        flex: 1,
                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Data do Estudo</strong>
                    },
                    {
                        field: 'unity',
                        minWidth: 150,
                        headerName: 'Unidade',
                        flex: 1,
                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Unidade</strong>
                    },
                    {
                        field: 'quantity',
                        minWidth: 150,
                        headerName: 'Qtn',
                        flex: 1,
                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Qtn</strong>
                    },
                    {
                        field: 'valueUnit',
                        minWidth: 150,
                        headerName: '$ Valor Laudo',
                        flex: 1,
                        renderHeader: () => <strong style={{ fontSize: '12px' }}>$ Valor Laudo</strong>
                    },
                    {
                        field: 'valueTotal',
                        minWidth: 150,
                        headerName: '$ Total',
                        flex: 1,
                        renderHeader: () => <strong style={{ fontSize: '12px' }}>$ Total</strong>
                    }
                ]}
                hideFooter={false}
                getRowId={(row) => row.id}
                pagination
                slots={{
                    row: (props) => {
                        const { row } = props;
                        return (
                            <>
                                <GridRow {...props} />
                                {expandedRowIds.includes(row.id) && (
                                    <div
                                        style={{
                                            gridColumn: '1 / -1',
                                            padding: '16px',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Box height={20} />
                                        <Typography variant="h3">Laudos</Typography>
                                        <Box height={20} />
                                        <div
                                            style={{
                                                height: '250px',
                                                width: '100%'
                                            }}
                                        >
                                            <DataGrid
                                                rows={(
                                                    conferences.find(
                                                        (conference) =>
                                                            `${conference.id}${conference.patient_name}` === row.id
                                                    )?.reports_finished || []
                                                ).map((report) => {
                                                    return {
                                                        id: report.id,
                                                        reportDate: report.date_report,
                                                        reportTitle: report.title,
                                                        reportValue: 'Não encontrado',
                                                        status: report.status,
                                                        checked: report.checked
                                                    };
                                                })}
                                                columns={[
                                                    {
                                                        field: 'id',
                                                        headerName: '#',
                                                        minWidth: 120,
                                                        width: 120,
                                                        renderHeader: () => <strong style={{ fontSize: '12px' }}>#</strong>,
                                                        renderCell: (params) => (
                                                            <Box>
                                                                <Checkbox
                                                                    checked={params.row.checked}
                                                                    onChange={(v) =>
                                                                        handleChangeCheckedReport(row.id, Number(params.row.id))
                                                                    }
                                                                />
                                                                {params.value}
                                                            </Box>
                                                        )
                                                    },
                                                    {
                                                        field: 'reportDate',
                                                        headerName: 'Data do Laudo',
                                                        minWidth: 150,
                                                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Data do Laudo</strong>,
                                                        flex: 2
                                                    },
                                                    {
                                                        field: 'reportTitle',
                                                        headerName: 'Título do Laudo',
                                                        minWidth: 150,
                                                        renderHeader: () => <strong style={{ fontSize: '12px' }}>Título do Laudo</strong>,
                                                        flex: 2
                                                    },
                                                    {
                                                        field: 'reportValue',
                                                        headerName: '$ Valor Laudo',
                                                        minWidth: 150,
                                                        renderHeader: () => <strong style={{ fontSize: '12px' }}>$ Valor Laudo</strong>,
                                                        flex: 2
                                                    },
                                                    {
                                                        field: 'status',
                                                        headerName: 'Status',
                                                        minWidth: 150,

                                                        flex: 2,
                                                        renderCell(params) {
                                                            return (
                                                                <Chip
                                                                    variant="outlined"
                                                                    color={params.value == 0 ? 'error' : 'success'}
                                                                    label={
                                                                        params.value == 0
                                                                            ? 'Em aberto'
                                                                            : params.value == '1'
                                                                              ? 'Faturado'
                                                                              : ''
                                                                    }
                                                                />
                                                            );
                                                        }
                                                    },

                                                    {
                                                        field: 'action',
                                                        headerName: ' ',
                                                        minWidth: 150,

                                                        flex: 1,
                                                        renderCell(params) {
                                                            return <RowMenu row={params.row} />;
                                                        }
                                                    }
                                                ]}
                                                hideFooter
                                                getRowId={(row) => row.id}
                                                sx={{
                                                    '& .MuiDataGrid-root': {
                                                        border: 'none',
                                                        overflow: 'auto'
                                                    },
                                                    '& .MuiDataGrid-virtualScroller': {
                                                        overflow: 'auto'
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    }
                }}
            />
        </Box>
    );
};

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
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={() => handleAction('edit')}>
                    <RemoveRedEyeOutlined sx={{ color: 'action.active', fontSize: '2.3vh', marginRight: '0.3vh' }} />
                    <Box width={8} />
                    <span style={{ fontSize: '1.5vh', fontWeight: 'bold' }}>Imagens</span>
                </MenuItem>
                <MenuItem onClick={() => handleAction('delete')}>
                    <RemoveRedEyeOutlined sx={{ color: 'action.active', fontSize: '2.3vh', marginRight: '0.3vh' }} />
                    <Box width={8} />
                    <span style={{ fontSize: '1.5vh', fontWeight: 'bold' }}>Laudos</span>
                </MenuItem>
            </Menu>
        </>
    );
};

export default ConferenceView;
