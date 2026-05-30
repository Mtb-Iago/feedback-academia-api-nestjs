import { Test, TestingModule } from '@nestjs/testing';
import { CriarClienteUseCase } from './create-cliente.use-case';
import { ClienteRepository } from '../../ports/cliente.repository';
import { Cliente } from '../../domain/cliente/cliente.entity';

describe('CriarClienteUseCase', () => {
  let useCase: CriarClienteUseCase;
  let clienteRepo: jest.Mocked<ClienteRepository>;

  const dadosValidos = {
    nome: 'João da Silva',
    telefone: '(11) 99999-9999',
    email: 'joao@email.com',
  };

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
        CriarClienteUseCase,
        {
          provide: ClienteRepository,
          useValue: clienteRepoMock,
        },
      ],
    }).compile();

    useCase = module.get<CriarClienteUseCase>(CriarClienteUseCase);
    clienteRepo = module.get(ClienteRepository);
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('cenário de sucesso', () => {
    it('deve criar um cliente e retornar a entidade montada', async () => {
      clienteRepo.salvar.mockResolvedValue(undefined);

      const resultado = await useCase.executar(dadosValidos);

      expect(resultado).toBeInstanceOf(Cliente);
      expect(resultado.nome).toBe(dadosValidos.nome);
      expect(resultado.telefone).toBe(dadosValidos.telefone);
      expect(resultado.email).toBe(dadosValidos.email);
    });

    it('deve repassar ao repositório uma instância de Cliente', async () => {
      clienteRepo.salvar.mockResolvedValue(undefined);

      await useCase.executar(dadosValidos);

      const argumentoRecebido = clienteRepo.salvar.mock.calls[0][0];
      expect(argumentoRecebido).toBeInstanceOf(Cliente);
    });

    it('deve gerar um id UUID (string não vazia) para o cliente', async () => {
      clienteRepo.salvar.mockResolvedValue(undefined);

      const resultado = await useCase.executar(dadosValidos);

      expect(typeof resultado.id).toBe('string');
      expect(resultado.id.length).toBeGreaterThan(0);
      // formato UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      expect(resultado.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('deve gerar ids distintos para chamadas diferentes', async () => {
      clienteRepo.salvar.mockResolvedValue(undefined);

      const a = await useCase.executar(dadosValidos);
      const b = await useCase.executar(dadosValidos);

      expect(a.id).not.toBe(b.id);
    });

    it('deve definir data_cadastro como a data atual', async () => {
      clienteRepo.salvar.mockResolvedValue(undefined);
      const antes = Date.now();

      const resultado = await useCase.executar(dadosValidos);

      const depois = Date.now();
      expect(resultado.data_cadastro).toBeInstanceOf(Date);
      const ts = resultado.data_cadastro.getTime();
      expect(ts).toBeGreaterThanOrEqual(antes);
      expect(ts).toBeLessThanOrEqual(depois);
    });

    it('deve chamar salvar do repositório exatamente uma vez', async () => {
      clienteRepo.salvar.mockResolvedValue(undefined);

      await useCase.executar(dadosValidos);

      expect(clienteRepo.salvar).toHaveBeenCalledTimes(1);
    });

    it('deve preservar todos os campos do DTO ao montar a entidade', async () => {
      clienteRepo.salvar.mockResolvedValue(undefined);

      await useCase.executar(dadosValidos);

      const argumentoRecebido = clienteRepo.salvar.mock.calls[0][0];
      expect(argumentoRecebido).toEqual(
        expect.objectContaining({
          nome: dadosValidos.nome,
          telefone: dadosValidos.telefone,
          email: dadosValidos.email,
        }),
      );
    });

    it('não deve mutar o objeto de entrada (dados)', async () => {
      clienteRepo.salvar.mockResolvedValue(undefined);
      const copiaOriginal = { ...dadosValidos };

      await useCase.executar(dadosValidos);

      expect(dadosValidos).toEqual(copiaOriginal);
    });

    it('não deve chamar outros métodos do repositório', async () => {
      clienteRepo.salvar.mockResolvedValue(undefined);

      await useCase.executar(dadosValidos);

      expect(clienteRepo.buscarPorId).not.toHaveBeenCalled();
      expect(clienteRepo.listarTodos).not.toHaveBeenCalled();
      expect(clienteRepo.atualizar).not.toHaveBeenCalled();
      expect(clienteRepo.deletar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro', () => {
    it('deve propagar erros lançados pelo repositório ao salvar', async () => {
      const erroSimulado = new Error('Falha ao gravar arquivo');
      clienteRepo.salvar.mockRejectedValue(erroSimulado);

      await expect(useCase.executar(dadosValidos)).rejects.toThrow(
        'Falha ao gravar arquivo',
      );
      expect(clienteRepo.salvar).toHaveBeenCalledTimes(1);
    });
  });

  describe('múltiplas execuções', () => {
    it('cada execução deve gerar uma nova chamada ao repositório', async () => {
      clienteRepo.salvar.mockResolvedValue(undefined);

      await useCase.executar(dadosValidos);
      await useCase.executar({
        nome: 'Maria',
        telefone: '(11) 88888-8888',
        email: 'maria@email.com',
      });

      expect(clienteRepo.salvar).toHaveBeenCalledTimes(2);
    });
  });
});
