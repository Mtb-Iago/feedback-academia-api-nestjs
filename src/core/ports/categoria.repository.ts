import { Categoria } from '../domain/categoria.entity';

export abstract class CategoriaRepository {
  abstract salvar(categoria: Categoria): Promise<void>;
  abstract buscarPorId(id: number): Promise<Categoria | null>;
  abstract listarTodos(): Promise<Categoria[]>;
  abstract atualizar(id: number, dados: Partial<Categoria>): Promise<Categoria>;
  abstract deletar(id: number): Promise<void>;
}
