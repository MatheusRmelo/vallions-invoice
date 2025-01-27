export type Doctor = {
    type: string,
    id_type_user: string,
    name: string,
    id_physician: string,
};

export function parseDoctor(data: any): Doctor {
    return {
        name: data.name,
        id_physician: data.id_physician,
        id_type_user: data.id_type_user,
        type: data.type
    };
}



