import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginInput, RegisterInput } from '@tesku/schemas';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerInput: RegisterInput) {
    const existingUser = await this.usersService.findByEmail(registerInput.email);
    if (existingUser) {
      throw new ConflictException('Email is already taken');
    }

    const hashedPassword = await bcrypt.hash(registerInput.password, 10);
    const newUser = await this.usersService.createUser({
      email: registerInput.email,
      password: hashedPassword,
      name: registerInput.name,
      // role defaults to USER
    });

    const { password, ...result } = newUser;
    return result;
  }
}
