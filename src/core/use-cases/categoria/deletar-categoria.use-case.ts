import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriaRepository } from '../../ports/categoria.repository';

@Injectable()
export class DeletarCategoriaUseCase {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  async executar(id: number): Promise<void> {
    const categoriaExistente = await this.categoriaRepository.buscarPorId(id);
    
    if (!categoriaExistente) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada.`);
    }

    await this.categoriaRepository.deletar(id);
  }
}