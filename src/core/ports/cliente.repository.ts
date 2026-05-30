import { Cliente } from '../domain/cliente/cliente.entity';

export abstract class ClienteRepository {
  abstract salvar(feedback: Cliente): Promise<void>;
  abstract buscarPorId(id: string): Promise<Cliente | null>;
  abstract listarTodos(): Promise<Cliente[]>;
  abstract atualizar(id: string, dados: Partial<Cliente>): Promise<Cliente>;
  abstract deletar(id: string): Promise<void>;
}
