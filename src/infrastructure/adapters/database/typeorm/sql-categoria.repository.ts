import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CategoriaRepository } from '../../../../core/ports/categoria.repository';
import { Categoria } from '../../../../core/domain/categoria.entity';
import { CategoriaOrmEntity } from './entities/categoria.orm-entity';

@Injectable()
export class SqlCategoriaRepository implements CategoriaRepository {
  constructor(
    @InjectRepository(CategoriaOrmEntity)
    private readonly repo: Repository<CategoriaOrmEntity>,
  ) {}

  // Função auxiliar para converter do BD para o Domínio
  private toDomain(ormEntity: CategoriaOrmEntity): Categoria {
    return new Categoria(
      ormEntity.id_categoria,
      ormEntity.nome,
      ormEntity.descricao,
      ormEntity.ordem_exibicao,
    );
  }

  async salvar(categoria: Categoria): Promise<void> {
    const entity = this.repo.create(categoria);
    await this.repo.save(entity);
  }

  async buscarPorId(id: number): Promise<Categoria | null> {
    const ormEntity = await this.repo.findOne({ where: { id_categoria: id } });
    if (!ormEntity) return null;
    return this.toDomain(ormEntity);
  }

  async listarTodos(): Promise<Categoria[] | []> {
    const ormEntities = await this.repo.find();
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  async atualizar(id: number, dados: Partial<Categoria>): Promise<Categoria> {
    const categoriaExistente = await this.repo.findOne({
      where: { id_categoria: id },
    });
    if (!categoriaExistente) throw new Error('Categoria não encontrada');

    const categoriaAtualizada = this.repo.merge(categoriaExistente, dados);
    await this.repo.save(categoriaAtualizada);

    return this.toDomain(categoriaAtualizada);
  }

  async deletar(id: number): Promise<void> {
    await this.repo.delete({ id_categoria: id });
  }

  async buscarPorFiltros(nome?: string): Promise<Categoria | null> {
    const conditions: FindOptionsWhere<CategoriaOrmEntity> = {};
    
    if (nome) {
      conditions.nome = nome;
    }
    
    const ormEntity = await this.repo.findOne({ where: conditions });
    
    // Se não encontrar nada no banco, retorna null (resolvendo o erro do TS)
    if (!ormEntity) {
      return null;
    }
    
    return this.toDomain(ormEntity);
  }
}