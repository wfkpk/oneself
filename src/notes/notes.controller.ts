import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Request,
  Put,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/notes.dto';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Response } from 'src/interface/response';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notes for a user' })
  @ApiQuery({ name: 'cursor', description: 'Cursor' })
  @Get()
  async getUserNotes(
    @Request() req,
    @Query('cursor') cursor?: string,
  ): Promise<Response> {
    const userId = req.headers['userId'];

    return {
      data: await this.notesService.getAllUserNotes(userId, cursor),
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notes for a user' })
  @Get('/date/:date')
  async getNotesByDate(
    @Request() req,
    @Param('date') date: string,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    return {
      data: await this.notesService.getNotesByDate(userId, date),
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notes for a user' })
  @Get('/:noteId')
  async getNotesByParentNoteId(
    @Request() req,
    @Param('parentNoteId') parentNoteId: string,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    return {
      data: await this.notesService.getNotesByParentNoteId(
        userId,
        parentNoteId,
      ),
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'create note' })
  @Post('/create')
  async createNote(
    @Request() req,
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    return {
      data: await this.notesService.createNote(userId, createNoteDto),
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update note' })
  @Put(':noteId')
  async updateNote(
    @Request() req,
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    return {
      data: await this.notesService.updateNote(userId, noteId, updateNoteDto),
    };
  }
}
