import { Unity } from './unity';

export type Billing = {
    id: number;
    unity: Unity;
    monthOfBilling: string;
    statusOfBilling: string;
    qtn: number;
    priceTotal: number;
    report: Report[];
};

export type Report = {
    id: number;
    patientName: string;
    dateReport: string;
    titleReport: string;
    valueReport: string;
    statusReport: string;
};

export function parseBilling(data: any): Billing {
    return {
        id: data.id,
        unity: data.unity,
        monthOfBilling: data.monthOfBilling,
        statusOfBilling: data.statusOfBilling,
        qtn: data.qtn,
        priceTotal: data.priceTotal,
        report: parseReportsList(data.report)
    };
}

export function parseBillingList(data: any[]): Billing[] {
    return data.map(parseBilling);
}

export function parseReports(data: any): Report {
    return {
        id: data.id,
        patientName: data.patientName,
        dateReport: data.dateReport,
        titleReport: data.titleReport,
        valueReport: data.valueReport,
        statusReport: data.statusReport
    };
}

export function parseReportsList(data: any[]): Report[] {
    return data.map(parseReports);
}

export function generateMockBilling(): Billing {
    return {
        id: 1,
        unity: {
            id: 1,
            name: 'Unity'
        },
        monthOfBilling: '2021-05',
        statusOfBilling: 'PENDING',
        qtn: 1,
        priceTotal: 100,
        report: [
            {
                id: 1,
                patientName: 'Patient Name',
                dateReport: '2021-05-01',
                titleReport: 'Report Title',
                valueReport: 'Report Value',
                statusReport: 'PENDING'
            }
        ]
    };
}
