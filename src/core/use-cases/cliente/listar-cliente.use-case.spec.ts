import { Test, TestingModule } from '@nestjs/testing';
import { ListarClientesUseCase } from './listar-cliente.use-case';
import { ClienteRepository } from '../../ports/cliente.repository';
import { Cliente } from '../../domain/cliente/cliente.entity';

describe('ListarClientesUseCase', () => {
  let useCase: ListarClientesUseCase;
  let clienteRepo: jest.Mocked<ClienteRepository>;

  const clientesMock: Cliente[] = [
    new Cliente(
      'uuid-1',
      'João da Silva',
      new Date('2025-01-01'),
      '(11) 99999-9999',
      'joao@email.com',
    ),
    new Cliente(
      'uuid-2',
      'Maria Souza',
      new Date('2025-02-15'),
      '(11) 88888-8888',
      'maria@email.com',
    ),
  ];

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
        ListarClientesUseCase,
        {
          provide: ClienteRepository,
          useValue: clienteRepoMock,
        },
      ],
    }).compile();

    useCase = module.get<ListarClientesUseCase>(ListarClientesUseCase);
    clienteRepo = module.get(ClienteRepository);
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('cenário de sucesso', () => {
    it('deve retornar a lista de clientes vinda do repositório', async () => {
      clienteRepo.listarTodos.mockResolvedValue(clientesMock);

      const resultado = await useCase.executar();

      expect(resultado).toBe(clientesMock);
      expect(resultado).toHaveLength(2);
      expect(resultado[0].id).toBe('uuid-1');
      expect(resultado[1].id).toBe('uuid-2');
    });

    it('deve retornar array vazio quando o repositório não tiver clientes', async () => {
      clienteRepo.listarTodos.mockResolvedValue([]);

      const resultado = await useCase.executar();

      expect(resultado).toEqual([]);
      expect(resultado).toHaveLength(0);
    });

    it('deve chamar listarTodos do repositório exatamente uma vez', async () => {
      clienteRepo.listarTodos.mockResolvedValue(clientesMock);

      await useCase.executar();

      expect(clienteRepo.listarTodos).toHaveBeenCalledTimes(1);
      expect(clienteRepo.listarTodos).toHaveBeenCalledWith();
    });

    it('não deve chamar nenhum outro método do repositório', async () => {
      clienteRepo.listarTodos.mockResolvedValue(clientesMock);

      await useCase.executar();

      expect(clienteRepo.salvar).not.toHaveBeenCalled();
      expect(clienteRepo.buscarPorId).not.toHaveBeenCalled();
      expect(clienteRepo.atualizar).not.toHaveBeenCalled();
      expect(clienteRepo.deletar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro', () => {
    it('deve propagar erros lançados pelo repositório', async () => {
      const erroSimulado = new Error('Falha ao ler arquivo');
      clienteRepo.listarTodos.mockRejectedValue(erroSimulado);

      await expect(useCase.executar()).rejects.toThrow('Falha ao ler arquivo');
      expect(clienteRepo.listarTodos).toHaveBeenCalledTimes(1);
    });
  });

  describe('múltiplas execuções', () => {
    it('cada execução deve disparar uma nova consulta ao repositório', async () => {
      clienteRepo.listarTodos.mockResolvedValue(clientesMock);

      await useCase.executar();
      await useCase.executar();
      await useCase.executar();

      expect(clienteRepo.listarTodos).toHaveBeenCalledTimes(3);
    });
  });
});
