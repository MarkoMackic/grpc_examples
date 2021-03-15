const PROTO_PATH = __dirname + '/../../protos/hello.proto';

const argv = require("minimist")(process.argv.slice(2));
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

const hello_proto = grpc.loadPackageDefinition(pDef);

function main()
{
    if(!argv.target)
    {
        console.error("--target must be specified");
        process.exit(1);
    }

    const client_service = new hello_proto.Greeter(argv.target, grpc.credentials.createInsecure());

    client_service.say_hello({message: 'Hello from client'}, function(err, response){
        if(err !== null)
        {
            console.error(err);
            process.exit(1);
        }

        console.log(response);
    });
}

main();
