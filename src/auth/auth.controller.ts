import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo Coder' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login con HttpOnly Cookie' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token } = await this.authService.login(loginDto);

    response.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 2,
    });

    return {
      message: 'Login exitoso',
      role: 'Verifica tus cookies en el navegador',
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión' })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken');
    return { message: 'Sesión cerrada' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  async getProfile(@Req() req: any) {
    // req.user puede venir solo con id/email/role si el token es antiguo.
    // Recuperamos el usuario completo desde la base de datos para asegurar
    // que campos como `name` estén presentes.
    const id = req.user?.id || req.user?.sub;
    if (!id) return { message: 'Perfil obtenido', data: req.user };

    const user = await this.usersService.findOneById(id);
    // No devolver password
    if (user) {
      const { password, ...safe } = user as any;
      return { message: 'Perfil obtenido', data: safe };
    }

    return { message: 'Perfil obtenido', data: req.user };
  }
}
