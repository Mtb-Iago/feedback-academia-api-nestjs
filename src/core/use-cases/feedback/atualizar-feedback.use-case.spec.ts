import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AtualizarFeedbackUseCase } from './atualizar-feedback.use-case';
import { FeedbackRepository } from '../../ports/feedback.repository';
import { Feedback } from '../../domain/feedback/feedback.entity';

describe('AtualizarFeedbackUseCase', () => {
  let useCase: AtualizarFeedbackUseCase;
  let feedbackRepo: jest.Mocked<FeedbackRepository>;

  const feedbackExistente = new Feedback(
    'uuid-feedback-1',
    'uuid-cliente-1',
    '1',
    'ABERTO',
    new Date('2025-05-01'),
    [],
  );

  beforeEach(async () => {
    const feedbackRepoMock: jest.Mocked<FeedbackRepository> = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      listarTodos: jest.fn(),
      atualizar: jest.fn(),
      deletar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AtualizarFeedbackUseCase,
        { provide: FeedbackRepository, useValue: feedbackRepoMock },
      ],
    }).compile();

    useCase = module.get<AtualizarFeedbackUseCase>(AtualizarFeedbackUseCase);
    feedbackRepo = module.get(
      FeedbackRepository,
    ) as jest.Mocked<FeedbackRepository>;
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('cenário de sucesso', () => {
    it('deve atualizar e retornar o feedback quando ele existe', async () => {
      const feedbackAtualizado = new Feedback(
        'uuid-feedback-1',
        'uuid-cliente-1',
        '1',
        'FECHADO',
        feedbackExistente.data_criacao,
        [],
      );
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      feedbackRepo.atualizar.mockResolvedValue(feedbackAtualizado);

      const resultado = await useCase.executar('uuid-feedback-1', {
        status_feedback: 'FECHADO',
      });

      expect(resultado).toBe(feedbackAtualizado);
      expect(resultado.status_feedback).toBe('FECHADO');
    });

    it('deve consultar buscarPorId antes de chamar atualizar (ordem)', async () => {
      const ordem: string[] = [];
      feedbackRepo.buscarPorId.mockImplementation(async () => {
        ordem.push('buscarPorId');
        return feedbackExistente;
      });
      feedbackRepo.atualizar.mockImplementation(async () => {
        ordem.push('atualizar');
        return feedbackExistente;
      });

      await useCase.executar('uuid-feedback-1', { status_feedback: 'FECHADO' });

      expect(ordem).toEqual(['buscarPorId', 'atualizar']);
    });

    it('deve repassar o id e os dados corretos ao repositório', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      feedbackRepo.atualizar.mockResolvedValue(feedbackExistente);

      const dados = { status_feedback: 'EM_ANALISE', filialId: '2' };
      await useCase.executar('uuid-xyz', dados);

      expect(feedbackRepo.buscarPorId).toHaveBeenCalledWith('uuid-xyz');
      expect(feedbackRepo.atualizar).toHaveBeenCalledWith('uuid-xyz', dados);
    });

    it('deve aceitar atualização parcial (apenas alguns campos)', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      feedbackRepo.atualizar.mockResolvedValue(feedbackExistente);

      await useCase.executar('uuid-feedback-1', { clienteId: 'novo-cliente' });

      expect(feedbackRepo.atualizar).toHaveBeenCalledWith('uuid-feedback-1', {
        clienteId: 'novo-cliente',
      });
    });

    it('deve aceitar objeto de dados vazio (delega ao repositório)', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      feedbackRepo.atualizar.mockResolvedValue(feedbackExistente);

      await useCase.executar('uuid-feedback-1', {});

      expect(feedbackRepo.atualizar).toHaveBeenCalledWith(
        'uuid-feedback-1',
        {},
      );
    });

    it('deve chamar buscarPorId e atualizar exatamente uma vez cada', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      feedbackRepo.atualizar.mockResolvedValue(feedbackExistente);

      await useCase.executar('uuid-feedback-1', { status_feedback: 'FECHADO' });

      expect(feedbackRepo.buscarPorId).toHaveBeenCalledTimes(1);
      expect(feedbackRepo.atualizar).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar outros métodos do repositório', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      feedbackRepo.atualizar.mockResolvedValue(feedbackExistente);

      await useCase.executar('uuid-feedback-1', { status_feedback: 'FECHADO' });

      expect(feedbackRepo.salvar).not.toHaveBeenCalled();
      expect(feedbackRepo.listarTodos).not.toHaveBeenCalled();
      expect(feedbackRepo.deletar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro - feedback inexistente', () => {
    it('deve lançar NotFoundException quando o feedback não for encontrado', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(null);

      await expect(
        useCase.executar('inexistente', { status_feedback: 'FECHADO' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('a mensagem de erro deve incluir o id do feedback', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(null);

      await expect(
        useCase.executar('uuid-xyz', { status_feedback: 'FECHADO' }),
      ).rejects.toThrow('Feedback com ID uuid-xyz não encontrado');
    });

    it('NÃO deve chamar atualizar quando o feedback não existir', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(null);

      await expect(
        useCase.executar('inexistente', { status_feedback: 'FECHADO' }),
      ).rejects.toThrow(NotFoundException);

      expect(feedbackRepo.atualizar).not.toHaveBeenCalled();
    });

    it('deve consultar buscarPorId mesmo quando o feedback não existir', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(null);

      await expect(
        useCase.executar('inexistente', { status_feedback: 'FECHADO' }),
      ).rejects.toThrow(NotFoundException);

      expect(feedbackRepo.buscarPorId).toHaveBeenCalledWith('inexistente');
      expect(feedbackRepo.buscarPorId).toHaveBeenCalledTimes(1);
    });
  });

  describe('cenário de erro - falha no repositório', () => {
    it('deve propagar erro lançado por buscarPorId', async () => {
      const erroSimulado = new Error('Falha ao ler arquivo');
      feedbackRepo.buscarPorId.mockRejectedValue(erroSimulado);

      await expect(
        useCase.executar('uuid-feedback-1', { status_feedback: 'FECHADO' }),
      ).rejects.toThrow('Falha ao ler arquivo');
      expect(feedbackRepo.atualizar).not.toHaveBeenCalled();
    });

    it('deve propagar erro lançado por atualizar', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      const erroSimulado = new Error('Falha ao gravar arquivo');
      feedbackRepo.atualizar.mockRejectedValue(erroSimulado);

      await expect(
        useCase.executar('uuid-feedback-1', { status_feedback: 'FECHADO' }),
      ).rejects.toThrow('Falha ao gravar arquivo');
      expect(feedbackRepo.buscarPorId).toHaveBeenCalledTimes(1);
      expect(feedbackRepo.atualizar).toHaveBeenCalledTimes(1);
    });
  });
});
