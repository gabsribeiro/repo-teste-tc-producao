import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/UserDTO';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiBody({ type: UserDTO })
  @ApiResponse({ status: 201, description: 'Usuário autenticado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async authenticate(@Body() userDTO: UserDTO) {
    const observable = this.authService.authenticate(userDTO);
    // console.log(observable)
    return lastValueFrom(observable);
  }
}
