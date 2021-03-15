import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

public class GRPCClient {

    private GreeterGrpc.GreeterBlockingStub greeterBlockingStub;

    public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("This program requires server address as argument");
            System.exit(1);
        }

        final String servAddr = args[0];

        ManagedChannel channel = ManagedChannelBuilder.forTarget(servAddr).usePlaintext().build();

        GreeterGrpc.GreeterBlockingStub gBS = GreeterGrpc.newBlockingStub(channel);

        Hello.Req request = Hello.Req.newBuilder().setMessage("Hello from java").build();

        try
        {
            Hello.Res result = gBS.sayHello(request);

            System.out.printf("RPC executed. Message %s, Req number: %s%n", result.getMessage(), result.getReqNumber());
        }
        catch (StatusRuntimeException e)
        {
            System.err.println(e.getMessage());
        }

        try
        {
            channel.shutdown().awaitTermination(10, TimeUnit.SECONDS);
        }
        catch (InterruptedException e)
        {
            System.err.println(e.getMessage());
            Thread.currentThread().interrupt();
        }

    }

}
