import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-10-02T22:15:30.000Z' },
        service: { type: 'string', example: 'auth-service' },
        uptime: { type: 'number', example: 12345.67 }
      }
    }
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'auth-service',
      uptime: process.uptime()
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Alternative health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-10-02T22:15:30.000Z' },
        service: { type: 'string', example: 'auth-service' },
        uptime: { type: 'number', example: 12345.67 }
      }
    }
  })
  getHealthAlternative() {
    return this.getHealth();
  }
}