export type Billing = {
    id: number;
    unidade: string;

    dateOfBilling: string;
    statusOfBilling: string;
    qtn: number;
    valueTotal: number;
    reportsBilling: ReportBilling[];
    checked: boolean;
};

export type ReportBilling = {
    id: number;
    namePatient: string;
    dateOfReport: string;
    doctorName: string;
    unity: string;
    titleOfReport: string;
    valueReport: number;
    checked: boolean;
    status: string | null;
};
export function parseReportBilling(data: any): ReportBilling {

    return {
        id: data.id,
        namePatient: `${data.name} - ${Math.random()}`,
        dateOfReport: data.date_study,
        titleOfReport: data.title,
        valueReport: parseFloat(data.price),
        unity: data.branch,
        doctorName: '',
        checked: false,
        status: null,
    };
}


export function parseReportBillingList(data: any): ReportBilling[] {
    return data.map((item: any) => parseReportBilling(item));
}

export function parseBilling(data: any): Billing {
    return {
        id: data.id,
        dateOfBilling: data.month_closing,
        statusOfBilling: data.status,
        qtn: 0,
        unidade: data.branch_name,
        valueTotal: data.value_total,
        reportsBilling: [],
        checked: false,
    };
}

export function parseBillingList(data: any): Billing[] {
    return data.map((item: any) => parseBilling(item));
}
