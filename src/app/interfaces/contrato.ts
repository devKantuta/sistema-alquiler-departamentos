import { Cuarto } from "./cuarto";
import { Inquilino } from "./inquilino";

export interface Contrato {
    id: number,
    fecha_inicio: string,
    fecha_fin: string,
    estado: boolean,
    mesesadelanto: number,
    pagoadelanto: number,
    id_inquilino : number,
    id_cuarto: number,
    inquilino?: Inquilino; // Relación con Inquilino
    cuarto?: Cuarto; // Relación con Cuarto
}