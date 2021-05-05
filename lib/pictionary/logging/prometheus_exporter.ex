# prometheus_plugs is a two-in-one package.
# It contains both the Prometheus.PlugExporter which you need purely to get the /metrics route to work,
# as well as the pipeline instrumenter, which measures both http_requests_total and http_request_duration_microseconds
# Exporters are used to format logs in a format that prmetheus understands, visit localhost:4000/metrics to see the logs
defmodule Pictionary.Logging.PrometheusExporter do
  use Prometheus.PlugExporter
end
