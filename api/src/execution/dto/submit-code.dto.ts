import { IsInt, IsString, Min, MinLength, MaxLength } from 'class-validator';

export class SubmitCodeDto {
  @IsInt()
  @Min(1)
  challengeId: number;

  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  code: string;
}
