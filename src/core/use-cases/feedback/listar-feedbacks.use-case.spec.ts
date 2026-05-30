import { Test, TestingModule } from '@nestjs/testing';
import { ListarFeedbacksUseCase } from './listar-feedbacks.use-case';
import { FeedbackRepository } from '../../ports/feedback.repository';
import { Feedback } from '../../domain/feedback/feedback.entity';

describe('ListarFeedbacksUseCase', () => {
  let useCase: ListarFeedbacksUseCase;
  let feedbackRepo: jest.Mocked<FeedbackRepository>;

  const feedbacksMock: Feedback[] = [
    new Feedback(
      'uuid-feedback-1',
      'uuid-cliente-1',
      '1',
      'ABERTO',
      new Date('2025-05-01'),
      [],
    ),
    new Feedback(
      'uuid-feedback-2',
      'uuid-cliente-2',
      '2',
      'FECHADO',
      new Date('2025-05-02'),
      [],
    ),
  ];

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
        ListarFeedbacksUseCase,
        { provide: FeedbackRepository, useValue: feedbackRepoMock },
      ],
    }).compile();

    useCase = module.get<ListarFeedbacksUseCase>(ListarFeedbacksUseCase);
    feedbackRepo = module.get(FeedbackRepository);
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('cenário de sucesso', () => {
    it('deve retornar a lista de feedbacks vinda do repositório', async () => {
      feedbackRepo.listarTodos.mockResolvedValue(feedbacksMock);

      const resultado = await useCase.executar();

      expect(resultado).toBe(feedbacksMock);
      expect(resultado).toHaveLength(2);
      expect(resultado[0].id_feedback).toBe('uuid-feedback-1');
      expect(resultado[1].id_feedback).toBe('uuid-feedback-2');
    });

    it('deve retornar array vazio quando o repositório não tiver feedbacks', async () => {
      feedbackRepo.listarTodos.mockResolvedValue([]);

      const resultado = await useCase.executar();

      expect(resultado).toEqual([]);
      expect(resultado).toHaveLength(0);
    });

    it('deve chamar listarTodos do repositório exatamente uma vez', async () => {
      feedbackRepo.listarTodos.mockResolvedValue(feedbacksMock);

      await useCase.executar();

      expect(feedbackRepo.listarTodos).toHaveBeenCalledTimes(1);
      expect(feedbackRepo.listarTodos).toHaveBeenCalledWith();
    });

    it('não deve chamar nenhum outro método do repositório', async () => {
      feedbackRepo.listarTodos.mockResolvedValue(feedbacksMock);

      await useCase.executar();

      expect(feedbackRepo.salvar).not.toHaveBeenCalled();
      expect(feedbackRepo.buscarPorId).not.toHaveBeenCalled();
      expect(feedbackRepo.atualizar).not.toHaveBeenCalled();
      expect(feedbackRepo.deletar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro', () => {
    it('deve propagar erros lançados pelo repositório', async () => {
      const erroSimulado = new Error('Falha ao ler arquivo');
      feedbackRepo.listarTodos.mockRejectedValue(erroSimulado);

      await expect(useCase.executar()).rejects.toThrow('Falha ao ler arquivo');
      expect(feedbackRepo.listarTodos).toHaveBeenCalledTimes(1);
    });
  });

  describe('múltiplas execuções', () => {
    it('cada execução deve disparar uma nova consulta ao repositório', async () => {
      feedbackRepo.listarTodos.mockResolvedValue(feedbacksMock);

      await useCase.executar();
      await useCase.executar();
      await useCase.executar();

      expect(feedbackRepo.listarTodos).toHaveBeenCalledTimes(3);
    });
  });
});
