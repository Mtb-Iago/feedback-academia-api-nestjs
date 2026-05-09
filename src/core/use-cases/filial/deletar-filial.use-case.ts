import { Injectable, NotFoundException } from '@nestjs/common';
import { FilialRepository } from '../../ports/filial.repository';

@Injectable()
export class DeletarFilialUseCase {
  constructor(private readonly filialRepo: FilialRepository) {}
  async executar(id: number) {
    const existe = await this.filialRepo.buscarPorId(id);
    if (!existe) throw new NotFoundException('Filial não encontrada');
    await this.filialRepo.deletar(id);
  }
}
