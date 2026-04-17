import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  // Array porque una asignatura puede pertenecer a varios ciclos (DAW, DAM, ASIR...)
  @IsArray()
  @IsInt({ each: true })
  courseIds: number[];
}
