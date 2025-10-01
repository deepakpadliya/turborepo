import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Permissions = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
