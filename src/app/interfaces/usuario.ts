export interface Usuario {
    idUsuarioRegistro: number;
    tipo_documento:string;
    documento: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    email: string;
    password: string;
    rol: number;
    listPlanta: number[];
    listZona?: number[];
    listCliente?: number[];
}
