import { Injectable } from '@nestjs/common';
import { CategoriaRepository } from '../../ports/categoria.repository';
import { Categoria } from '../../domain/categoria.entity';

interface CriarCategoriaInput {
  nome: string;
  descricao: string;
  ordem_exibicao: number;
}

@Injectable()
export class CriarCategoriaUseCase {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  async executar(dados: CriarCategoriaInput): Promise<Categoria> {
    // Como estamos usando JSON/Array, simulamos um Auto-Increment para o ID numérico
    const categoriasExistentes = await this.categoriaRepository.listarTodos();
    const proximoId = categoriasExistentes.length > 0 
      ? Math.max(...categoriasExistentes.map(c => c.id_categoria)) + 1 
      : 1;

    const novaCategoria = new Categoria(
      proximoId,
      dados.nome,
      dados.descricao,
      dados.ordem_exibicao,
    );

    await this.categoriaRepository.salvar(novaCategoria);
    return novaCategoria;
  }
}