import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CriarFeedbackUseCase } from './create-feedback.use-case';
import { FeedbackRepository } from '../../ports/feedback.repository';
import { ClienteRepository } from '../../ports/cliente.repository';
import { FilialRepository } from '../../ports/filial.repository';
import { Feedback } from '../../domain/feedback/feedback.entity';
import { RespostaObjetiva } from '../../domain/feedback/resposta-objetiva.entity';
import { Cliente } from '../../domain/cliente/cliente.entity';
import { Filial } from '../../domain/filial.entity';

describe('CriarFeedbackUseCase', () => {
  let useCase: CriarFeedbackUseCase;
  let feedbackRepo: jest.Mocked<FeedbackRepository>;
  let clienteRepo: jest.Mocked<ClienteRepository>;
  let filialRepo: jest.Mocked<FilialRepository>;

  const clienteMock = new Cliente(
    'uuid-cliente-1',
    'João da Silva',
    new Date('2025-01-01'),
    '(11) 99999-9999',
    'joao@email.com',
  );

  const filialMock = new Filial(
    1,
    'Academia Centro',
    'Rua das Flores, 123',
    '(11) 99999-9999',
    'centro@academia.com',
  );

  const respostasMock: RespostaObjetiva[] = [
    new RespostaObjetiva('uuid-resposta-1', 'uuid-pergunta-1', 5),
  ];

  const dadosValidos = {
    clienteId: 'uuid-cliente-1',
    filialId: '1',
    respostas: respostasMock,
  };

  beforeEach(async () => {
    const feedbackRepoMock: jest.Mocked<FeedbackRepository> = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      listarTodos: jest.fn(),
      atualizar: jest.fn(),
      deletar: jest.fn(),
    };
    const clienteRepoMock: jest.Mocked<ClienteRepository> = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      listarTodos: jest.fn(),
      atualizar: jest.fn(),
      deletar: jest.fn(),
    };
    const filialRepoMock: jest.Mocked<FilialRepository> = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      listarTodos: jest.fn(),
      atualizar: jest.fn(),
      deletar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CriarFeedbackUseCase,
        { provide: FeedbackRepository, useValue: feedbackRepoMock },
        { provide: ClienteRepository, useValue: clienteRepoMock },
        { provide: FilialRepository, useValue: filialRepoMock },
      ],
    }).compile();

    useCase = module.get<CriarFeedbackUseCase>(CriarFeedbackUseCase);
    feedbackRepo = module.get(
      FeedbackRepository,
    ) as jest.Mocked<FeedbackRepository>;
    clienteRepo = module.get(
      ClienteRepository,
    ) as jest.Mocked<ClienteRepository>;
    filialRepo = module.get(FilialRepository) as jest.Mocked<FilialRepository>;
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('cenário de sucesso', () => {
    beforeEach(() => {
      clienteRepo.buscarPorId.mockResolvedValue(clienteMock);
      filialRepo.buscarPorId.mockResolvedValue(filialMock);
      feedbackRepo.salvar.mockResolvedValue(undefined);
    });

    it('deve criar e retornar um Feedback com UUID, status ABERTO e data atual', async () => {
      const antes = Date.now();

      const resultado = await useCase.executar(dadosValidos);

      const depois = Date.now();
      expect(resultado).toBeInstanceOf(Feedback);
      expect(resultado.id_feedback).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
      expect(resultado.status_feedback).toBe('ABERTO');
      expect(resultado.data_criacao).toBeInstanceOf(Date);
      const ts = resultado.data_criacao.getTime();
      expect(ts).toBeGreaterThanOrEqual(antes);
      expect(ts).toBeLessThanOrEqual(depois);
    });

    it('deve preservar clienteId, filialId e respostas no feedback gerado', async () => {
      const resultado = await useCase.executar(dadosValidos);

      expect(resultado.clienteId).toBe(dadosValidos.clienteId);
      expect(resultado.filialId).toBe(dadosValidos.filialId);
      expect(resultado.respostas).toBe(respostasMock);
    });

    it('deve repassar uma instância de Feedback para feedbackRepo.salvar', async () => {
      await useCase.executar(dadosValidos);

      const argumento = feedbackRepo.salvar.mock.calls[0][0];
      expect(argumento).toBeInstanceOf(Feedback);
      expect(argumento.status_feedback).toBe('ABERTO');
    });

    it('deve chamar feedbackRepo.salvar exatamente uma vez', async () => {
      await useCase.executar(dadosValidos);

      expect(feedbackRepo.salvar).toHaveBeenCalledTimes(1);
    });

    it('deve consultar cliente antes de filial e gravar feedback por último', async () => {
      const ordem: string[] = [];
      clienteRepo.buscarPorId.mockImplementation(async () => {
        ordem.push('cliente.buscarPorId');
        return clienteMock;
      });
      filialRepo.buscarPorId.mockImplementation(async () => {
        ordem.push('filial.buscarPorId');
        return filialMock;
      });
      feedbackRepo.salvar.mockImplementation(async () => {
        ordem.push('feedback.salvar');
      });

      await useCase.executar(dadosValidos);

      expect(ordem).toEqual([
        'cliente.buscarPorId',
        'filial.buscarPorId',
        'feedback.salvar',
      ]);
    });

    it('deve converter filialId (string) para Int ao consultar a porta de filial', async () => {
      await useCase.executar({ ...dadosValidos, filialId: '42' });

      expect(filialRepo.buscarPorId).toHaveBeenCalledWith(42);
    });
  });

  describe('cenário de erro - cliente inexistente', () => {
    beforeEach(() => {
      clienteRepo.buscarPorId.mockResolvedValue(null);
    });

    it('deve lançar NotFoundException quando o cliente não existir', async () => {
      await expect(useCase.executar(dadosValidos)).rejects.toThrow(
        NotFoundException,
      );
      await expect(useCase.executar(dadosValidos)).rejects.toThrow(
        'Cliente não encontrado',
      );
    });

    it('NÃO deve consultar a filial quando o cliente não existir', async () => {
      await expect(useCase.executar(dadosValidos)).rejects.toThrow(
        NotFoundException,
      );

      expect(filialRepo.buscarPorId).not.toHaveBeenCalled();
    });

    it('NÃO deve gravar o feedback quando o cliente não existir', async () => {
      await expect(useCase.executar(dadosValidos)).rejects.toThrow(
        NotFoundException,
      );

      expect(feedbackRepo.salvar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro - filialId inválido (não-inteiro)', () => {
    beforeEach(() => {
      clienteRepo.buscarPorId.mockResolvedValue(clienteMock);
    });

    it('deve lançar NotFoundException quando filialId não converte para inteiro', async () => {
      await expect(
        useCase.executar({ ...dadosValidos, filialId: 'abc' }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        useCase.executar({ ...dadosValidos, filialId: 'abc' }),
      ).rejects.toThrow('Filial com ID abc não encontrada');
    });

    it('NÃO deve consultar a porta de filial quando filialId é inválido', async () => {
      await expect(
        useCase.executar({ ...dadosValidos, filialId: 'abc' }),
      ).rejects.toThrow(NotFoundException);

      expect(filialRepo.buscarPorId).not.toHaveBeenCalled();
    });

    it('NÃO deve gravar o feedback quando filialId é inválido', async () => {
      await expect(
        useCase.executar({ ...dadosValidos, filialId: 'abc' }),
      ).rejects.toThrow(NotFoundException);

      expect(feedbackRepo.salvar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro - filial inexistente', () => {
    beforeEach(() => {
      clienteRepo.buscarPorId.mockResolvedValue(clienteMock);
      filialRepo.buscarPorId.mockResolvedValue(null);
    });

    it('deve lançar NotFoundException quando a filial não existir', async () => {
      await expect(useCase.executar(dadosValidos)).rejects.toThrow(
        NotFoundException,
      );
      await expect(useCase.executar(dadosValidos)).rejects.toThrow(
        'Filial com ID 1 não encontrada',
      );
    });

    it('NÃO deve gravar o feedback quando a filial não existir', async () => {
      await expect(useCase.executar(dadosValidos)).rejects.toThrow(
        NotFoundException,
      );

      expect(feedbackRepo.salvar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro - falha no repositório', () => {
    it('deve propagar erro lançado por feedbackRepo.salvar', async () => {
      clienteRepo.buscarPorId.mockResolvedValue(clienteMock);
      filialRepo.buscarPorId.mockResolvedValue(filialMock);
      feedbackRepo.salvar.mockRejectedValue(new Error('Falha de IO'));

      await expect(useCase.executar(dadosValidos)).rejects.toThrow(
        'Falha de IO',
      );
    });
  });
});
