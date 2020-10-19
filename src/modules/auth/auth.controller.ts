import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Delete,
  HttpCode,
  UseGuards,
  Request,
  Get,
  Redirect,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNoContentResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserWithTokenSerializer } from './serializers/user-with-token.serializer';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { DSession } from 'src/shared/decorators/session.decorator';
import { SessionEntity } from '../sessions/session.entity';
import { BearerGuard } from 'src/shared/guards/bearer.guard';
import { DUser } from 'src/shared/decorators/user.decorator';
import { UserEntity } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('Auth Controller')
@UseInterceptors(new ResponseInterceptor(UserWithTokenSerializer))
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up new user' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiConflictResponse({ description: 'User with such email already exists' })
  @ApiCreatedResponse({
    description: 'New User Registered',
    type: UserWithTokenSerializer,
  })
  async signUp(@Body() signUpDto: SignUpDto): Promise<UserWithTokenSerializer> {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in existing user' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'User with such email not found' })
  @ApiForbiddenResponse({ description: 'Provided password is incorrect' })
  @ApiCreatedResponse({
    description: 'Created session for existing user',
    type: UserWithTokenSerializer,
  })
  async signIn(@Body() signInDto: SignInDto): Promise<UserWithTokenSerializer> {
    return this.authService.signIn(signInDto);
  }

  @Delete('sign-out')
  @UseGuards(BearerGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Signs out user' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiNoContentResponse({ description: 'User signed out' })
  async signOut(@DSession() session: SessionEntity): Promise<void> {
    return this.authService.signOut(session);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  @ApiOperation({
    summary:
      'Google OAuth endpoint. WARNING!!!! Do not test it from swagger - it should be tested from browser address string',
  })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signInGoogle(@Request() req): void {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  @Redirect()
  @ApiOperation({
    summary:
      'Google OAuth internal endpoint. WARNING!!!! Do not test it from swagger - it should be tested from browser address string',
  })
  async signInGoogleCallback(@DUser() user: UserEntity): Promise<any> {
    const userWithToken = await this.authService.signInGoogle(user);
    return {
      statusCode: 302,
      url: `${this.configService.get('api.frontendOrigin')}?token=${
        userWithToken.token
      }`,
    };
  }
}
