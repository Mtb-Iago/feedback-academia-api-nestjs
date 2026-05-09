import { RespostaObjetiva } from './resposta-objetiva.entity';

export class Feedback {
  constructor(
    public readonly id_feedback: string,
    public clienteId: string,
    public filialId: string,
    public status_feedback: string,
    public data_criacao: Date,
    public respostas: RespostaObjetiva[] = [],
  ) {}
}
