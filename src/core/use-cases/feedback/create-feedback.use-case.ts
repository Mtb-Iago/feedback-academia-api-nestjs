import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackRepository } from '../../ports/feedback.repository';
import { Feedback } from '../../domain/feedback/feedback.entity';
import { ClienteRepository } from 'src/core/ports/cliente.repository';

@Injectable()
export class CriarFeedbackUseCase {
  constructor(
    private readonly feedbackRepo: FeedbackRepository,
    private readonly clienteRepo: ClienteRepository,
  ) {}

  async executar(dados: any): Promise<Feedback> {
    // Aqui viria a lógica de validação de negócio e criação da entidade
    const cliente = await this.clienteRepo.buscarPorId(dados.clienteId);

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

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
