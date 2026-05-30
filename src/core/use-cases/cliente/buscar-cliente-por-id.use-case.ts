import { Injectable, NotFoundException } from '@nestjs/common';
import { ClienteRepository } from 'src/core/ports/cliente.repository';
import { Cliente } from 'src/core/domain/cliente/cliente.entity';

@Injectable()
export class BuscarClientePorIdUseCase {
  constructor(private readonly clienteRepo: ClienteRepository) {}

  async executar(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepo.buscarPorId(id);
    if (!cliente) throw new NotFoundException(`Cliente ${id} não encontrado`);
    return cliente;
  }
}
