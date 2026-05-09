import { Injectable, NotFoundException } from '@nestjs/common';
import { ClienteRepository } from 'src/core/ports/cliente.repository';
import { Cliente } from 'src/core/domain/cliente/cliente.entity';

@Injectable()
export class AtualizarClienteUseCase {
  constructor(private readonly clienteRepo: ClienteRepository) {}

  async executar(id: string, dados: Partial<Cliente>): Promise<Cliente> {
    // 1. Verifica se o feedback existe
    const existe = await this.clienteRepo.buscarPorId(id);

    if (!existe) {
      throw new NotFoundException(`Feedback com ID ${id} não encontrado`);
    }

    // 2. Executa a atualização através da porta
    const feedbackAtualizado = await this.clienteRepo.atualizar(id, dados);

    return feedbackAtualizado;
  }
}
