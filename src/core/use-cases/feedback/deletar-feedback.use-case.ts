import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackRepository } from 'src/core/ports/feedback.repository';

@Injectable()
export class DeletarFeedbackUseCase {
  constructor(private readonly feedbackRepo: FeedbackRepository) {}
  async executar(id: string) {
    const existe = await this.feedbackRepo.buscarPorId(id);
    if (!existe) throw new NotFoundException('Feedback não encontrado');
    await this.feedbackRepo.deletar(id);
  }
}
