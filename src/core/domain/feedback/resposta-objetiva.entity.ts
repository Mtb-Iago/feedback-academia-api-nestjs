export class RespostaObjetiva {
  constructor(
    public readonly id_resposta: string,
    public perguntaId: string,
    public opcao_escolhida: number, // Ex: nota de 1 a 5
  ) {}
}
