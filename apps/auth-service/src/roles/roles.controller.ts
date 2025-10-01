import { Body, Controller, Get, Param, Post, Put, UseGuards, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { RolesService } from './roles.service';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(
    @Inject(RolesService) private rolesService: RolesService
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new role (admin only)' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Role successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 409, description: 'Conflict - Role already exists' })
  async create(@Body() body: CreateRoleDto) {
    return this.rolesService.create(body.name, body.permissions || []);
  }

  @ApiOperation({ summary: 'List roles (admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('admin')
  @Get()
  @ApiResponse({ status: 200, description: 'List of all roles' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async list() {
    return this.rolesService.list();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('admin')
  @Put(':name/permissions')
  @ApiOperation({ summary: 'Update role permissions (admin only)' })
  @ApiBody({ type: UpdateRolePermissionsDto })
  @ApiResponse({ status: 200, description: 'Role permissions successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async update(@Param('name') name: string, @Body() body: UpdateRolePermissionsDto) {
    return this.rolesService.updatePermissions(name, body.permissions || []);
  }
}
