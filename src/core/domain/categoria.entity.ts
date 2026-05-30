export class Categoria {
  constructor(
    public readonly id_categoria: number,
    public nome: string,
    public descricao: string,
    public ordem_exibicao: number,
  ) {}
}
