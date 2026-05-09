import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeletarFeedbackUseCase } from './deletar-feedback.use-case';
import { FeedbackRepository } from '../../ports/feedback.repository';
import { Feedback } from '../../domain/feedback/feedback.entity';

describe('DeletarFeedbackUseCase', () => {
  let useCase: DeletarFeedbackUseCase;
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
        DeletarFeedbackUseCase,
        { provide: FeedbackRepository, useValue: feedbackRepoMock },
      ],
    }).compile();

    useCase = module.get<DeletarFeedbackUseCase>(DeletarFeedbackUseCase);
    feedbackRepo = module.get(
      FeedbackRepository,
    ) as jest.Mocked<FeedbackRepository>;
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('cenário de sucesso', () => {
    it('deve deletar o feedback quando ele existe', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      feedbackRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar('uuid-feedback-1');

      expect(feedbackRepo.deletar).toHaveBeenCalledWith('uuid-feedback-1');
      expect(feedbackRepo.deletar).toHaveBeenCalledTimes(1);
    });

    it('deve consultar buscarPorId antes de chamar deletar (ordem)', async () => {
      const ordem: string[] = [];
      feedbackRepo.buscarPorId.mockImplementation(async () => {
        ordem.push('buscarPorId');
        return feedbackExistente;
      });
      feedbackRepo.deletar.mockImplementation(async () => {
        ordem.push('deletar');
      });

      await useCase.executar('uuid-feedback-1');

      expect(ordem).toEqual(['buscarPorId', 'deletar']);
    });

    it('deve repassar o id correto para o repositório', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      feedbackRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar('abc-123');

      expect(feedbackRepo.buscarPorId).toHaveBeenCalledWith('abc-123');
      expect(feedbackRepo.deletar).toHaveBeenCalledWith('abc-123');
    });

    it('deve chamar buscarPorId e deletar exatamente uma vez cada', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      feedbackRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar('uuid-feedback-1');

      expect(feedbackRepo.buscarPorId).toHaveBeenCalledTimes(1);
      expect(feedbackRepo.deletar).toHaveBeenCalledTimes(1);
    });

    it('deve retornar undefined em caso de sucesso', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      feedbackRepo.deletar.mockResolvedValue(undefined);

      const resultado = await useCase.executar('uuid-feedback-1');

      expect(resultado).toBeUndefined();
    });

    it('não deve chamar outros métodos do repositório', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      feedbackRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar('uuid-feedback-1');

      expect(feedbackRepo.salvar).not.toHaveBeenCalled();
      expect(feedbackRepo.listarTodos).not.toHaveBeenCalled();
      expect(feedbackRepo.atualizar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro - feedback inexistente', () => {
    it('deve lançar NotFoundException quando o feedback não for encontrado', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar('inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar exceção com a mensagem "Feedback não encontrado"', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar('inexistente')).rejects.toThrow(
        'Feedback não encontrado',
      );
    });

    it('NÃO deve chamar deletar quando o feedback não existir', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar('inexistente')).rejects.toThrow(
        NotFoundException,
      );

      expect(feedbackRepo.deletar).not.toHaveBeenCalled();
    });

    it('deve consultar buscarPorId mesmo quando o feedback não existir', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar('inexistente')).rejects.toThrow(
        NotFoundException,
      );

      expect(feedbackRepo.buscarPorId).toHaveBeenCalledWith('inexistente');
      expect(feedbackRepo.buscarPorId).toHaveBeenCalledTimes(1);
    });
  });

  describe('cenário de erro - falha no repositório', () => {
    it('deve propagar erro lançado por buscarPorId', async () => {
      const erroSimulado = new Error('Falha ao ler arquivo');
      feedbackRepo.buscarPorId.mockRejectedValue(erroSimulado);

      await expect(useCase.executar('uuid-feedback-1')).rejects.toThrow(
        'Falha ao ler arquivo',
      );
      expect(feedbackRepo.deletar).not.toHaveBeenCalled();
    });

    it('deve propagar erro lançado por deletar', async () => {
      feedbackRepo.buscarPorId.mockResolvedValue(feedbackExistente);
      const erroSimulado = new Error('Falha ao gravar arquivo');
      feedbackRepo.deletar.mockRejectedValue(erroSimulado);

      await expect(useCase.executar('uuid-feedback-1')).rejects.toThrow(
        'Falha ao gravar arquivo',
      );
      expect(feedbackRepo.buscarPorId).toHaveBeenCalledTimes(1);
      expect(feedbackRepo.deletar).toHaveBeenCalledTimes(1);
    });
  });
});
