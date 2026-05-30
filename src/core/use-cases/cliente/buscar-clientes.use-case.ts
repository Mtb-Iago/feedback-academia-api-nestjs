import { Injectable } from '@nestjs/common';
import { ClienteRepository } from '../../ports/cliente.repository';
import { Cliente } from '../../domain/cliente/cliente.entity';

@Injectable()
export class BuscarClientesUseCase {
  constructor(private readonly clienteRepo: ClienteRepository) {}

  async executar(filtros: {
    nome?: string;
    email?: string;
    telefone?: string;
  }): Promise<Cliente[]> {
    return await this.clienteRepo.buscarPorFiltros(filtros);
  }
}
