import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackRepository } from '../../ports/feedback.repository';
import { FilialRepository } from '../../ports/filial.repository';
import { Feedback } from '../../domain/feedback/feedback.entity';
import { RespostaObjetiva } from '../../domain/feedback/resposta-objetiva.entity';
import { ClienteRepository } from 'src/core/ports/cliente.repository';

/**
 * Campos que o chamador (controller) deve fornecer ao criar um feedback.
 * Os campos `id_feedback`, `status_feedback` e `data_criacao` são gerados
 * internamente pelo próprio use-case e por isso não fazem parte do input.
 */
export interface CriarFeedbackInput {
  clienteId: string;
  filialId: string;
  respostas: RespostaObjetiva[];
}

@Injectable()
export class CriarFeedbackUseCase {
  constructor(
    private readonly feedbackRepo: FeedbackRepository,
    private readonly clienteRepo: ClienteRepository,
    private readonly filialRepo: FilialRepository,
  ) {}

  async executar(dados: CriarFeedbackInput): Promise<Feedback> {
    const cliente = await this.clienteRepo.buscarPorId(dados.clienteId);
    console.log(cliente);
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }
    // Validação de negócio: a filial referenciada precisa existir.
    // O filialId trafega como string, mas a PK da filial é Int (id_filial).
    const idFilialNumerico = Number(dados.filialId);

    if (!Number.isInteger(idFilialNumerico)) {
      throw new NotFoundException(
        `Filial com ID ${dados.filialId} não encontrada`,
      );
    }

    const filialExiste = await this.filialRepo.buscarPorId(idFilialNumerico);

    if (!filialExiste) {
      throw new NotFoundException(
        `Filial com ID ${dados.filialId} não encontrada`,
      );
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
