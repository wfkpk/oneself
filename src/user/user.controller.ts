import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { Post, Request } from '@nestjs/common';
import { Response } from 'src/interface/response';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UseGuards(FirebaseAuthGuard)
  @Post()
  async createUser(@Request() req): Promise<Response> {
    const authToken = req.headers['authorization'];
    const user = await this.userService.createUser(authToken);
    return {
      data: user,
    };
  }

  @ApiOperation({ summary: 'Get user' })
  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Get()
  async getUser(@Request() req): Promise<Response> {
    const userId = req.headers['userId'];
    const user = await this.userService.getUser(userId);
    return {
      data: user,
    };
  }
}
