import { Tipo } from "./tipo";

export class Produto {
    id!: number;
    descricao?: string;    
    valor?: number;
    estoque?: number;
    tipo?: Tipo;
}
