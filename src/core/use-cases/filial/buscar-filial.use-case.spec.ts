import { Test, TestingModule } from '@nestjs/testing';
import { BuscarFilialUseCase } from './buscar-filial.use-case';
import { Filial } from 'src/core/domain/filial.entity';
import { FilialRepository } from 'src/core/ports/filial.repository';

describe('BuscarFilialUseCase', () => {
  let useCase: BuscarFilialUseCase;
  let repository: FilialRepository;

  // Mock do repositório usando a API do Jest
  const mockFilialRepository = {
    buscarPorFiltros: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuscarFilialUseCase,
        {
          // Ajustado para usar a própria classe/interface se for o token usado no NestJS
          provide: 'FilialRepository',
          useValue: mockFilialRepository,
        },
      ],
    }).compile();

    useCase = module.get<BuscarFilialUseCase>(BuscarFilialUseCase);
    repository = module.get<FilialRepository>('FilialRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(useCase).toBeDefined();
  });

  it('deve retornar uma lista de filiais quando encontrar correspondências', async () => {
    // Arrange (Preparação)
    const filiaisMockadas: Filial[] = [
      new Filial(1, 'Filial São Paulo', 'Rua A', '1199999999', 'sp@email.com'),
      new Filial(
        2,
        'Filial Santo André',
        'Rua B',
        '1188888888',
        'sa@email.com',
      ),
    ];
    jest
      .spyOn(repository, 'buscarPorFiltros')
      .mockResolvedValue(filiaisMockadas);

    // Act (Ação)
    const resultado = await useCase.executar({ nome: 'Santo' });

    // Assert (Verificação)
    expect(repository.buscarPorFiltros).toHaveBeenCalledWith('Santo');
    expect(resultado).toHaveLength(2);
    expect(resultado).toEqual(filiaisMockadas);
  });

  it('deve retornar uma lista vazia se nenhuma filial corresponder ao filtro', async () => {
    // Arrange
    jest.spyOn(repository, 'buscarPorFiltros').mockResolvedValue([]);

    // Act
    const resultado = await useCase.executar({ nome: 'Inexistente' });

    // Assert
    expect(repository.buscarPorFiltros).toHaveBeenCalledWith('Inexistente');
    expect(resultado).toEqual([]);
  });
});
