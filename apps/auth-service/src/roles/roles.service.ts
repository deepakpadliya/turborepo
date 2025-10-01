import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(name: string, permissions: string[] = []) {
    const exists = await this.roleModel.findOne({ name });
    if (exists) throw new Error('Role exists');
    const r = new this.roleModel({ name, permissions });
    return r.save();
  }

  async find(name: string) {
    return this.roleModel.findOne({ name });
  }

  async updatePermissions(name: string, permissions: string[]) {
    const role = await this.roleModel.findOneAndUpdate({ name }, { permissions }, { new: true });
    if (!role) throw new NotFoundException();
    return role;
  }

  async list() {
    return this.roleModel.find();
  }
}
