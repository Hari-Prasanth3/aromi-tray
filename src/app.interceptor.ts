import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { CloudLogger } from './logger/cloud.logger.service';

@Injectable()
export class AppInterceptor {
  constructor(private readonly logger: CloudLogger) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    if (!req.user) {
      this.logger.setAttr({ userId: '' });
    }
    else {
      this.logger.setAttr({ userId: req?.user?._id });
    }
    
    this.logger.init(req);
    this.logger.log(`Started ${req.method} ${req.url}`, {
      httpMethod: req.method,
      params: req.params,
      body: req.body,
      hostName: req.hostname,
    });
    return next.handle();
  }
}
