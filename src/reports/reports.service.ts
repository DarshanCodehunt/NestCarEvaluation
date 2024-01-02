import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportRequestDto } from './dtos/create-report-request.dto';
import { Reports } from './reports.entity';
import { Auth } from 'src/auth/auth.entity';
import { GetEstimateRequestDto } from './dtos/get-estimate-request.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reports) private reportsRepo: Repository<Reports>,
  ) {}
  create(reportDto: CreateReportRequestDto, user: Auth) {
    const report = this.reportsRepo.create(reportDto);
    report.user = user;
    return this.reportsRepo.save(report);
  }

  async approveReport(id: string, approved: boolean) {
    const report = await this.reportsRepo.findOneBy({ id: Number(id) });
    if (!report) {
      throw new NotFoundException('Id not found');
    }
    report.approved = approved;
    return this.reportsRepo.save(report);
  }

  getEstimate({
    make,
    model,
    latitude,
    longitude,
    mileage,
    year,
  }: GetEstimateRequestDto) {
    return this.reportsRepo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('latitude - :latitude BETWEEN -5 and 5', { latitude })
      .andWhere('longitude - :longitude BETWEEN -5 and 5', { longitude })
      .andWhere('year - :year BETWEEN -3 and 3', { year })
      .andWhere('approved is TRUE')
      .orderBy('ABS (mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
