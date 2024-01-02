import { IsBoolean } from 'class-validator';

export class ApproveReportRequestDto {
  @IsBoolean()
  approved: boolean;
}
