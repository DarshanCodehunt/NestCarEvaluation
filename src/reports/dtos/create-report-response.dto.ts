import { Expose, Transform } from 'class-transformer';

export class CreateReportResponseDto {
  @Expose()
  id: number;

  @Expose()
  make: string;

  @Expose()
  approved: boolean;

  @Expose()
  model: string;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  mileage: number;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;

  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number;
}
