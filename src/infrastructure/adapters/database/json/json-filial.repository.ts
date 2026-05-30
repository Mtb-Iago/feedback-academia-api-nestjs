import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FilialRepository } from '../../../../core/ports/filial.repository';
import { Filial } from '../../../../core/domain/filial.entity';

@Injectable()
export class JsonFilialRepository implements FilialRepository {
  private readonly filePath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'data',
    'filiais.json',
  );

  private async lerArquivo(): Promise<Filial[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async escreverArquivo(dados: Filial[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(dados, null, 2), 'utf-8');
  }

  private proximoId(filiais: Filial[]): number {
    if (filiais.length === 0) return 1;
    const maiorId = filiais.reduce(
      (max, f) => (f.id_filial > max ? f.id_filial : max),
      0,
    );
    return maiorId + 1;
  }

  async salvar(filial: Filial): Promise<Filial> {
    const filiais = await this.lerArquivo();
    const filialComId = new Filial(
      this.proximoId(filiais),
      filial.nome,
      filial.endereco,
      filial.telefone,
      filial.email,
    );
    filiais.push(filialComId);
    await this.escreverArquivo(filiais);
    return filialComId;
  }

  async buscarPorId(id: number): Promise<Filial | null> {
    const filiais = await this.lerArquivo();
    return filiais.find((f) => f.id_filial === id) || null;
  }

  async listarTodos(): Promise<Filial[]> {
    return await this.lerArquivo();
  }

  async atualizar(id: number, dados: Partial<Filial>): Promise<Filial> {
    const filiais = await this.lerArquivo();
    const index = filiais.findIndex((f) => f.id_filial === id);

    if (index === -1) throw new Error('Filial não encontrada');

    // Garante que o id_filial não seja sobrescrito
    const { id_filial: _ignorado, ...dadosSemId } = dados;
    filiais[index] = { ...filiais[index], ...dadosSemId };
    await this.escreverArquivo(filiais);
    return filiais[index];
  }

  async deletar(id: number): Promise<void> {
    const filiais = await this.lerArquivo();
    const filtrados = filiais.filter((f) => f.id_filial !== id);
    await this.escreverArquivo(filtrados);
  }

  async buscarPorFiltros(nome?: string): Promise<Filial | null> {
    const filiais = await this.lerArquivo();

    // Se nenhum filtro for passado, você pode decidir retornar null ou lançar um erro
    if (!nome) return null;

    // Busca insensível a maiúsculas/minúsculas que verifica se o nome contém o termo buscado
    const filialEncontrada = filiais.find((f) =>
      f.nome.toLowerCase().includes(nome.toLowerCase()),
    );

    return filialEncontrada || null;
  }
}
