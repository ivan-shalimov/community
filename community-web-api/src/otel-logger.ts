import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';

import { SeverityNumber, logs } from '@opentelemetry/api-logs';

@Injectable()
export class OtelLogger extends ConsoleLogger implements LoggerService {
  private readonly otelLogger = logs.getLogger('nestjs-logger');

  log(message: any, context?: string) {
    super.log(message, context); // Still print to console for local dev
    this.emitToOtel(SeverityNumber.INFO, message, context);
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
    this.emitToOtel(SeverityNumber.ERROR, message, context, stack);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    this.emitToOtel(SeverityNumber.WARN, message, context);
  }

  private emitToOtel(severity: SeverityNumber, message: any, context?: string, stack?: string) {
    this.otelLogger.emit({
      severityNumber: severity,
      severityText: SeverityNumber[severity],
      body: typeof message === 'string' ? message : JSON.stringify(message),
      attributes: {
        'service.name': 'community-service',
        'log.context': context,
        stack: stack,
      },
    });
  }
}
