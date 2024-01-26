import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PedidoController } from './controllers/pedido.controller';
import { PedidoStatus } from './models/enums/pedido.status.enum';
import { Pedido } from './models/pedido.model';
import { IPedidoService, PEDIDO_SERVICE_TOKEN } from '../src/services/interfaces/pedido.service.interface';
import { UpdateStatusDto } from './models/dtos/update-status.dto';


describe('PedidoController', () => {
  let controller: PedidoController;
  let mockPedidoService;

  beforeEach(async () => {
    mockPedidoService = {
      createPedido: jest.fn(),
      findById: jest.fn(),
      updatePedido: jest.fn(),
      deletePedido: jest.fn(),
      findByStatus: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoController],
      providers: [{ provide: PEDIDO_SERVICE_TOKEN, useValue: mockPedidoService }],
    }).compile();

    controller = module.get<PedidoController>(PedidoController);
  });

  it('deve criar um pedido', async () => {
    const mockPedido = new Pedido();
    const req = { headers: { authorization: 'Bearer test-token' } };
    mockPedidoService.createPedido.mockResolvedValue(mockPedido);

    await controller.createPedido(mockPedido, req as any);
    expect(mockPedidoService.createPedido).toHaveBeenCalledWith(mockPedido, 'test-token');
  });

  it('deve retornar um pedido pelo ID', async () => {
    const mockPedido = new Pedido();
    mockPedidoService.findById.mockResolvedValue(mockPedido);

    const result = await controller.getPedidoById('1');
    expect(result).toEqual(mockPedido);
    expect(mockPedidoService.findById).toHaveBeenCalledWith('1');
  });

  it('deve lançar NotFoundException se o pedido não for encontrado', async () => {
    mockPedidoService.findById.mockResolvedValue(undefined);

    await expect(controller.getPedidoById('1')).rejects.toThrow(NotFoundException);
  });

  it('deve atualizar um pedido', async () => {
    const mockPedido = new Pedido();
    const req = { headers: { authorization: 'Bearer test-token' } };
    mockPedidoService.updatePedido.mockResolvedValue(mockPedido);

    const result = await controller.updatePedido('1', mockPedido, req as any);
    expect(result).toEqual({ message: 'Pedido atualizado com sucesso.' });
    expect(mockPedidoService.updatePedido).toHaveBeenCalledWith('1', mockPedido, 'test-token');
  });

  it('deve deletar um pedido', async () => {
    await controller.deletePedido('1');
    expect(mockPedidoService.deletePedido).toHaveBeenCalledWith('1');
  });

  it('deve obter o status de um pedido', async () => {
    const mockPedido = { ...new Pedido(), status: PedidoStatus.PRONTO };
    mockPedidoService.findById.mockResolvedValue(mockPedido);

    const result = await controller.getStatus('1');
    expect(result).toEqual({ status: PedidoStatus.PRONTO });
  });

  it('deve encontrar pedidos por status', async () => {
    const mockPedidos = [new Pedido(), new Pedido()];
    mockPedidoService.findByStatus.mockResolvedValue(mockPedidos);

    const result = await controller.findByStatus('preparando');
    expect(result).toEqual(mockPedidos);
    expect(mockPedidoService.findByStatus).toHaveBeenCalledWith('preparando');
  });

  it('deve atualizar o status de um pedido', async () => {
    const updateStatusDto = new UpdateStatusDto();
    updateStatusDto.status = PedidoStatus.EM_PREPARACAO;
    const req = { headers: { authorization: 'Bearer test-token' } };
    mockPedidoService.updateStatus.mockResolvedValue({});

    const result = await controller.updateStatus('1', updateStatusDto, req as any);
    expect(result).toEqual({ message: 'Status do pedido atualizado com sucesso.' });
    expect(mockPedidoService.updateStatus).toHaveBeenCalledWith('1', PedidoStatus.EM_PREPARACAO, 'test-token');
  });
});

