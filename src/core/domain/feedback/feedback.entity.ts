import { RespostaObjetiva } from './resposta-objetiva.entity';

export type StatusFeedback = 'ABERTO' | 'FECHADO' | 'EM_ANALISE';

export interface IFeedback {
  id_feedback: string;
  clienteId: string;
  filialId: string;
  status_feedback: StatusFeedback;
  data_criacao: Date;
  respostas: RespostaObjetiva[];
}

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
