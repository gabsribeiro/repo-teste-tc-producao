import { ApiProperty } from '@nestjs/swagger';
import { ItemDto } from './item.model';

export class ComboDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ type: () => ItemDto })
  lanche: ItemDto;

  @ApiProperty({ type: () => ItemDto })
  acompanhamento: ItemDto;

  @ApiProperty({ type: () => ItemDto })
  bebida: ItemDto;

  @ApiProperty({ type: () => ItemDto })
  sobremesa: ItemDto;

  @ApiProperty({ example: 1 })
  quantidade: number;

  @ApiProperty({ example: 23.98 })
  valorUnitario: number;

  @ApiProperty({ example: 23.98 })
  valorTotal: number;
}
