export class Cliente {
  constructor(
    public id: string,
    public nome: string,
    public data_cadastro: Date,
    public telefone: string,
    public email: string,
  ) {}
}