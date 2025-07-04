import { Usuario } from "./usuario";

export class Pedido {
    id!: number;
    data?: Date;    
    valor?: number;
    usuario?: Usuario;
}
