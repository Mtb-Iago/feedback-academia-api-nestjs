import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeletarFilialUseCase } from './deletar-filial.use-case';
import { Filial } from '../../domain/filial.entity';
import { FilialRepository } from '../../ports/filial.repository';

describe('DeletarFilialUseCase', () => {
  let useCase: DeletarFilialUseCase;
  let filialRepo: jest.Mocked<FilialRepository>;

  const filialExistente = new Filial(
    1,
    'Academia Centro',
    'Rua das Flores, 123 - Centro',
    '(11) 99999-9999',
    'contato@academia.com',
  );

  beforeEach(async () => {
    const filialRepoMock: jest.Mocked<FilialRepository> = {
      salvar: jest.fn(),
      buscarPorId: jest.fn(),
      listarTodos: jest.fn(),
      atualizar: jest.fn(),
      deletar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletarFilialUseCase,
        {
          provide: FilialRepository,
          useValue: filialRepoMock,
        },
      ],
    }).compile();

    useCase = module.get<DeletarFilialUseCase>(DeletarFilialUseCase);
    filialRepo = module.get(FilialRepository);
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('cenário de sucesso', () => {
    it('deve deletar a filial quando ela existe', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar(1);

      expect(filialRepo.deletar).toHaveBeenCalledWith(1);
      expect(filialRepo.deletar).toHaveBeenCalledTimes(1);
    });

    it('deve consultar buscarPorId antes de chamar deletar (ordem)', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.deletar.mockResolvedValue(undefined);

      const ordemDeChamadas: string[] = [];
      filialRepo.buscarPorId.mockImplementation(async () => {
        ordemDeChamadas.push('buscarPorId');
        return filialExistente;
      });
      filialRepo.deletar.mockImplementation(async () => {
        ordemDeChamadas.push('deletar');
      });

      await useCase.executar(1);

      expect(ordemDeChamadas).toEqual(['buscarPorId', 'deletar']);
    });

    it('deve repassar o id correto para o repositório', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar(42);

      expect(filialRepo.buscarPorId).toHaveBeenCalledWith(42);
      expect(filialRepo.deletar).toHaveBeenCalledWith(42);
    });

    it('deve chamar buscarPorId e deletar exatamente uma vez cada', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar(1);

      expect(filialRepo.buscarPorId).toHaveBeenCalledTimes(1);
      expect(filialRepo.deletar).toHaveBeenCalledTimes(1);
    });

    it('deve retornar undefined em caso de sucesso', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.deletar.mockResolvedValue(undefined);

      const resultado = await useCase.executar(1);

      expect(resultado).toBeUndefined();
    });

    it('não deve chamar outros métodos do repositório', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar(1);

      expect(filialRepo.salvar).not.toHaveBeenCalled();
      expect(filialRepo.listarTodos).not.toHaveBeenCalled();
      expect(filialRepo.atualizar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro - filial inexistente', () => {
    it('deve lançar NotFoundException quando a filial não for encontrada', async () => {
      filialRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar(999)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar exceção com a mensagem "Filial não encontrada"', async () => {
      filialRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar(999)).rejects.toThrow(
        'Filial não encontrada',
      );
    });

    it('NÃO deve chamar deletar quando a filial não existir', async () => {
      filialRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar(999)).rejects.toThrow(NotFoundException);

      expect(filialRepo.deletar).not.toHaveBeenCalled();
    });

    it('deve consultar buscarPorId mesmo quando a filial não existir', async () => {
      filialRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar(999)).rejects.toThrow(NotFoundException);

      expect(filialRepo.buscarPorId).toHaveBeenCalledWith(999);
      expect(filialRepo.buscarPorId).toHaveBeenCalledTimes(1);
    });
  });

  describe('cenário de erro - falha no repositório', () => {
    it('deve propagar erro lançado por buscarPorId', async () => {
      const erroSimulado = new Error('Falha ao ler arquivo');
      filialRepo.buscarPorId.mockRejectedValue(erroSimulado);

      await expect(useCase.executar(1)).rejects.toThrow('Falha ao ler arquivo');
      expect(filialRepo.deletar).not.toHaveBeenCalled();
    });

    it('deve propagar erro lançado por deletar', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      const erroSimulado = new Error('Falha ao gravar arquivo');
      filialRepo.deletar.mockRejectedValue(erroSimulado);

      await expect(useCase.executar(1)).rejects.toThrow(
        'Falha ao gravar arquivo',
      );
      expect(filialRepo.buscarPorId).toHaveBeenCalledTimes(1);
      expect(filialRepo.deletar).toHaveBeenCalledTimes(1);
    });
  });

  describe('múltiplas execuções', () => {
    it('cada execução deve disparar nova consulta e nova exclusão', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.deletar.mockResolvedValue(undefined);

      await useCase.executar(1);
      await useCase.executar(2);

      expect(filialRepo.buscarPorId).toHaveBeenCalledTimes(2);
      expect(filialRepo.deletar).toHaveBeenCalledTimes(2);
      expect(filialRepo.buscarPorId).toHaveBeenNthCalledWith(1, 1);
      expect(filialRepo.buscarPorId).toHaveBeenNthCalledWith(2, 2);
    });
  });
});
