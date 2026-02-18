import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum }  from 'class-validator';
import {Cycle} from '@prisma/client';

export class CreateUserDto {
    // Nombre (obligatorio)
    @IsString({ message: 'El nombre debe ser texto'})
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    name: string;

    // Apellidos (obligatorio)
    @IsString({message: 'El apellido debe ser texto'})
    @IsNotEmpty({message: 'El apellido es obligatorio'})
    lastname: string;
    
    // Email (obligatorio)
    @IsEmail({message: 'El email no tiene un formato valido'})
    @IsNotEmpty({message: 'El email es obligatorio'})
    email: string;

    // Contraseña (obligatorio)
    @IsString()
    @MinLength(6, {message: 'La contraseña debe tener al menos 6 caracteres'})
    password: string;

    // Confirmacion de contraseña (obligatorio)
    @IsString()
    @IsNotEmpty({message: 'Debes confirmar la contraseña'})
    passwordConfirm: string;

    // Ciclo (obligatorio)
    @IsEnum(Cycle, {message: 'El civlo debe ser DAM, DAW o ASIR'})
    @IsNotEmpty({message:'El ciclo es obligatorio'})
    cycle: Cycle;
}