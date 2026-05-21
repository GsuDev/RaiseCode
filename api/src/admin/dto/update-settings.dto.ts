import { IsObject, IsString } from 'class-validator';

export class UpdateSettingsDto {
    [key: string]: string;
}
