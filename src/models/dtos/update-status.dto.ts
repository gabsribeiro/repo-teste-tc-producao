import { ApiProperty } from '@nestjs/swagger';
import { PedidoStatus } from '../enums/pedido.status.enum';

export class UpdateStatusDto {
    @ApiProperty({ enum: PedidoStatus, description: 'Novo status do pedido' })
    status: PedidoStatus;
}
