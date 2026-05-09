import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriaRepository } from '../../ports/categoria.repository';
import { Categoria } from '../../domain/categoria.entity';

@Injectable()
export class AtualizarCategoriaUseCase {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  async executar(id: number, dados: Partial<Categoria>): Promise<Categoria> {
    const categoriaExistente = await this.categoriaRepository.buscarPorId(id);
    
    if (!categoriaExistente) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada.`);
    }

    return await this.categoriaRepository.atualizar(id, dados);
  }
}