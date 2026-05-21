import {
  IsString, IsInt, IsBoolean, IsNumber, IsArray, IsIn,
  ValidateNested, IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TestResultItemDto {
  @IsInt()
  test_number: number;

  @IsBoolean()
  passed: boolean;

  @IsString()
  expected: string;

  @IsString()
  actual: string;
  
  @IsBoolean()
  @IsOptional()
  hidden?: boolean;
}

export class ExecutionResultDto {
  @IsString()
  jobId: string;

  @IsInt()
  challengeId: number;

  @IsInt()
  userId: number;

  @IsBoolean()
  success: boolean;

  @IsNumber()
  execution_time: number;

  @IsString()
  stdout: string;

  @IsString()
  stderr: string;

  @IsInt()
  score: number;

  @IsInt()
  tests_passed: number;

  @IsInt()
  tests_total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestResultItemDto)
  test_results: TestResultItemDto[];

  @IsIn(['accepted', 'wrong_answer', 'runtime_error', 'timeout'])
  status: 'accepted' | 'wrong_answer' | 'runtime_error' | 'timeout';
}
