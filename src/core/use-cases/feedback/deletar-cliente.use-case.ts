import { Injectable, NotFoundException } from '@nestjs/common';
import { ClienteRepository } from 'src/core/ports/cliente.repository';

@Injectable()
export class DeletarClienteUseCase {
  constructor(private readonly clienteRepo: ClienteRepository) {}

  async executar(id: string): Promise<void> {
    const cliente = await this.clienteRepo.buscarPorId(id);

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    await this.clienteRepo.deletar(id);
  }
}
