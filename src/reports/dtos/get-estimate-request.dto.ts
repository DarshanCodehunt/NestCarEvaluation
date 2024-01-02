import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateRequestDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1930)
  @Max(2030)
  year: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  latitude: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  longitude: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}
