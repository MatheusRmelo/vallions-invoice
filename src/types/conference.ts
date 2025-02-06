export type Conference = {
    id: number,
    patient_name: string,
    branch_name: string,
    price: string,
    reports_finished_count: string,
    reports_finished: ReportConference[],
    checked: boolean,
};

export type ReportConference = {
    id: number,
    study_fk: string,
    title: string,
    status: string,
    date_report: string,
    checked: boolean,
};
export function parseReportConference(data: any): ReportConference {
    return {
        id: data.id,
        study_fk: data.study_fk,
        title: data.title,
        status: data.status,
        date_report: data.date_report,
        checked: false,
    };
}

export function parseReportConferenceList(data: any): ReportConference[] {
    return data.map((item: any) => parseReportConference(item));
}

export function parseConference(data: any): Conference {
    return {
        id: data.id,
        patient_name: data.patient_name,
        branch_name: data.branch_name,
        price: data.price,
        reports_finished_count: data.reports_finished_count,
        reports_finished: parseReportConferenceList(data.reports_finished),
        checked: false,
    };
}

export function parseConferenceList(data: any): Conference[] {
    return data.map((item: any) => parseConference(item));
}
