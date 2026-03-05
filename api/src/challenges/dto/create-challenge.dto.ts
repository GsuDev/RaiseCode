import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateChallengeDto {
  @IsString()
  title: string;

  @IsString()
  statement: string;

  @IsInt()
  dificultyId: number;

  @IsInt()
  languageId: number;

  @IsInt()
  subjectId: number;

  @IsBoolean()
  @IsOptional()
  validate?: boolean;
}