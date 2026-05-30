import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeletarClienteUseCase } from './deletar-cliente.use-case';
import { ClienteRepository } from '../../ports/cliente.repository';
import { Cliente } from '../../domain/cliente/cliente.entity';

describe('DeletarClienteUseCase', () => {
  let useCase: DeletarClienteUseCase;
  let clienteRepo: jest.Mocked<ClienteRepository>;

  const clienteExistente = new Cliente(
    'uuid-cliente-1',
    'João da Silva',
    new Date('2025-01-01'),
    '(11) 99999-9999',
    'joao@email.com',
  );

  beforeEach(async () => {
    const clienteRepoMock: jest.Mocked<ClienteRepository> = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      listarTodos: jest.fn(),
      atualizar: jest.fn(),
      deletar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletarClienteUseCase,
        {
          provide: ClienteRepository,
          useValue: clienteRepoMock,
        },
      ],
    }).compile();

    useCase = module.get<DeletarClienteUseCase>(DeletarClienteUseCase);
    clienteRepo = module.get(ClienteRepository);
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('cenário de sucesso', () => {
    it('deve deletar o cliente quando ele existe', async () => {
      clienteRepo.buscarPorId.mockResolvedValue(clienteExistente);
      clienteRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar('uuid-cliente-1');

      expect(clienteRepo.deletar).toHaveBeenCalledWith('uuid-cliente-1');
      expect(clienteRepo.deletar).toHaveBeenCalledTimes(1);
    });

    it('deve consultar buscarPorId antes de chamar deletar (ordem)', async () => {
      const ordemDeChamadas: string[] = [];
      clienteRepo.buscarPorId.mockImplementation(async () => {
        ordemDeChamadas.push('buscarPorId');
        return clienteExistente;
      });
      clienteRepo.deletar.mockImplementation(async () => {
        ordemDeChamadas.push('deletar');
      });

      await useCase.executar('uuid-cliente-1');

      expect(ordemDeChamadas).toEqual(['buscarPorId', 'deletar']);
    });

    it('deve repassar o id correto para o repositório', async () => {
      clienteRepo.buscarPorId.mockResolvedValue(clienteExistente);
      clienteRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar('abc-123');

      expect(clienteRepo.buscarPorId).toHaveBeenCalledWith('abc-123');
      expect(clienteRepo.deletar).toHaveBeenCalledWith('abc-123');
    });

    it('deve chamar buscarPorId e deletar exatamente uma vez cada', async () => {
      clienteRepo.buscarPorId.mockResolvedValue(clienteExistente);
      clienteRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar('uuid-cliente-1');

      expect(clienteRepo.buscarPorId).toHaveBeenCalledTimes(1);
      expect(clienteRepo.deletar).toHaveBeenCalledTimes(1);
    });

    it('deve retornar undefined em caso de sucesso', async () => {
      clienteRepo.buscarPorId.mockResolvedValue(clienteExistente);
      clienteRepo.deletar.mockResolvedValue(undefined);

      const resultado = await useCase.executar('uuid-cliente-1');

      expect(resultado).toBeUndefined();
    });

    it('não deve chamar outros métodos do repositório', async () => {
      clienteRepo.buscarPorId.mockResolvedValue(clienteExistente);
      clienteRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar('uuid-cliente-1');

      expect(clienteRepo.salvar).not.toHaveBeenCalled();
      expect(clienteRepo.listarTodos).not.toHaveBeenCalled();
      expect(clienteRepo.atualizar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro - cliente inexistente', () => {
    it('deve lançar NotFoundException quando o cliente não for encontrado', async () => {
      clienteRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar('inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar exceção com a mensagem "Cliente não encontrado"', async () => {
      clienteRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar('inexistente')).rejects.toThrow(
        'Cliente não encontrado',
      );
    });

    it('NÃO deve chamar deletar quando o cliente não existir', async () => {
      clienteRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar('inexistente')).rejects.toThrow(
        NotFoundException,
      );

      expect(clienteRepo.deletar).not.toHaveBeenCalled();
    });

    it('deve consultar buscarPorId mesmo quando o cliente não existir', async () => {
      clienteRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar('inexistente')).rejects.toThrow(
        NotFoundException,
      );

      expect(clienteRepo.buscarPorId).toHaveBeenCalledWith('inexistente');
      expect(clienteRepo.buscarPorId).toHaveBeenCalledTimes(1);
    });
  });

  describe('cenário de erro - falha no repositório', () => {
    it('deve propagar erro lançado por buscarPorId', async () => {
      const erroSimulado = new Error('Falha ao ler arquivo');
      clienteRepo.buscarPorId.mockRejectedValue(erroSimulado);

      await expect(useCase.executar('uuid-cliente-1')).rejects.toThrow(
        'Falha ao ler arquivo',
      );
      expect(clienteRepo.deletar).not.toHaveBeenCalled();
    });

    it('deve propagar erro lançado por deletar', async () => {
      clienteRepo.buscarPorId.mockResolvedValue(clienteExistente);
      const erroSimulado = new Error('Falha ao gravar arquivo');
      clienteRepo.deletar.mockRejectedValue(erroSimulado);

      await expect(useCase.executar('uuid-cliente-1')).rejects.toThrow(
        'Falha ao gravar arquivo',
      );
      expect(clienteRepo.buscarPorId).toHaveBeenCalledTimes(1);
      expect(clienteRepo.deletar).toHaveBeenCalledTimes(1);
    });
  });

  describe('múltiplas execuções', () => {
    it('cada execução deve disparar nova consulta e nova exclusão', async () => {
      clienteRepo.buscarPorId.mockResolvedValue(clienteExistente);
      clienteRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar('a');
      await useCase.executar('b');

      expect(clienteRepo.buscarPorId).toHaveBeenCalledTimes(2);
      expect(clienteRepo.deletar).toHaveBeenCalledTimes(2);
      expect(clienteRepo.buscarPorId).toHaveBeenNthCalledWith(1, 'a');
      expect(clienteRepo.buscarPorId).toHaveBeenNthCalledWith(2, 'b');
    });
  });
});
