import { Injectable } from '@nestjs/common';
import { FilialRepository } from '../../ports/filial.repository';

@Injectable()
export class ListarFiliaisUseCase {
  constructor(private readonly filialRepo: FilialRepository) {}
  async executar() {
    return this.filialRepo.listarTodos();
  }
}
