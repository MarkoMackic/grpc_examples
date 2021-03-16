module.exports = {
    ENVOY_SOCK_ADDR : process.platform === 'win32' ? 'host.docker.internal' : '0.0.0.0', // don't touch
    ENVOY_PORT : 10001,
    TARGET_PORT : process.env.SERV_PORT ? parseInt(process.env.SERV_PORT) : 5061
}
