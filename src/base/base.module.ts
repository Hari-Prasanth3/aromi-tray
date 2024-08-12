import { Module } from '@nestjs/common';
import { BaseService } from './base.service';
import { BaseController } from './base.controller';
import { CloudLogger } from 'src/logger/cloud.logger.service';

@Module({
  imports: [
    CloudLogger
  ],
  controllers: [BaseController],
  providers: [BaseService],
})
export class BaseModule {}
