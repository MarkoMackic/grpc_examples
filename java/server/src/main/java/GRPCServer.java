import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.stub.StreamObserver;

import java.io.IOException;

public class GRPCServer {

    private static int reqNumber = 0;

    private static class Greet extends GreeterGrpc.GreeterImplBase
    {
        @Override
        public void sayHello(Hello.Req request, StreamObserver<Hello.Res> responseObserver) {

            // example of blocking a thread ( conclusion: works fine )
            try
            {
                Thread.sleep(10000);
            }
            catch (InterruptedException e)
            {
                Thread.currentThread().interrupt();
            }

            Hello.Res res = Hello.Res.newBuilder().setReqNumber(++reqNumber).setMessage("SERVER RESP: " + request.getMessage()).build();

            responseObserver.onNext(res);
            responseObserver.onCompleted();
        }
    }

    public static void main(String[] args) {

        int port = System.getenv("PORT") == null ? 5061 : Integer.parseInt(System.getenv("PORT"));

        try
        {
            Server server = ServerBuilder
                    .forPort(port)
                    .addService(new Greet())
                    .build().start();

            System.out.printf("Server listening on : %d\n", port);

            server.awaitTermination();
        }
        catch (IOException e)
        {
            System.err.println(e.getMessage());
            System.exit(1);
        }
        catch (InterruptedException e)
        {
            Thread.currentThread().interrupt();
        }
    }

}
