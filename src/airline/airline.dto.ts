import { IsDateString, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class AirlineDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsUrl()
    @IsNotEmpty()
    readonly website: string;

    @IsDateString()
    @IsNotEmpty()
    readonly foundationDate: Date;
}
