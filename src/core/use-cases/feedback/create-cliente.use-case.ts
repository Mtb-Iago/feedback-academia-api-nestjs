import { Injectable } from '@nestjs/common';
import { ClienteRepository } from '../../ports/cliente.repository';
import { Cliente } from '../../domain/cliente/cliente.entity';

interface CriarClienteInput {
  nome: string;
  telefone: string;
  email: string;
}

@Injectable()
export class CriarClienteUseCase {
  constructor(private readonly clienteRepo: ClienteRepository) {}

  async executar(dados: CriarClienteInput): Promise<Cliente> {
    const novoCliente = new Cliente(
      crypto.randomUUID(),
      dados.nome,
      new Date(),
      dados.telefone,
      dados.email,
    );

    await this.clienteRepo.salvar(novoCliente);

    return novoCliente;
  }
}
