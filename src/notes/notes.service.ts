import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Note } from '.prisma/client';
import { CreateNoteDto, UpdateNoteDto } from './dto/notes.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUserNotes(userId: string, cursor: string): Promise<Note[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notes = await this.prisma.note.findMany({
      where: { authorId: userId },
      take: 10,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        childNotes: true,
        authorId: true,
        parentNoteId: true,
        _count: {
          select: { childNotes: true },
        },
      },
    });

    return notes;
  }

  async getNotesByDate(userId: string, date: string): Promise<Note[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notes = await this.prisma.note.findMany({
      where: { authorId: userId, createdAt: date },
      orderBy: { createdAt: 'desc' },
    });

    return notes;
  }

  //get notes by parent note id
  async getNotesByParentNoteId(
    userId: string,
    parentNoteId: string,
  ): Promise<Note[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notes = await this.prisma.note.findMany({
      where: { authorId: userId, parentNoteId },
      orderBy: { createdAt: 'desc' },
    });

    return notes;
  }

  async createNote(
    userId: string,
    createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const note = await this.prisma.note.create({
      data: {
        content: createNoteDto.content,
        authorId: userId,
        parentNoteId: createNoteDto.parentNoteId,
      },
    });

    return note;
  }

  async updateNote(
    userId: string,
    id: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const existingNote = await this.prisma.note.findUnique({
      where: { id, authorId: userId },
    });

    if (!existingNote) {
      throw new NotFoundException('Note not found');
    }

    const updatedNote = await this.prisma.note.update({
      where: { id },
      data: { content: updateNoteDto.content },
    });

    return updatedNote;
  }
}
