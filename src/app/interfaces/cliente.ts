export interface Cliente {
    tipo_doc:string;
    id: number;
    nombres:string;
    tipo_cliente?: string;
    pais?:string;
    departamento?:string;
    municipio?: string;
    planta?: string;
}
