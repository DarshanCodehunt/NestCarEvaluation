import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportRequestDto } from './dtos/create-report-request.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Auth } from 'src/auth/auth.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateReportResponseDto } from './dtos/create-report-response.dto';
import { ApproveReportRequestDto } from './dtos/approve-report-request.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { GetEstimateRequestDto } from './dtos/get-estimate-request.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Serialize(CreateReportResponseDto)
  @UseGuards(AuthGuard)
  @Post()
  createReport(
    @Body() body: CreateReportRequestDto,
    @CurrentUser() user: Auth,
  ) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(
    @Param('id') id: string,
    @Body() body: ApproveReportRequestDto,
  ) {
    return this.reportsService.approveReport(id, body.approved);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateRequestDto) {
    return this.reportsService.getEstimate(query);
  }
}
