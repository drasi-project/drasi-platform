package drasiexporter

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"github.com/dapr/go-sdk/client"
	"go.opentelemetry.io/collector/component"
	"go.opentelemetry.io/collector/consumer"
	"go.opentelemetry.io/collector/exporter"
	"go.opentelemetry.io/collector/exporter/exporterhelper"
	"go.opentelemetry.io/collector/pdata/pcommon"
	"go.opentelemetry.io/collector/pdata/plog"
	"go.opentelemetry.io/collector/pdata/pmetric"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"os"
	"sort"
	"strings"
	"sync"
)

const (
	// The value of "type" key in configuration.
	typeStr = "drasi"
)

var daprClient client.Client
var pubsubName string
var sourceId string

func init() {
	var err error
	daprClient, err = client.NewClient()
	if err != nil {
		panic(err)
	}

	pubsubName = os.Getenv("PubSub")
	if pubsubName == "" {
		pubsubName = "rg-pubsub"
	}

	sourceId = os.Getenv("SOURCE_ID")
}

var onceWarnLogLevel sync.Once

func NewFactory() exporter.Factory {
	return exporter.NewFactory(
		typeStr,
		createDefaultConfig,
		exporter.WithTraces(createTracesExporter, component.StabilityLevelDevelopment),
		exporter.WithMetrics(createMetricsExporter, component.StabilityLevelDevelopment),
		exporter.WithLogs(createLogsExporter, component.StabilityLevelDevelopment),
	)
}

type Config struct {
}

func createDefaultConfig() component.Config {
	return &Config{}
}

func createTracesExporter(ctx context.Context, set exporter.CreateSettings, config component.Config) (exporter.Traces, error) {
	cfg := config.(*Config)
	exporterLogger := createExporter(cfg)

	return exporterhelper.NewTracesExporter(ctx, set, cfg,
		exporterLogger.pushTraces,
		exporterhelper.WithCapabilities(consumer.Capabilities{MutatesData: false}),
		// Disable Timeout/RetryOnFailure and SendingQueue
		exporterhelper.WithTimeout(exporterhelper.TimeoutSettings{Timeout: 0}),
		exporterhelper.WithRetry(exporterhelper.RetrySettings{Enabled: false}),
		exporterhelper.WithQueue(exporterhelper.QueueSettings{Enabled: false}),
		//exporterhelper.WithShutdown(loggerSync(exporterLogger)),
	)
}

func createMetricsExporter(ctx context.Context, set exporter.CreateSettings, config component.Config) (exporter.Metrics, error) {
	cfg := config.(*Config)
	exporterLogger := createExporter(cfg)

	return exporterhelper.NewMetricsExporter(ctx, set, cfg,
		exporterLogger.pushMetrics,
		exporterhelper.WithCapabilities(consumer.Capabilities{MutatesData: false}),
		// Disable Timeout/RetryOnFailure and SendingQueue
		exporterhelper.WithTimeout(exporterhelper.TimeoutSettings{Timeout: 0}),
		exporterhelper.WithRetry(exporterhelper.RetrySettings{Enabled: false}),
		exporterhelper.WithQueue(exporterhelper.QueueSettings{Enabled: false}),
		//exporterhelper.WithShutdown(loggerSync(exporterLogger)),
	)
}

func createLogsExporter(ctx context.Context, set exporter.CreateSettings, config component.Config) (exporter.Logs, error) {
	cfg := config.(*Config)
	exporterLogger := createExporter(cfg)

	return exporterhelper.NewLogsExporter(ctx, set, cfg,
		exporterLogger.pushLogs,
		exporterhelper.WithCapabilities(consumer.Capabilities{MutatesData: false}),
		// Disable Timeout/RetryOnFailure and SendingQueue
		exporterhelper.WithTimeout(exporterhelper.TimeoutSettings{Timeout: 0}),
		exporterhelper.WithRetry(exporterhelper.RetrySettings{Enabled: false}),
		exporterhelper.WithQueue(exporterhelper.QueueSettings{Enabled: false}),
		//exporterhelper.WithShutdown(loggerSync(exporterLogger)),
	)
}

