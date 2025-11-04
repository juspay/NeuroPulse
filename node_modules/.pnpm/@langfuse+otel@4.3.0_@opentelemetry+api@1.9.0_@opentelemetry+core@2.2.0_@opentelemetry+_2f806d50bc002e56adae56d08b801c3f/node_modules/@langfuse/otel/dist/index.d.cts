import { ReadableSpan, SpanExporter, SpanProcessor, Span } from '@opentelemetry/sdk-trace-base';

/**
 * Function type for masking sensitive data in spans before export.
 *
 * @param params - Object containing the data to be masked
 * @param params.data - The data that should be masked
 * @returns The masked data (can be of any type)
 *
 * @example
 * ```typescript
 * const maskFunction: MaskFunction = ({ data }) => {
 *   if (typeof data === 'string') {
 *     return data.replace(/password=\w+/g, 'password=***');
 *   }
 *   return data;
 * };
 * ```
 *
 * @public
 */
type MaskFunction = (params: {
    data: any;
}) => any;
/**
 * Function type for determining whether a span should be exported to Langfuse.
 *
 * @param params - Object containing the span to evaluate
 * @param params.otelSpan - The OpenTelemetry span to evaluate
 * @returns `true` if the span should be exported, `false` otherwise
 *
 * @example
 * ```typescript
 * const shouldExportSpan: ShouldExportSpan = ({ otelSpan }) => {
 *   // Only export spans that took longer than 100ms
 *   return otelSpan.duration[0] * 1000 + otelSpan.duration[1] / 1000000 > 100;
 * };
 * ```
 *
 * @public
 */
type ShouldExportSpan = (params: {
    otelSpan: ReadableSpan;
}) => boolean;
/**
 * Configuration parameters for the LangfuseSpanProcessor.
 *
 * @public
 */
interface LangfuseSpanProcessorParams {
    /**
     * Custom OpenTelemetry span exporter. If not provided, a default OTLP exporter will be used.
     */
    exporter?: SpanExporter;
    /**
     * Langfuse public API key. Can also be set via LANGFUSE_PUBLIC_KEY environment variable.
     */
    publicKey?: string;
    /**
     * Langfuse secret API key. Can also be set via LANGFUSE_SECRET_KEY environment variable.
     */
    secretKey?: string;
    /**
     * Langfuse instance base URL. Can also be set via LANGFUSE_BASE_URL environment variable.
     * @defaultValue "https://cloud.langfuse.com"
     */
    baseUrl?: string;
    /**
     * Number of spans to batch before flushing. Can also be set via LANGFUSE_FLUSH_AT environment variable.
     */
    flushAt?: number;
    /**
     * Flush interval in seconds. Can also be set via LANGFUSE_FLUSH_INTERVAL environment variable.
     */
    flushInterval?: number;
    /**
     * Function to mask sensitive data in spans before export.
     */
    mask?: MaskFunction;
    /**
     * Function to determine whether a span should be exported to Langfuse.
     */
    shouldExportSpan?: ShouldExportSpan;
    /**
     * Environment identifier for the traces. Can also be set via LANGFUSE_TRACING_ENVIRONMENT environment variable.
     */
    environment?: string;
    /**
     * Release identifier for the traces. Can also be set via LANGFUSE_RELEASE environment variable.
     */
    release?: string;
    /**
     * Request timeout in seconds. Can also be set via LANGFUSE_TIMEOUT environment variable.
     * @defaultValue 5
     */
    timeout?: number;
    /**
     * Additional HTTP headers to include with requests.
     */
    additionalHeaders?: Record<string, string>;
    /**
     * Span export mode to use.
     *
     * - **batched**: Recommended for production environments with long-running processes.
     *   Spans are batched and exported in groups for optimal performance.
     * - **immediate**: Recommended for short-lived environments such as serverless functions.
     *   Spans are exported immediately to prevent data loss when the process terminates / is frozen.
     *
     * @defaultValue "batched"
     */
    exportMode?: "immediate" | "batched";
}
/**
 * OpenTelemetry span processor for sending spans to Langfuse.
 *
 * This processor extends the standard BatchSpanProcessor to provide:
 * - Automatic batching and flushing of spans to Langfuse
 * - Media content extraction and upload from base64 data URIs
 * - Data masking capabilities for sensitive information
 * - Conditional span export based on custom logic
 * - Environment and release tagging
 *
 * @example
 * ```typescript
 * import { NodeSDK } from '@opentelemetry/sdk-node';
 * import { LangfuseSpanProcessor } from '@langfuse/otel';
 *
 * const sdk = new NodeSDK({
 *   spanProcessors: [
 *     new LangfuseSpanProcessor({
 *       publicKey: 'pk_...',
 *       secretKey: 'sk_...',
 *       baseUrl: 'https://cloud.langfuse.com',
 *       environment: 'production',
 *       mask: ({ data }) => {
 *         // Mask sensitive data
 *         return data.replace(/api_key=\w+/g, 'api_key=***');
 *       }
 *     })
 *   ]
 * });
 *
 * sdk.start();
 * ```
 *
 * @public
 */
declare class LangfuseSpanProcessor implements SpanProcessor {
    private pendingEndedSpans;
    private publicKey?;
    private baseUrl?;
    private environment?;
    private release?;
    private mask?;
    private shouldExportSpan?;
    private apiClient;
    private processor;
    private mediaService;
    /**
     * Creates a new LangfuseSpanProcessor instance.
     *
     * @param params - Configuration parameters for the processor
     *
     * @example
     * ```typescript
     * const processor = new LangfuseSpanProcessor({
     *   publicKey: 'pk_...',
     *   secretKey: 'sk_...',
     *   environment: 'staging',
     *   flushAt: 10,
     *   flushInterval: 2,
     *   mask: ({ data }) => {
     *     // Custom masking logic
     *     return typeof data === 'string'
     *       ? data.replace(/secret_\w+/g, 'secret_***')
     *       : data;
     *   },
     *   shouldExportSpan: ({ otelSpan }) => {
     *     // Only export spans from specific services
     *     return otelSpan.name.startsWith('my-service');
     *   }
     * });
     * ```
     */
    constructor(params?: LangfuseSpanProcessorParams);
    private get logger();
    /**
     * Called when a span is started. Adds environment and release attributes to the span.
     *
     * @param span - The span that was started
     * @param parentContext - The parent context
     *
     * @override
     */
    onStart(span: Span, parentContext: any): void;
    /**
     * Called when a span ends. Processes the span for export to Langfuse.
     *
     * This method:
     * 1. Checks if the span should be exported using the shouldExportSpan function
     * 2. Applies data masking to sensitive attributes
     * 3. Handles media content extraction and upload
     * 4. Logs span details in debug mode
     * 5. Passes the span to the parent processor for export
     *
     * @param span - The span that ended
     *
     * @override
     */
    onEnd(span: ReadableSpan): void;
    private flush;
    /**
     * Forces an immediate flush of all pending spans and media uploads.
     *
     * @returns Promise that resolves when all pending operations are complete
     *
     * @override
     */
    forceFlush(): Promise<void>;
    /**
     * Gracefully shuts down the processor, ensuring all pending operations are completed.
     *
     * @returns Promise that resolves when shutdown is complete
     *
     * @override
     */
    shutdown(): Promise<void>;
    private processEndedSpan;
    private applyMaskInPlace;
    private applyMask;
}

export { LangfuseSpanProcessor, type LangfuseSpanProcessorParams, type MaskFunction, type ShouldExportSpan };
