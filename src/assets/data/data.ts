import { Cliente } from "src/app/interfaces/cliente"
import { Granja } from "src/app/interfaces/granja"

export const clientes: Cliente[] =[
    {tipo_doc:'CC', id: 104644568, nombres:'Luis Gonzales', tipo_cliente:'Directo', pais:'Colombia', departamento:'Cundinamarca', municipio:'', planta:''},
    {tipo_doc:'NIT', id: 9848484, nombres:'Avicampo', tipo_cliente:'Distribucion', pais:'', departamento:'', municipio:'', planta:''},
    {tipo_doc:'CC', id: 4894189, nombres:'Jhon Giraldo', tipo_cliente:'Directo', pais:'Panama', departamento:'', municipio:'', planta:''}
]

export const granjas:Granja[]=[
    {cliente:'Avicampo', nombre_granja:'Granja Avicampo', certificado_gab:'si', latitud:-45.707, longitud:59.56},
    {cliente:'Luis Lopez', nombre_granja:'Granja Luis', certificado_gab:'no', latitud:-43.707, longitud:38.56},
    {cliente:'Ayton', nombre_granja:'Ayton Farm', certificado_gab:'si', latitud:-48.707, longitud:32.56},
]