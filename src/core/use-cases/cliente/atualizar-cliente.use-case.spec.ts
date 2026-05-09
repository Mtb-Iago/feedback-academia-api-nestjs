import { NotFoundException } from '@nestjs/common';
import { AtualizarClienteUseCase } from './atualizar-cliente.use-case';
import { Cliente } from 'src/core/domain/cliente/cliente.entity';

describe('AtualizarClienteUseCase', () => {
  let useCase: AtualizarClienteUseCase;

  const clienteRepo = {
    buscarPorId: jest.fn(),
    atualizar: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new AtualizarClienteUseCase(clienteRepo as any);
  });

  it('deve atualizar um cliente com sucesso', async () => {
    const clienteExistente = {
      id: '1',
      nome: 'João',
      telefone: '999999999',
      email: 'joao@email.com',
    } as Cliente;

    const dadosAtualizacao = {
      nome: 'João Atualizado',
    };

    const clienteAtualizado = {
      ...clienteExistente,
      ...dadosAtualizacao,
    };

    clienteRepo.buscarPorId.mockResolvedValue(clienteExistente);
    clienteRepo.atualizar.mockResolvedValue(clienteAtualizado);

    const resultado = await useCase.executar('1', dadosAtualizacao);

    expect(clienteRepo.buscarPorId).toHaveBeenCalledWith('1');
    expect(clienteRepo.atualizar).toHaveBeenCalledWith('1', dadosAtualizacao);
    expect(resultado).toEqual(clienteAtualizado);
  });

  it('deve lançar NotFoundException quando o cliente não existir', async () => {
    clienteRepo.buscarPorId.mockResolvedValue(null);

    await expect(useCase.executar('1', { nome: 'Novo Nome' })).rejects.toThrow(
      NotFoundException,
    );

    expect(clienteRepo.buscarPorId).toHaveBeenCalledWith('1');
    expect(clienteRepo.atualizar).not.toHaveBeenCalled();
  });
});
