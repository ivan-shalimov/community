import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { TypeormInstrumentation } from '@opentelemetry/instrumentation-typeorm';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';

// Configure the SDK to send data to the OTEL Collector
const sdk = new NodeSDK({
  serviceName: 'community-service',
  traceExporter: new OTLPTraceExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
  }),
  logRecordProcessor: new BatchLogRecordProcessor(new OTLPLogExporter()),
  instrumentations: [
    getNodeAutoInstrumentations(), // Handles general HTTP/Express
    new NestInstrumentation(),
    new TypeormInstrumentation({
      enhancedDatabaseReporting: true,
      suppressInternalInstrumentation: true,
    }),
  ],
});

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error));
});

export default sdk;
