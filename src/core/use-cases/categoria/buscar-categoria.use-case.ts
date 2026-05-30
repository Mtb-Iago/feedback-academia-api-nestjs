import { Injectable } from '@nestjs/common';
import { CategoriaRepository } from '../../ports/categoria.repository';
import { Categoria } from '../../domain/categoria.entity';

@Injectable()
export class BuscarCategoriaUseCase {
  constructor(private readonly categoriaRepo: CategoriaRepository) {}

  async executar(filtros: {
    nome?: string;
  }): Promise<Categoria | null> {
    return await this.categoriaRepo.buscarPorFiltros(filtros.nome);
  }
}