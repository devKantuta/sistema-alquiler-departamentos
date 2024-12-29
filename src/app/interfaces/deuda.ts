import { Contrato } from "./contrato";
export interface Deuda {
    id: number,
    monto_deuda: number,
    mes: number,
    fecha: Date,
    estado: boolean,
    id_contrato: number,
    id_usuario?: number,
    ContratoAlquiler?: Contrato // Relación con Inquilino
}