func createExporter(cfg *Config) drasiExporter {
	return drasiExporter{}
}

type drasiExporter struct {
}

func (s *drasiExporter) pushTraces(_ context.Context, td ptrace.Traces) error {
	//todo
	return nil
}

func (s *drasiExporter) pushMetrics(_ context.Context, md pmetric.Metrics) error {
	var err error
	for i := 0; i < md.ResourceMetrics().Len(); i++ {
		for j := 0; j < md.ResourceMetrics().At(i).ScopeMetrics().Len(); j++ {
			resource := md.ResourceMetrics().At(i).Resource()
			scope := md.ResourceMetrics().At(i).ScopeMetrics().At(j).Scope()
			for k := 0; k < md.ResourceMetrics().At(i).ScopeMetrics().At(j).Metrics().Len(); k++ {
				met := md.ResourceMetrics().At(i).ScopeMetrics().At(j).Metrics().At(k)
				if met.Type() == pmetric.MetricTypeGauge {
					var data = generateMessages(met.Name(), resource, scope, met.Gauge().DataPoints())
					err = publishChanges(data)
					if err != nil {
						return err
					}
				}

				if met.Type() == pmetric.MetricTypeSum {
					var data = generateMessages(met.Name(), resource, scope, met.Sum().DataPoints())
					err = publishChanges(data)
					if err != nil {
						return err
					}
				}
			}
		}
	}

	return nil
}

func (s *drasiExporter) pushLogs(_ context.Context, ld plog.Logs) error {
	//todo
	return nil
}

func generateMessages(name string, resource pcommon.Resource, scope pcommon.InstrumentationScope, datapoints pmetric.NumberDataPointSlice) []map[string]any {
	var results []map[string]any

	for dpi := 0; dpi < datapoints.Len(); dpi++ {
		datapoint := datapoints.At(dpi)

		result := make(map[string]any)
		result["op"] = "u"
		payload := make(map[string]any)
		source := make(map[string]any)
		before := make(map[string]any)
		after := make(map[string]any)
		props := make(map[string]any)
		result["ts_ms"] = datapoint.Timestamp().AsTime().UnixMilli()

		source["db"] = "otel"
		source["table"] = "node"
		source["lsn"] = 0
		source["ts_ms"] = datapoint.Timestamp().AsTime().UnixMilli()
		source["ts_sec"] = datapoint.Timestamp().AsTime().UnixMilli() / 1000

		resource.Attributes().Range(func(k string, v pcommon.Value) bool {
			props[strings.Replace(k, ".", "_", -1)] = v.AsString()
			return true
		})

		scope.Attributes().Range(func(k string, v pcommon.Value) bool {
			props[strings.Replace(k, ".", "_", -1)] = v.AsString()
			return true
		})

		datapoint.Attributes().Range(func(k string, v pcommon.Value) bool {
			props[strings.Replace(k, ".", "_", -1)] = v.AsString()
			return true
		})

		after["id"] = hashAttr(resource.Attributes().AsRaw()) + "_" + name
		props["name"] = name
		props["scope"] = scope.Name()

		switch datapoint.ValueType() {
		case pmetric.NumberDataPointValueTypeDouble:
			props["value"] = datapoint.DoubleValue()
			break
		case pmetric.NumberDataPointValueTypeInt:
			props["value"] = datapoint.IntValue()
		}

		after["labels"] = []string{"Gauge"}
		after["properties"] = props
		payload["source"] = source
		payload["before"] = before
		payload["after"] = after
		result["payload"] = payload
		results = append(results, result)
	}

	return results
}

func hashAttr(attr map[string]any) string {
	h := sha1.New()

	keys := make([]string, 0, len(attr))
	for key := range attr {
		keys = append(keys, key)
	}

	sort.Strings(keys)

	for _, k := range keys {
		h.Write([]byte(k))
		v, _ := json.Marshal(attr[k])
		h.Write(v)
	}

	sha1_hash := hex.EncodeToString(h.Sum(nil))

	return sha1_hash
}

func publishChanges(changes []map[string]any) error {
	return daprClient.PublishEvent(context.TODO(), pubsubName, sourceId+"-change", changes)
}
