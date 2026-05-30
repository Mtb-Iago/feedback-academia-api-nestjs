import { Injectable } from '@nestjs/common';
import { FeedbackRepository } from '../../ports/feedback.repository';
import { Feedback } from '../../domain/feedback/feedback.entity';

@Injectable()
export class BuscarFeedbackUseCase {
  constructor(private readonly feedbackRepo: FeedbackRepository) {}

  async executar(filtros: {
    clienteId?: string;
    filialId?: string;
    status?: string;
  }): Promise<Feedback[]> {
    return await this.feedbackRepo.buscarPorFiltros(filtros);
  }
}
