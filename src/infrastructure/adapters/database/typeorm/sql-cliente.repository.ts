import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ClienteRepository } from '../../../../core/ports/cliente.repository';
import { Cliente } from '../../../../core/domain/cliente/cliente.entity';
import { ClienteOrmEntity } from './entities/cliente.orm-entity';

@Injectable()
export class SqlClienteRepository implements ClienteRepository {
  constructor(
    @InjectRepository(ClienteOrmEntity)
    private readonly repo: Repository<ClienteOrmEntity>,
  ) {}

  private toDomain(ormEntity: ClienteOrmEntity): Cliente {
    return new Cliente(
      ormEntity.id,
      ormEntity.nome,
      ormEntity.data_cadastro,
      ormEntity.telefone,
      ormEntity.email,
    );
  }

  async salvar(cliente: Cliente): Promise<void> {
    const entity = this.repo.create(cliente);
    await this.repo.save(entity);
  }

  async buscarPorId(id: string): Promise<Cliente | null> {
    
    const ormEntity = await this.repo.findOne({ where: { id } });
    if (!ormEntity) return null;
    return this.toDomain(ormEntity);
  }

  async listarTodos(): Promise<Cliente[]> {
    const ormEntities = await this.repo.find();
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  async atualizar(id: string, dados: Partial<Cliente>): Promise<Cliente> {
    const clienteExistente = await this.repo.findOne({ where: { id } });
    if (!clienteExistente) throw new Error('Cliente não encontrado');

    const clienteAtualizado = this.repo.merge(clienteExistente, dados);
    await this.repo.save(clienteAtualizado);

    return this.toDomain(clienteAtualizado);
  }

  async deletar(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async buscarPorFiltros(filtros: {
    nome?: string;
    email?: string;
    telefone?: string;
  }): Promise<Cliente[]> {
    const conditions: FindOptionsWhere<ClienteOrmEntity> = {};

    if (filtros.nome) conditions.nome = ILike(`%${filtros.nome}%`);
    if (filtros.email) conditions.email = filtros.email;
    if (filtros.telefone) conditions.telefone = filtros.telefone;

    const ormEntities = await this.repo.find({ where: conditions });
    return ormEntities.map((entity) => this.toDomain(entity));
  }
}
