import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { Pedido } from './models/pedido.model';
import { PEDIDO_REPOSITORY_TOKEN } from './repositories/interfaces/pedido.repository.interface';
import { NOTIFICACAO_SERVICE_TOKEN } from './services/interfaces/notificacao.service.interface';
import { PedidoService } from './services/pedido.service';


describe('PedidoService', () => {
  let service: PedidoService;
  let mockPedidoRepository;
  let mockNotificacaoService;

  beforeEach(async () => {
    mockPedidoRepository = {
      findById: jest.fn(),
      savePedido: jest.fn(),
      updatePedido: jest.fn(),
      deletePedido: jest.fn(),
      findByStatus: jest.fn(),
    };

    mockNotificacaoService = {
      notificarCriacaoPedido: jest.fn(),
      notificarAtualizacaoPedido: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoService,
        { provide: PEDIDO_REPOSITORY_TOKEN, useValue: mockPedidoRepository },
        { provide: NOTIFICACAO_SERVICE_TOKEN, useValue: mockNotificacaoService },
      ],
    }).compile();

    service = module.get<PedidoService>(PedidoService);
  });

  it('deve criar um pedido se não existir um com o mesmo ID', async () => {
    const pedidoData = new Pedido();
    pedidoData.id = 1;
    mockPedidoRepository.findById.mockResolvedValue(null);
    mockPedidoRepository.savePedido.mockResolvedValue(pedidoData);

    const result = await service.createPedido(pedidoData, 'jwtToken');
    expect(result).toEqual(pedidoData);
    expect(mockPedidoRepository.savePedido).toHaveBeenCalledWith(pedidoData);
  });

  it('deve lançar um conflito se o pedido já existir', async () => {
    const pedidoData = new Pedido();
    pedidoData.id = 1;
    mockPedidoRepository.findById.mockResolvedValue(pedidoData);

    await expect(service.createPedido(pedidoData, 'jwtToken')).rejects.toThrow(ConflictException);
  });

  it('deve retornar um pedido pelo ID', async () => {
    const pedido = new Pedido();
    mockPedidoRepository.findById.mockResolvedValue(pedido);

    const result = await service.findById('1');
    expect(result).toEqual(pedido);
    expect(mockPedidoRepository.findById).toHaveBeenCalledWith('1');
  });

  it('deve atualizar um pedido', async () => {
    const pedidoData = new Pedido();
    mockPedidoRepository.updatePedido.mockResolvedValue(pedidoData);

    const result = await service.updatePedido('1', pedidoData, 'jwtToken');
    expect(result).toEqual(pedidoData);
    expect(mockPedidoRepository.updatePedido).toHaveBeenCalledWith('1', pedidoData);
  });

  it('deve deletar um pedido', async () => {
    mockPedidoRepository.deletePedido.mockResolvedValue(undefined);

    await service.deletePedido('1');
    expect(mockPedidoRepository.deletePedido).toHaveBeenCalledWith('1');
  });

  it('deve atualizar o status de um pedido existente', async () => {
    const pedidoData = new Pedido();
    mockPedidoRepository.findById.mockResolvedValue(pedidoData);
    mockPedidoRepository.updatePedido.mockResolvedValue(pedidoData);

    const result = await service.updateStatus('1', 'novo status', 'jwtToken');
    expect(result).toEqual(pedidoData);
    expect(pedidoData.status).toEqual('novo status');
    expect(mockPedidoRepository.updatePedido).toHaveBeenCalledWith('1', pedidoData);
  });

  it('deve lançar um erro ao tentar atualizar o status de um pedido inexistente', async () => {
    mockPedidoRepository.findById.mockResolvedValue(null);

    await expect(service.updateStatus('1', 'novo status', 'jwtToken')).rejects.toThrow('Pedido não encontrado.');
  });

  it('deve encontrar pedidos por status', async () => {
    const pedidos = [new Pedido(), new Pedido()];
    mockPedidoRepository.findByStatus.mockResolvedValue(pedidos);

    const result = await service.findByStatus('preparando');
    expect(result).toEqual(pedidos);
    expect(mockPedidoRepository.findByStatus).toHaveBeenCalledWith('preparando');
  });
});
