import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AtualizarFilialUseCase } from './atualizar-filial.use-case';
import { FilialRepository } from '../../ports/filial.repository';
import { Filial } from '../../domain/filial.entity';

describe('AtualizarFilialUseCase', () => {
  let useCase: AtualizarFilialUseCase;
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
        AtualizarFilialUseCase,
        {
          provide: FilialRepository,
          useValue: filialRepoMock,
        },
      ],
    }).compile();

    useCase = module.get<AtualizarFilialUseCase>(AtualizarFilialUseCase);
    filialRepo = module.get(FilialRepository) as jest.Mocked<FilialRepository>;
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('cenário de sucesso', () => {
    it('deve atualizar e retornar a filial quando ela existe', async () => {
      const filialAtualizada = new Filial(
        1,
        'Academia Centro Renovada',
        filialExistente.endereco,
        filialExistente.telefone,
        filialExistente.email,
      );
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.atualizar.mockResolvedValue(filialAtualizada);

      const resultado = await useCase.executar(1, {
        nome: 'Academia Centro Renovada',
      });

      expect(resultado).toBe(filialAtualizada);
      expect(resultado.nome).toBe('Academia Centro Renovada');
    });

    it('deve consultar buscarPorId antes de chamar atualizar (ordem)', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.atualizar.mockResolvedValue(filialExistente);

      const ordemDeChamadas: string[] = [];
      filialRepo.buscarPorId.mockImplementation(async () => {
        ordemDeChamadas.push('buscarPorId');
        return filialExistente;
      });
      filialRepo.atualizar.mockImplementation(async () => {
        ordemDeChamadas.push('atualizar');
        return filialExistente;
      });

      await useCase.executar(1, { nome: 'Novo Nome' });

      expect(ordemDeChamadas).toEqual(['buscarPorId', 'atualizar']);
    });

    it('deve repassar o id e os dados corretos ao repositório', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.atualizar.mockResolvedValue(filialExistente);

      const dados = {
        nome: 'Novo Nome',
        telefone: '(11) 11111-1111',
      };

      await useCase.executar(7, dados);

      expect(filialRepo.buscarPorId).toHaveBeenCalledWith(7);
      expect(filialRepo.atualizar).toHaveBeenCalledWith(7, dados);
    });

    it('deve aceitar atualização parcial (apenas alguns campos)', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.atualizar.mockResolvedValue(filialExistente);

      await useCase.executar(1, { email: 'novo@academia.com' });

      expect(filialRepo.atualizar).toHaveBeenCalledWith(1, {
        email: 'novo@academia.com',
      });
    });

    it('deve aceitar objeto de dados vazio (delega ao repositório)', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.atualizar.mockResolvedValue(filialExistente);

      await useCase.executar(1, {});

      expect(filialRepo.atualizar).toHaveBeenCalledWith(1, {});
    });

    it('deve chamar buscarPorId e atualizar exatamente uma vez cada', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.atualizar.mockResolvedValue(filialExistente);

      await useCase.executar(1, { nome: 'X' });

      expect(filialRepo.buscarPorId).toHaveBeenCalledTimes(1);
      expect(filialRepo.atualizar).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar outros métodos do repositório', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.atualizar.mockResolvedValue(filialExistente);

      await useCase.executar(1, { nome: 'X' });

      expect(filialRepo.salvar).not.toHaveBeenCalled();
      expect(filialRepo.listarTodos).not.toHaveBeenCalled();
      expect(filialRepo.deletar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro - filial inexistente', () => {
    it('deve lançar NotFoundException quando a filial não for encontrada', async () => {
      filialRepo.buscarPorId.mockResolvedValue(null);

      await expect(
        useCase.executar(999, { nome: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('a mensagem de erro deve incluir o id da filial', async () => {
      filialRepo.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar(999, { nome: 'X' })).rejects.toThrow(
        'Filial com ID 999 não encontrada',
      );
    });

    it('NÃO deve chamar atualizar quando a filial não existir', async () => {
      filialRepo.buscarPorId.mockResolvedValue(null);

      await expect(
        useCase.executar(999, { nome: 'X' }),
      ).rejects.toThrow(NotFoundException);

      expect(filialRepo.atualizar).not.toHaveBeenCalled();
    });

    it('deve consultar buscarPorId mesmo quando a filial não existir', async () => {
      filialRepo.buscarPorId.mockResolvedValue(null);

      await expect(
        useCase.executar(999, { nome: 'X' }),
      ).rejects.toThrow(NotFoundException);

      expect(filialRepo.buscarPorId).toHaveBeenCalledWith(999);
      expect(filialRepo.buscarPorId).toHaveBeenCalledTimes(1);
    });
  });

  describe('cenário de erro - falha no repositório', () => {
    it('deve propagar erro lançado por buscarPorId', async () => {
      const erroSimulado = new Error('Falha ao ler arquivo');
      filialRepo.buscarPorId.mockRejectedValue(erroSimulado);

      await expect(useCase.executar(1, { nome: 'X' })).rejects.toThrow(
        'Falha ao ler arquivo',
      );
      expect(filialRepo.atualizar).not.toHaveBeenCalled();
    });

    it('deve propagar erro lançado por atualizar', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      const erroSimulado = new Error('Falha ao gravar arquivo');
      filialRepo.atualizar.mockRejectedValue(erroSimulado);

      await expect(useCase.executar(1, { nome: 'X' })).rejects.toThrow(
        'Falha ao gravar arquivo',
      );
      expect(filialRepo.buscarPorId).toHaveBeenCalledTimes(1);
      expect(filialRepo.atualizar).toHaveBeenCalledTimes(1);
    });
  });

  describe('múltiplas execuções', () => {
    it('cada execução deve disparar nova consulta e nova atualização', async () => {
      filialRepo.buscarPorId.mockResolvedValue(filialExistente);
      filialRepo.atualizar.mockResolvedValue(filialExistente);

      await useCase.executar(1, { nome: 'A' });
      await useCase.executar(2, { nome: 'B' });

      expect(filialRepo.buscarPorId).toHaveBeenCalledTimes(2);
      expect(filialRepo.atualizar).toHaveBeenCalledTimes(2);
      expect(filialRepo.atualizar).toHaveBeenNthCalledWith(1, 1, { nome: 'A' });
      expect(filialRepo.atualizar).toHaveBeenNthCalledWith(2, 2, { nome: 'B' });
    });
  });
});
