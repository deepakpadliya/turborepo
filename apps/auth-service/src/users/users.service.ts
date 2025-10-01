import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto, defaultRoles: string[] = ['user']) {
    const found = await this.userModel.findOne({ email: dto.email });
    if (found) throw new ConflictException('Email already exists');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = new this.userModel({
      email: dto.email,
      passwordHash,
      name: dto.name,
      roles: defaultRoles,
    });
    return created.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async updateResetToken(email: string, token: string, expiresAt: Date) {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { resetToken: token, resetTokenExpiresAt: expiresAt },
      { new: true },
    );
    if (!user) throw new NotFoundException();
    return user;
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userModel.findOne({ resetToken: token });
    if (!user) throw new NotFoundException('Invalid token');
    if (!user.resetTokenExpiresAt || new Date() > user.resetTokenExpiresAt) {
      throw new NotFoundException('Token expired or invalid');
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save();
    return user;
  }

  async removeSelf(userId: string) {
    const deleted = await this.userModel.findByIdAndDelete(userId);
    if (!deleted) throw new NotFoundException('User not found');
    return deleted;
  }
}
