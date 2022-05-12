import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    //  Get context info
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    //  Get Error status code and errro message
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const msg =
      exception instanceof HttpException ? exception.getResponse() : exception;

    //  Log Error
    Logger.error(`Status ${status} Error: ${JSON.stringify(msg)}`);

    //  Return Http Exception with timestamp
    res.status(status).json({
      timestamp: new Date().toISOString,
      path: req.url,
      error: msg,
    });
  }
}
