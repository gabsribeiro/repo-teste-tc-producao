// src/services/interfaces/pedido.service.interface.ts

import { PedidoStatus } from 'src/models/enums/pedido.status.enum';
import { Pedido } from '../../models/pedido.model';

export const PEDIDO_SERVICE_TOKEN = 'IPedidoService';

export interface IPedidoService {
  createPedido(pedidoData: Pedido, jwtToken: string): Promise<Pedido>;
  findById(id: string): Promise<Pedido>;
  updatePedido(id: string, pedidoData: Pedido, jwtToken: string): Promise<Pedido>;
  deletePedido(id: string): Promise<void>;
  updateStatus(id: string, status: PedidoStatus, jwtToken: string): Promise<Pedido>;
  findByStatus(status: string): Promise<Pedido[]>
}
