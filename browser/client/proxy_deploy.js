const cfg = require('./config.js');
const path = require('path');
const execa = require('execa');
const fs = require('fs');

const ENVOY_CFG = `
static_resources:
  listeners:
  - name: listener_0
    address:
      socket_address: { address: 0.0.0.0, port_value: ${cfg.ENVOY_PORT} }
    filter_chains:
    - filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          codec_type: auto
          stat_prefix: ingress_http
          route_config:
            name: local_route
            virtual_hosts:
            - name: local_service
              domains: ["*"]
              routes:
              - match: { prefix: "/" }
                route:
                  cluster: greeter_service
                  max_stream_duration:
                    grpc_timeout_header_max: 0s
              cors:
                allow_origin_string_match:
                - prefix: "*"
                allow_methods: GET, PUT, DELETE, POST, OPTIONS
                allow_headers: keep-alive,user-agent,cache-control,content-type,content-transfer-encoding,custom-header-1,x-accept-content-transfer-encoding,x-accept-response-streaming,x-user-agent,x-grpc-web,grpc-timeout
                max_age: "1728000"
                expose_headers: custom-header-1,grpc-status,grpc-message
          http_filters:
          - name: envoy.filters.http.grpc_web
          - name: envoy.filters.http.cors
          - name: envoy.filters.http.router
  clusters:
  - name: greeter_service
    connect_timeout: 0.25s
    type: logical_dns
    http2_protocol_options: {}
    lb_policy: round_robin
    load_assignment:
      cluster_name: cluster_0
      endpoints:
        - lb_endpoints:
            - endpoint:
                address:
                  socket_address:
                    address: ${cfg.ENVOY_SOCK_ADDR}
                    port_value: ${cfg.TARGET_PORT}
`;

fs.writeFileSync("proxy.yaml", ENVOY_CFG);

const {stdout, stderr} = execa.sync('docker', [
    'run',
    '-d',
    '-v',
    `${path.resolve(__dirname, 'proxy.yaml')}:/etc/envoy/envoy.yaml:ro`,
    ...(['win32', 'darwin'].includes(process.platform) ? [
        '-p',
        `${cfg.ENVOY_PORT}:${cfg.ENVOY_PORT}`,
    ] : ['--network=host']),
    `envoyproxy/envoy:v1.17.0`,
]);

if(!stdout)
{
    console.error("Something's wrong");
    process.exit(1);
}

let cID = stdout;

process.stdin.resume();

function exitHandler(options, exitCode) {
    if (options.cleanup){
        execa.sync('docker', ['rm', '--force', cID])
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
