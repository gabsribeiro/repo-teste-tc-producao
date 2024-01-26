import { ApiProperty } from '@nestjs/swagger';

export class ItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Hambúrguer' })
  nome: string;

  @ApiProperty({ example: 'Delicioso hambúrguer artesanal' })
  descricao: string;

  @ApiProperty({ example: 10.99 })
  preco: number;

  @ApiProperty({ example: 'LANCHE' })
  categoria: string;
}
