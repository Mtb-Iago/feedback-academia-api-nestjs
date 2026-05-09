import { Injectable } from '@nestjs/common';
import { ClienteRepository } from 'src/core/ports/cliente.repository';
import { Cliente } from 'src/core/domain/cliente/cliente.entity';

@Injectable()
export class ListarClientesUseCase {
  constructor(private readonly clienteRepo: ClienteRepository) {}

  async executar(): Promise<Cliente[]> {
    return this.clienteRepo.listarTodos();
  }
}
