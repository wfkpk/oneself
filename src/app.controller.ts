import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from './interface/response';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/ping')
  getTest(): Response {
    return {
      data: 'pong',
    };
  }
}
