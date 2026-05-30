import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import * as crypto from 'crypto';

// Casos de Uso
import { ListarFeedbacksUseCase } from '../../../core/use-cases/feedback/listar-feedbacks.use-case';
import { DeletarFeedbackUseCase } from '../../../core/use-cases/feedback/deletar-feedback.use-case';
import { AtualizarFeedbackUseCase } from '../../../core/use-cases/feedback/atualizar-feedback.use-case';

// DTOs
import { CriarFeedbackDto } from '../dtos/criar-feedback.dto';
import { AtualizarFeedbackDto } from '../dtos/atualizar-feedback.dto';

// Entidades de Domínio
import { RespostaObjetiva } from '../../../core/domain/feedback/resposta-objetiva.entity';
import { Feedback } from '../../../core/domain/feedback/feedback.entity';
import { CriarFeedbackUseCase } from 'src/core/use-cases/feedback/create-feedback.use-case';
import { BuscarFeedbacksQueryDto } from '../dtos/buscar-feedbacks.dto';
import { BuscarFeedbackUseCase } from 'src/core/use-cases/feedback/buscar-feedbacks.use-case';

@ApiTags('feedbacks') // Agrupa todos os endpoints deste controller no Swagger
@Controller('feedbacks')
export class FeedbackController {
  constructor(
    private readonly criarUC: CriarFeedbackUseCase,
    private readonly listarUC: ListarFeedbacksUseCase,
    private readonly deletarUC: DeletarFeedbackUseCase,
    private readonly atualizarUC: AtualizarFeedbackUseCase,
    private readonly buscarUC: BuscarFeedbackUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar um novo feedback',
    description:
      'Cria um novo feedback. Antes de gravar, o serviço valida se o `filialId` ' +
      'informado corresponde a uma filial existente em `/filiais`. ' +
      'Caso contrário, retorna 404.',
  })
  @ApiResponse({ status: 201, description: 'Feedback criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiResponse({
    status: 404,
    description: 'Filial referenciada (filialId) não encontrada.',
  })
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dto: CriarFeedbackDto) {
    // Convertendo as respostas do DTO para a Entidade de Domínio gerando o ID necessário
    const dadosMapeados = {
      clienteId: dto.clienteId,
      filialId: dto.filialId,
      respostas: dto.respostas.map(
        (r) =>
          new RespostaObjetiva(
            crypto.randomUUID(),
            r.perguntaId,
            r.opcao_escolhida,
          ),
      ),
    };
    console.log(dadosMapeados);
    return await this.criarUC.executar(dadosMapeados);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os feedbacks' })
  @ApiResponse({
    status: 200,
    description: 'Lista de feedbacks retornada com sucesso.',
  })
  async listar() {
    return await this.listarUC.executar();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um feedback existente' })
  @ApiParam({ name: 'id', description: 'ID do feedback', type: 'string' })
  @ApiResponse({ status: 200, description: 'Feedback atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Feedback não encontrado.' })
  async atualizar(@Param('id') id: string, @Body() dto: AtualizarFeedbackDto) {
    // Monta o objeto de forma tipada apenas com os dados que foram enviados
    const dadosParaAtualizar: Partial<Feedback> = {};

    if (dto.clienteId !== undefined) {
      dadosParaAtualizar.clienteId = dto.clienteId;
    }

    if (dto.filialId !== undefined) {
      dadosParaAtualizar.filialId = dto.filialId;
    }

    if (dto.respostas) {
      dadosParaAtualizar.respostas = dto.respostas.map(
        (respostaDto) =>
          new RespostaObjetiva(
            crypto.randomUUID(),
            respostaDto.perguntaId,
            respostaDto.opcao_escolhida,
          ),
      );
    }

    return await this.atualizarUC.executar(id, dadosParaAtualizar);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um feedback' })
  @ApiParam({
    name: 'id',
    description: 'ID do feedback a ser deletado',
    type: 'string',
  })
  @ApiResponse({ status: 204, description: 'Feedback removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Feedback não encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id') id: string) {
    await this.deletarUC.executar(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ou buscar feedbacks com filtros' })
  @ApiResponse({
    status: 200,
    description: 'Feedbacks retornados com sucesso.',
  })
  async buscar(@Query() query: BuscarFeedbacksQueryDto) {
    return await this.buscarUC.executar({
      clienteId: query.clienteId,
      filialId: query.filialId,
      status: query.status,
    });
  }
}
