import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Cliente } from 'src/core/domain/cliente/cliente.entity';
import { ClienteRepository } from 'src/core/ports/cliente.repository';

@Injectable()
export class JsonClienteRepository implements ClienteRepository {
  private readonly filePath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'data',
    'clientes.json',
  );

  private async lerArquivo(): Promise<Cliente[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async escreverArquivo(dados: Cliente[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(dados, null, 2), 'utf-8');
  }

  async salvar(cliente: Cliente): Promise<void> {
    const clientes = await this.lerArquivo();
    clientes.push(cliente);
    await this.escreverArquivo(clientes);
  }

  async buscarPorId(id: string): Promise<Cliente | null> {
    const clientes = await this.lerArquivo();
    return clientes.find((cliente) => cliente.id === id) || null;
  }

  async listarTodos(): Promise<Cliente[]> {
    return await this.lerArquivo();
  }

  async atualizar(id: string, dados: Partial<Cliente>): Promise<Cliente> {
    const clientes = await this.lerArquivo();
    const index = clientes.findIndex((cliente) => cliente.id === id);

    if (index === -1) throw new Error('Cliente não encontrado');

    clientes[index] = { ...clientes[index], ...dados };
    await this.escreverArquivo(clientes);
    return clientes[index];
  }

  async deletar(id: string): Promise<void> {
    const clientes = await this.lerArquivo();
    const filtrados = clientes.filter((cliente) => cliente.id !== id);
    await this.escreverArquivo(filtrados);
  }
}
