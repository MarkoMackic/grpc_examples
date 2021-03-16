
const {Req, Res} = require('./_protos/hello_pb.js');
const {GreeterClient} = require('./_protos/hello_grpc_web_pb.js');

let client = new GreeterClient(
    'http://' + window.location.hostname + ':' + process.env.SERV_PORT,
    null,
    null
);

let o_clog = console.log;

console.log = function()
{
    o_clog(...arguments);
    document.getElementById("respCtnr").innerHTML += arguments[0] + "</br>";
}

document.getElementById("sendBtn").onclick = function ()
{
    let r = new Req();
    r.setMessage("Hello from web client + " + document.getElementById("messageFld").value);

    client.say_hello(r, {}, (err, response) => {
    if (err) {
        console.log(`Unexpected error for sayHello: code = ${err.code}` +
            `, message = "${err.message}"`);
    } else {
        console.log(response);
    }
});
}
