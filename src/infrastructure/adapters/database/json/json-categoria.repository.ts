import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CategoriaRepository } from '../../../../core/ports/categoria.repository';
import { Categoria } from '../../../../core/domain/categoria.entity';

@Injectable()
export class JsonCategoriaRepository implements CategoriaRepository {
  private readonly filePath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'data',
    'categorias.json',
  );

  private async lerArquivo(): Promise<Categoria[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async escreverArquivo(dados: Categoria[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(dados, null, 2), 'utf-8');
  }

  async salvar(categoria: Categoria): Promise<void> {
    const categorias = await this.lerArquivo();
    categorias.push(categoria);
    await this.escreverArquivo(categorias);
  }

  async buscarPorId(id: number): Promise<Categoria | null> {
    const categorias = await this.lerArquivo();
    return categorias.find((c) => c.id_categoria === id) || null;
  }

  async listarTodos(): Promise<Categoria[]> {
    return await this.lerArquivo();
  }

  async atualizar(id: number, dados: Partial<Categoria>): Promise<Categoria> {
    const categorias = await this.lerArquivo();
    const index = categorias.findIndex((c) => c.id_categoria === id);

    if (index === -1) throw new Error('Categoria não encontrada');
    categorias[index] = { ...categorias[index], ...dados };
    await this.escreverArquivo(categorias);

    return categorias[index];
  }

  async deletar(id: number): Promise<void> {
    const categorias = await this.lerArquivo();
    const filtrados = categorias.filter((c) => c.id_categoria !== id);
    await this.escreverArquivo(filtrados);
  }

// ... (restante do código anterior permanece igual)

  async buscarPorFiltros(nome?: string): Promise<Categoria> {
    const categorias = await this.lerArquivo();

    if (!nome) {
      throw new Error('O parâmetro "nome" é obrigatório para realizar a busca.');
    }

    // Busca pela categoria (ignorando maiúsculas/minúsculas)
    const categoria = categorias.find(
      (c) => c.nome.toLowerCase() === nome.toLowerCase()
    );

    if (!categoria) {
      throw new Error(`Categoria com o nome "${nome}" não encontrada.`);
    }

    return categoria;
  }
}
