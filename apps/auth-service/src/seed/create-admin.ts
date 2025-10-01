import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const roles = app.get(RolesService);
  const users = app.get(UsersService);
  const cs = app.get(ConfigService);

  const adminRoleName = 'admin';
  try {
    await roles.create(adminRoleName, ['*']);
    console.log('Admin role created');
  } catch (e) {
    console.log('Admin role exists or error', (e as Error).message || e);
  }

  const adminEmail = cs.get('SEED_ADMIN_EMAIL') || 'admin@example.com';
  const adminPassword = cs.get('SEED_ADMIN_PASSWORD') || 'AdminPassword123!';

  try {
    const u = await users.create({ email: adminEmail, password: adminPassword }, [adminRoleName]);
    console.log('Admin user created:', u.email);
  } catch (e) {
    console.log('Admin user may already exist', (e as Error).message || e);
  }

  await app.close();
}
bootstrap();
