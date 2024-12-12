export type Conference = {
    id: number;
    namePatient: string;
    descriptionStudy: string;
    dateOfStudy: Date;
    unity: string;
    qtn: number;
    valueUnity: number;
    valueTotal: number;
    reportsConference: ReportConference[];
};

export type ReportConference = {
    id: number;
    namePatient: string;
    dateOfReport: Date;
    titleOfReport: string;
    valueReport: number;
    status: string;
};
export function parseReportConference(data: any): ReportConference {
    return {
        id: data.id,
        namePatient: data.namePatient,
        dateOfReport: new Date(data.dateOfReport),
        titleOfReport: data.titleOfReport,
        valueReport: data.valueReport,
        status: data.status
    };
}

export function generateReportConference(): ReportConference[] {
    return [
        {
            id: 0,
            namePatient: 'PACIENTE TESTE',
            dateOfReport: new Date(),
            titleOfReport: '',
            valueReport: 0,
            status: 'Em Aberto'
        },
        {
            id: 1,
            namePatient: 'PACIENTE TESTE',
            dateOfReport: new Date(),
            titleOfReport: '',
            valueReport: 0,
            status: 'Em Aberto'
        }
    ];
}

export function parseReportConferenceList(data: any): ReportConference[] {
    return data.map((item: any) => parseReportConference(item));
}

export function parseConference(data: any): Conference {
    return {
        id: data.id,
        namePatient: data.namePatient,
        descriptionStudy: data.descriptionStudy,
        dateOfStudy: new Date(data.dateOfStudy),
        unity: data.unity,
        qtn: data.qtn,
        valueUnity: data.valueUnity,
        valueTotal: data.valueTotal,
        reportsConference: parseReportConferenceList(data.reportsConference)
    };
}

export function generateConference(): Conference[] {
    return [
        {
            id: 0,
            namePatient: 'PACIENTE TESTE',
            descriptionStudy: 'DESCRIÇÃO TESTE',
            dateOfStudy: new Date(),
            unity: 'UNIDADE TESTE',
            qtn: 1,
            valueUnity: 0,
            valueTotal: 0,
            reportsConference: generateReportConference()
        },
        {
            id: 1,
            namePatient: 'PACIENTE TESTE',
            descriptionStudy: 'DESCRIÇÃO TESTE',
            dateOfStudy: new Date(),
            unity: 'UNIDADE TESTE',
            qtn: 1,
            valueUnity: 0,
            valueTotal: 0,
            reportsConference: generateReportConference()
        }
    ];
}

export function parseConferenceList(data: any): Conference[] {
    return data.map((item: any) => parseConference(item));
}
