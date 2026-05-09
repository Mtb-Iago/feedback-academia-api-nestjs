import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackRepository } from '../../ports/feedback.repository';
import { Feedback } from '../../domain/feedback/feedback.entity';

@Injectable()
export class AtualizarFeedbackUseCase {
  constructor(private readonly feedbackRepo: FeedbackRepository) {}

  async executar(id: string, dados: Partial<Feedback>): Promise<Feedback> {
    // 1. Verifica se o feedback existe
    const existe = await this.feedbackRepo.buscarPorId(id);

    if (!existe) {
      throw new NotFoundException(`Feedback com ID ${id} não encontrado`);
    }

    // 2. Executa a atualização através da porta
    const feedbackAtualizado = await this.feedbackRepo.atualizar(id, dados);

    return feedbackAtualizado;
  }
}
