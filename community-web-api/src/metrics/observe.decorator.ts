/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { SpanStatusCode, trace } from '@opentelemetry/api';

import { CommunityMetrics } from './community-metrics';

export function Observe(name: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const tracer = trace.getTracer('nestjs-tracer');
      const startTime = performance.now();

      return tracer.startActiveSpan(name, async (span) => {
        try {
          const result = await originalMethod.apply(this, args);

          span.setStatus({ code: SpanStatusCode.OK });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return result;
        } catch (error: any) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
          throw error;
        } finally {
          const endTime = performance.now();
          const histogram = CommunityMetrics.getHistogram(`${name}_duration`);
          histogram.record(endTime - startTime, { method: propertyKey });

          span.end();
        }
      });
    };
  };
}
