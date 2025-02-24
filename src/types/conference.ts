export type Conference = {
    id: number;
    patient_name: string;
    branch_name: string;
    // price: string;
    reports_finished_count: string;
    reports_finished: ReportConference[];
    description: string;
    date_study: string;
    checked: boolean;
};

export type ReportConference = {
    id: number;
    study_fk: string;
    title: string;
    status: string;
    date_report: string;
    report_price: string;
    checked: boolean;
};

export function parseReportConference(data: any): ReportConference {
    return {
        id: data.id || 0,
        study_fk: data.study_fk || '',
        title: data.title || '',
        status: data.status || '',
        date_report: data.date_report || '',
        report_price: data.report_price || '0',
        checked: false
    };
}

export function parseReportConferenceList(data: any): ReportConference[] {
    if (!data || !Array.isArray(data)) {
        return [];
    }
    return data.map((item: any) => parseReportConference(item));
}

export function parseConference(data: any): Conference {
    return {
        id: data.id || 0,
        patient_name: data.patient_name || '',
        branch_name: data.branch_name || '',
        // price: data.price,
        description: data.description || '',
        date_study: data.date_study || '',
        reports_finished_count: data.reports_finished_count || '0',
        reports_finished: parseReportConferenceList(data.reports_finished || []),
        checked: false
    };
}

export function parseConferenceList(data: any): Conference[] {
    if (!data || !Array.isArray(data)) {
        return [];
    }
    return data.map((item: any) => parseConference(item));
}
