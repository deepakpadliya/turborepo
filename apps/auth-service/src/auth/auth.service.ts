import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(ConfigService) private config: ConfigService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.passwordHash);
    if (match) {
      return { id: user._id.toString(), email: user.email, roles: user.roles };
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    return { access_token: this.jwtService.sign(payload) };
  }
}
