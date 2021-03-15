
const PROTO_PATH = __dirname + '/../../protos/hello.proto';
const SERVER_ADDR = '127.0.0.1';
const SERVER_PORT = parseInt(process.env.PORT) || 5061;

const grpc = require('@grpc/grpc-js');
const grpc_proto_loader = require('@grpc/proto-loader');

const proto_load_opts = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
};

const pDef = grpc_proto_loader.loadSync(PROTO_PATH, proto_load_opts);

let hello_proto = grpc.loadPackageDefinition(pDef);

let call_counter = 0;

const say_hello = function(call, callback)
{
    console.log(call);

    callback(null, {
        message: `Hello : ${call.request.message}`,
        req_number: ++call_counter
    });
}


function main()
{
    var server = new grpc.Server()

    server.addService(hello_proto.Greeter.service, {say_hello})

    server.bindAsync(`${SERVER_ADDR}:${SERVER_PORT}`, grpc.ServerCredentials.createInsecure(), (e) => {
        if(e !== null)
        {
            console.error(e);
            process.exit(1);
        }

        console.log(`Server listening on ${SERVER_ADDR}:${SERVER_PORT}`)
        server.start();
    })
}


main();
