import { Injectable } from '@nestjs/common';
import { FeedbackRepository } from '../../ports/feedback.repository';
import { Feedback } from '../../domain/feedback/feedback.entity';

@Injectable()
export class CriarFeedbackUseCase {
  constructor(private readonly feedbackRepo: FeedbackRepository) {}

  async executar(dados: any): Promise<Feedback> {
    // Aqui viria a lógica de validação de negócio e criação da entidade
    const novoFeedback = new Feedback(
      crypto.randomUUID(),
      dados.clienteId,
      dados.filialId,
      'ABERTO',
      new Date(),
      dados.respostas,
    );

    await this.feedbackRepo.salvar(novoFeedback);
    return novoFeedback;
  }
}
