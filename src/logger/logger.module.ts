import { Module} from '@nestjs/common';
import { CloudLogger } from './cloud.logger.service';

@Module({
  providers: [CloudLogger],
  exports: [CloudLogger],
})
export class LoggerModule {}
