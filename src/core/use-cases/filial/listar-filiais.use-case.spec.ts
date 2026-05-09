import { Test, TestingModule } from '@nestjs/testing';
import { ListarFiliaisUseCase } from './listar-filiais.use-case';
import { FilialRepository } from '../../ports/filial.repository';
import { Filial } from '../../domain/filial.entity';

describe('ListarFiliaisUseCase', () => {
  let useCase: ListarFiliaisUseCase;
  let filialRepo: jest.Mocked<FilialRepository>;

  const filiaisMock: Filial[] = [
    new Filial(
      1,
      'Academia Centro',
      'Rua das Flores, 123 - Centro',
      '(11) 99999-9999',
      'centro@academia.com',
    ),
    new Filial(
      2,
      'Academia Norte',
      'Av. Brasil, 500',
      '(11) 88888-8888',
      'norte@academia.com',
    ),
  ];

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
        ListarFiliaisUseCase,
        {
          provide: FilialRepository,
          useValue: filialRepoMock,
        },
      ],
    }).compile();

    useCase = module.get<ListarFiliaisUseCase>(ListarFiliaisUseCase);
    filialRepo = module.get(FilialRepository) as jest.Mocked<FilialRepository>;
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('cenário de sucesso', () => {
    it('deve retornar a lista de filiais vinda do repositório', async () => {
      filialRepo.listarTodos.mockResolvedValue(filiaisMock);

      const resultado = await useCase.executar();

      expect(resultado).toBe(filiaisMock);
      expect(resultado).toHaveLength(2);
      expect(resultado[0].id_filial).toBe(1);
      expect(resultado[1].id_filial).toBe(2);
    });

    it('deve retornar array vazio quando o repositório não tiver filiais', async () => {
      filialRepo.listarTodos.mockResolvedValue([]);

      const resultado = await useCase.executar();

      expect(resultado).toEqual([]);
      expect(resultado).toHaveLength(0);
    });

    it('deve chamar listarTodos do repositório exatamente uma vez', async () => {
      filialRepo.listarTodos.mockResolvedValue(filiaisMock);

      await useCase.executar();

      expect(filialRepo.listarTodos).toHaveBeenCalledTimes(1);
      expect(filialRepo.listarTodos).toHaveBeenCalledWith();
    });

    it('não deve chamar nenhum outro método do repositório', async () => {
      filialRepo.listarTodos.mockResolvedValue(filiaisMock);

      await useCase.executar();

      expect(filialRepo.salvar).not.toHaveBeenCalled();
      expect(filialRepo.buscarPorId).not.toHaveBeenCalled();
      expect(filialRepo.atualizar).not.toHaveBeenCalled();
      expect(filialRepo.deletar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro', () => {
    it('deve propagar erros lançados pelo repositório', async () => {
      const erroSimulado = new Error('Falha ao ler arquivo');
      filialRepo.listarTodos.mockRejectedValue(erroSimulado);

      await expect(useCase.executar()).rejects.toThrow('Falha ao ler arquivo');
      expect(filialRepo.listarTodos).toHaveBeenCalledTimes(1);
    });
  });

  describe('múltiplas execuções', () => {
    it('cada execução deve disparar uma nova consulta ao repositório', async () => {
      filialRepo.listarTodos.mockResolvedValue(filiaisMock);

      await useCase.executar();
      await useCase.executar();
      await useCase.executar();

      expect(filialRepo.listarTodos).toHaveBeenCalledTimes(3);
    });
  });
});
