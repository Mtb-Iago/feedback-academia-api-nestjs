import { Injectable } from '@nestjs/common';
import { FilialRepository } from '../../ports/filial.repository';
import { Filial } from '../../domain/filial.entity';

@Injectable()
export class CriarFilialUseCase {
  constructor(private readonly filialRepo: FilialRepository) {}

  async executar(dados: {
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
  }): Promise<Filial> {
    // O id_filial é gerado pelo repositório (autoincrement com base no maior id existente)
    const novaFilial = new Filial(
      0, // placeholder — será definido pelo repositório
      dados.nome,
      dados.endereco,
      dados.telefone,
      dados.email,
    );

    return await this.filialRepo.salvar(novaFilial);
  }
}
