import { Injectable } from '@nestjs/common';
import { Filial } from 'src/core/domain/filial.entity';
import { FilialRepository } from 'src/core/ports/filial.repository';

// Definição da interface de filtros para tipagem limpa
export interface BuscarFilialFiltros {
  nome?: string;
  // Você pode adicionar outros filtros aqui no futuro (ex: cidade, status)
}

@Injectable()
export class BuscarFilialUseCase {
  constructor(private readonly filialRepo: FilialRepository) {}

  async executar(filtros: BuscarFilialFiltros): Promise<Filial | null> {
    // Caso nenhum filtro seja enviado, garante que um objeto vazio seja tratado

    return await this.filialRepo.buscarPorFiltros(filtros.nome);
  }
}
