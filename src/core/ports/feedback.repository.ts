import { Feedback } from '../domain/feedback/feedback.entity';

export abstract class FeedbackRepository {
  abstract salvar(feedback: Feedback): Promise<void>;
  abstract buscarPorId(id: string): Promise<Feedback | null>;
  abstract listarTodos(): Promise<Feedback[]>;
  abstract atualizar(id: string, dados: Partial<Feedback>): Promise<Feedback>;
  abstract deletar(id: string): Promise<void>;
  abstract buscarPorFiltros(filtros: {
    clienteId?: string;
    filialId?: string;
    status?: string;
  }): Promise<Feedback[]>;
}
