import { Deuda } from "./deuda";
import { User } from "./user";

export interface Pago {
    id: number,
    fecha: string,
    mes: string,
    monto_pagado: string,
    metodo_pago: string,
    adelanto: string, 
    id_deuda: number,
    id_user: number,
    Deuda?:Deuda,
    user?:User
}
