import { Counter, Histogram, ValueType, metrics } from '@opentelemetry/api';

export class CommunityMetrics {
  private static counterCache = new Map<string, Counter>();
  private static histogramCache = new Map<string, Histogram>();

  static getCounter(name: string, description?: string): Counter {
    if (!this.counterCache.has(name)) {
      const meter = metrics.getMeter('community-observability');
      const counter = meter.createCounter(name, {
        description: description || `Counter for ${name}`,
      });
      this.counterCache.set(name, counter);
    }
    return this.counterCache.get(name)!;
  }

  static getHistogram(name: string, description?: string): Histogram {
    if (!this.histogramCache.has(name)) {
      const meter = metrics.getMeter('community-observability');
      const histogram = meter.createHistogram(name, {
        description: description || `Histogram for ${name}`,
        unit: 'ms',
        valueType: ValueType.DOUBLE,
      });
      this.histogramCache.set(name, histogram);
    }
    return this.histogramCache.get(name)!;
  }
}
