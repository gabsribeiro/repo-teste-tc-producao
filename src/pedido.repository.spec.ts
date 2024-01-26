import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Pedido } from './models/pedido.model';
import { PedidoRepository } from './repositories/pedido.repository';
import { PedidoStatus } from './models/enums/pedido.status.enum';


describe('PedidoRepository', () => {
  let repository: PedidoRepository;
  let mockRedisService;
  let mockRedisClient;

  beforeEach(async () => {
    mockRedisClient = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      sadd: jest.fn(),
      srem: jest.fn(),
      smembers: jest.fn()
    };
    
    mockRedisService = {
      getClient: jest.fn().mockReturnValue(mockRedisClient)
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoRepository,
        { provide: RedisService, useValue: mockRedisService }
      ],
    }).compile();

    repository = module.get<PedidoRepository>(PedidoRepository);
  });

  it('deve salvar um pedido', async () => {
    const pedido = new Pedido();
    pedido.id = 1;
    pedido.status = 'novo';

    await repository.savePedido(pedido);
    expect(mockRedisClient.set).toHaveBeenCalledWith(`pedido:${pedido.id}`, JSON.stringify(pedido));
    expect(mockRedisClient.sadd).toHaveBeenCalledWith(`status:${pedido.status}`, pedido.id);
  });

  it('deve encontrar um pedido pelo ID', async () => {
    const pedido = new Pedido();
    pedido.id = 1;
    mockRedisClient.get.mockResolvedValue(JSON.stringify(pedido));

    const result = await repository.findById(pedido.id.toString());
    expect(result).toEqual(pedido);
    expect(mockRedisClient.get).toHaveBeenCalledWith(`pedido:${pedido.id}`);
  });

  it('deve retornar null se o pedido não for encontrado', async () => {
    mockRedisClient.get.mockResolvedValue(null);
    const result = await repository.findById('1');
    expect(result).toBeNull();
    expect(mockRedisClient.get).toHaveBeenCalledWith(`pedido:1`);
  });

  it('deve atualizar um pedido', async () => {
    const pedido = new Pedido();
    pedido.id = 1;
    pedido.status = PedidoStatus.PRONTO;
    mockRedisClient.get.mockResolvedValue(JSON.stringify(pedido));

    await repository.updatePedido(pedido.id.toString(), pedido);
    expect(mockRedisClient.set).toHaveBeenCalledWith(`pedido:${pedido.id.toString()}`, JSON.stringify(pedido));
    expect(mockRedisClient.sadd).toHaveBeenCalledWith(`status:${pedido.status}`, pedido.id.toString());
  });

  it('deve deletar um pedido', async () => {
    await repository.deletePedido('1');
    expect(mockRedisClient.del).toHaveBeenCalledWith(`pedido:1`);
  });

  it('deve encontrar pedidos por status', async () => {
    const pedidoIds = [1, 2];
    const pedidos = pedidoIds.map(id => new Pedido());
    mockRedisClient.smembers.mockResolvedValue(pedidoIds);
    mockRedisClient.get.mockImplementation(id => Promise.resolve(JSON.stringify(new Pedido())));

    const result = await repository.findByStatus('novo');
    expect(result).toEqual(pedidos);
    expect(mockRedisClient.smembers).toHaveBeenCalledWith(`status:novo`);
    expect(mockRedisClient.get).toHaveBeenCalledTimes(pedidoIds.length);
  });
});
