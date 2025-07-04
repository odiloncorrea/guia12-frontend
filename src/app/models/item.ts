import { Produto } from "./produto";

export class Item {
        id!: number;
        valor?: number;    
        quantidade?: number;
        idPedido!: number;
        produto?: Produto;
}
