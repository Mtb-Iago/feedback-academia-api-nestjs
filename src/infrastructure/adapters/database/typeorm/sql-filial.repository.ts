import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { FilialRepository } from '../../../../core/ports/filial.repository';
import { Filial } from '../../../../core/domain/filial.entity';
import { FilialOrmEntity } from './entities/filial.orm-entity';

@Injectable()
export class SqlFilialRepository implements FilialRepository {
  constructor(
    @InjectRepository(FilialOrmEntity)
    private readonly repo: Repository<FilialOrmEntity>,
  ) {}

  private toDomain(ormEntity: FilialOrmEntity): Filial {
    return new Filial(
      ormEntity.id_filial,
      ormEntity.nome,
      ormEntity.endereco,
      ormEntity.telefone,
      ormEntity.email,
    );
  }

  async salvar(filial: Filial): Promise<Filial> {
    const entity = this.repo.create(filial);
    const savedEntity = await this.repo.save(entity);
    return this.toDomain(savedEntity);
  }

  async buscarPorId(id: number): Promise<Filial | null> {
    const ormEntity = await this.repo.findOne({ where: { id_filial: id } });
    if (!ormEntity) return null;
    return this.toDomain(ormEntity);
  }

  async listarTodos(): Promise<Filial[]> {
    const ormEntities = await this.repo.find();
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  async atualizar(id: number, dados: Partial<Filial>): Promise<Filial> {
    const filialExistente = await this.repo.findOne({
      where: { id_filial: id },
    });
    if (!filialExistente) throw new Error('Filial não encontrada');

    const filialAtualizada = this.repo.merge(filialExistente, dados);
    await this.repo.save(filialAtualizada);

    return this.toDomain(filialAtualizada);
  }

  async deletar(id: number): Promise<void> {
    await this.repo.delete({ id_filial: id });
  }

  async buscarPorFiltros(nome: string): Promise<Filial> {
    const ormEntity = await this.repo.findOne({
      where: { nome: Like(`%${nome}%`) },
    });

    if (!ormEntity)
      throw new Error(`Filial com o nome "${nome}" não encontrada`);
    return this.toDomain(ormEntity);
  }
}
