import { Injectable, NotFoundException } from '@nestjs/common';
import { FilialRepository } from '../../ports/filial.repository';
import { Filial } from '../../domain/filial.entity';

@Injectable()
export class AtualizarFilialUseCase {
  constructor(private readonly filialRepo: FilialRepository) {}

  async executar(id: number, dados: Partial<Filial>): Promise<Filial> {
    // 1. Verifica se a filial existe
    const existe = await this.filialRepo.buscarPorId(id);

    if (!existe) {
      throw new NotFoundException(`Filial com ID ${id} não encontrada`);
    }

    // 2. Executa a atualização através da porta
    const filialAtualizada = await this.filialRepo.atualizar(id, dados);

    return filialAtualizada;
  }
}
