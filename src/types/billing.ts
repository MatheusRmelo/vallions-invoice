export type Billing = {
    id: number;
    unidade: string;

    dateOfBilling: Date;
    statusOfBilling: string;
    qtn: number;
    valueTotal: number;
    reportsBilling: ReportBilling[];
};

export type ReportBilling = {
    id: number;
    namePatient: string;
    dateOfReport: Date;
    doctorName: string;
    unity: string;
    titleOfReport: string;
    valueReport: number;
};
export function parseReportBilling(data: any): ReportBilling {
    return {
        id: data.id,
        namePatient: data.namePatient,
        dateOfReport: new Date(data.dateOfReport),
        titleOfReport: data.titleOfReport,
        valueReport: data.valueReport,
        unity: data.unity,
        doctorName: data.doctor
    };
}

export function generateReportBilling(): ReportBilling[] {
    return [
        {
            id: 0,
            namePatient: 'PACIENTE TESTE',
            dateOfReport: new Date(),
            titleOfReport: '',
            valueReport: 0,
            unity: 'UNIDADE TESTE',
            doctorName: 'DOUTOR TESTE'
        },
        {
            id: 1,
            namePatient: 'PACIENTE TESTE',
            dateOfReport: new Date(),
            titleOfReport: '',
            valueReport: 0,
            unity: 'UNIDADE TESTE',
            doctorName: 'DOUTOR TESTE'
        }
    ];
}

export function parseReportBillingList(data: any): ReportBilling[] {
    return data.map((item: any) => parseReportBilling(item));
}

export function parseBilling(data: any): Billing {
    return {
        id: data.id,
        dateOfBilling: new Date(data.dateOfStudy),
        statusOfBilling: data.statusOfStudy,
        qtn: data.qtn,
        unidade: data.unity,
        valueTotal: data.valueTotal,
        reportsBilling: parseReportBillingList(data.reportsBilling)
    };
}

export function generateBilling(): Billing[] {
    return [
        {
            id: 0,
            dateOfBilling: new Date(),
            statusOfBilling: 'Em Aberto',
            qtn: 1,
            unidade: 'UNIDADE TESTE',
            valueTotal: 0,
            reportsBilling: generateReportBilling()
        },
        {
            id: 1,
            dateOfBilling: new Date(),
            statusOfBilling: 'Em Aberto',
            qtn: 1,
            unidade: 'UNIDADE TESTE',
            valueTotal: 0,
            reportsBilling: generateReportBilling()
        }
    ];
}

export function parseBillingList(data: any): Billing[] {
    return data.map((item: any) => parseBilling(item));
}
