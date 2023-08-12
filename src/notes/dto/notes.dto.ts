import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @IsOptional()
  @ApiProperty({ required: false })
  parentNoteId?: string; // If creating a child note, specify the parent note ID
}

export class UpdateNoteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;
}
