import { Injectable } from '@nestjs/common';
import { CategoriaRepository } from '../../ports/categoria.repository';
import { Categoria } from '../../domain/categoria.entity';

@Injectable()
export class ListarCategoriasUseCase {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  async executar(): Promise<Categoria[]> {
    return await this.categoriaRepository.listarTodos();
  }
}