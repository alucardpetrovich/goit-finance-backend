import { Strategy, StrategyOptions } from 'passport-google-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';

interface GoogleOAuthProfile {
  displayName: string;
  email: string;
  picture: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get('googleOAuth.clientID'),
      clientSecret: configService.get('googleOAuth.clientSecret'),
      callbackURL: configService.get('googleOAuth.callbackUrl'),
      scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleOAuthProfile,
  ): Promise<UserEntity> {
    return this.usersService.upsertUser(profile.email, profile.displayName);
  }
}
