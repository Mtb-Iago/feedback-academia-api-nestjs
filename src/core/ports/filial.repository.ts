import { Filial } from '../domain/filial.entity';

export abstract class FilialRepository {
  abstract salvar(filial: Filial): Promise<Filial>;
  abstract buscarPorId(id: number): Promise<Filial | null>;
  abstract listarTodos(): Promise<Filial[]>;
  abstract atualizar(id: number, dados: Partial<Filial>): Promise<Filial>;
  abstract deletar(id: number): Promise<void>;
}
