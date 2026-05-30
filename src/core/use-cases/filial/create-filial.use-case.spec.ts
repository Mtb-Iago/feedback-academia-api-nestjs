import { Test, TestingModule } from '@nestjs/testing';
import { CriarFilialUseCase } from './create-filial.use-case';
import { FilialRepository } from '../../ports/filial.repository';
import { Filial } from '../../domain/filial.entity';

describe('CriarFilialUseCase', () => {
  let useCase: CriarFilialUseCase;
  let filialRepo: jest.Mocked<FilialRepository>;

  const dadosValidos = {
    nome: 'Academia Centro',
    endereco: 'Rua das Flores, 123 - Centro',
    telefone: '(11) 99999-9999',
    email: 'contato@academia.com',
  };

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
        CriarFilialUseCase,
        {
          provide: FilialRepository,
          useValue: filialRepoMock,
        },
      ],
    }).compile();

    useCase = module.get<CriarFilialUseCase>(CriarFilialUseCase);
    filialRepo = module.get(FilialRepository);
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('cenário de sucesso', () => {
    it('deve criar uma filial com os dados fornecidos e retornar a entidade persistida', async () => {
      const filialPersistida = new Filial(
        1,
        dadosValidos.nome,
        dadosValidos.endereco,
        dadosValidos.telefone,
        dadosValidos.email,
      );
      filialRepo.salvar.mockResolvedValue(filialPersistida);

      const resultado = await useCase.executar(dadosValidos);

      expect(resultado).toBe(filialPersistida);
      expect(resultado.id_filial).toBe(1);
      expect(resultado.nome).toBe(dadosValidos.nome);
      expect(resultado.endereco).toBe(dadosValidos.endereco);
      expect(resultado.telefone).toBe(dadosValidos.telefone);
      expect(resultado.email).toBe(dadosValidos.email);
    });

    it('deve repassar ao repositório uma instância de Filial', async () => {
      filialRepo.salvar.mockImplementation(async (f) => f);

      await useCase.executar(dadosValidos);

      const argumentoRecebido = filialRepo.salvar.mock.calls[0][0];
      expect(argumentoRecebido).toBeInstanceOf(Filial);
    });

    it('deve enviar id_filial=0 como placeholder (id real é gerado pelo repositório)', async () => {
      filialRepo.salvar.mockImplementation(async (f) => f);

      await useCase.executar(dadosValidos);

      const argumentoRecebido = filialRepo.salvar.mock.calls[0][0];
      expect(argumentoRecebido.id_filial).toBe(0);
    });

    it('deve retornar a filial com o id atribuído pelo repositório (não o placeholder)', async () => {
      const filialPersistida = new Filial(
        42,
        dadosValidos.nome,
        dadosValidos.endereco,
        dadosValidos.telefone,
        dadosValidos.email,
      );
      filialRepo.salvar.mockResolvedValue(filialPersistida);

      const resultado = await useCase.executar(dadosValidos);

      expect(resultado.id_filial).toBe(42);
      expect(resultado.id_filial).not.toBe(0);
    });

    it('deve chamar o método salvar do repositório exatamente uma vez', async () => {
      filialRepo.salvar.mockImplementation(async (f) => f);

      await useCase.executar(dadosValidos);

      expect(filialRepo.salvar).toHaveBeenCalledTimes(1);
    });

    it('deve preservar todos os 4 campos do DTO ao montar a entidade', async () => {
      filialRepo.salvar.mockImplementation(async (f) => f);

      await useCase.executar(dadosValidos);

      const argumentoRecebido = filialRepo.salvar.mock.calls[0][0];
      expect(argumentoRecebido).toEqual(
        expect.objectContaining({
          nome: dadosValidos.nome,
          endereco: dadosValidos.endereco,
          telefone: dadosValidos.telefone,
          email: dadosValidos.email,
        }),
      );
    });

    it('não deve mutar o objeto de entrada (dados)', async () => {
      filialRepo.salvar.mockImplementation(async (f) => f);
      const copiaOriginal = { ...dadosValidos };

      await useCase.executar(dadosValidos);

      expect(dadosValidos).toEqual(copiaOriginal);
    });

    it('não deve chamar nenhum outro método do repositório', async () => {
      filialRepo.salvar.mockImplementation(async (f) => f);

      await useCase.executar(dadosValidos);

      expect(filialRepo.buscarPorId).not.toHaveBeenCalled();
      expect(filialRepo.listarTodos).not.toHaveBeenCalled();
      expect(filialRepo.atualizar).not.toHaveBeenCalled();
      expect(filialRepo.deletar).not.toHaveBeenCalled();
    });
  });

  describe('cenário de erro', () => {
    it('deve propagar erros lançados pelo repositório ao salvar', async () => {
      const erroSimulado = new Error('Falha ao gravar arquivo');
      filialRepo.salvar.mockRejectedValue(erroSimulado);

      await expect(useCase.executar(dadosValidos)).rejects.toThrow(
        'Falha ao gravar arquivo',
      );
      expect(filialRepo.salvar).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erros do tipo customizado lançados pelo repositório', async () => {
      class FalhaPersistencia extends Error {}
      const erroSimulado = new FalhaPersistencia('disco cheio');
      filialRepo.salvar.mockRejectedValue(erroSimulado);

      await expect(useCase.executar(dadosValidos)).rejects.toBeInstanceOf(
        FalhaPersistencia,
      );
    });
  });

  describe('múltiplas execuções', () => {
    it('cada execução deve gerar uma nova chamada ao repositório', async () => {
      filialRepo.salvar.mockImplementation(async (f) => f);

      await useCase.executar(dadosValidos);
      await useCase.executar({
        nome: 'Filial Norte',
        endereco: 'Av. Brasil, 500',
        telefone: '(11) 88888-8888',
        email: 'norte@academia.com',
      });

      expect(filialRepo.salvar).toHaveBeenCalledTimes(2);
    });
  });
});
