import { createServer, IncomingMessage, ServerResponse } from "http"
import { entryRequest } from "./api/entry"
import { paymentRequest } from "./api/payment"
import { slotRequest } from "./api/slot"
import { vehicleRequest } from "./api/vehicle"

const headers = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
    'Access-Control-Max-Age': 2592000, // 30 days
    'Access-Control-Allow-Headers': 'Authorization',
    'Content-Type': 'application/json'
}

interface returnMessage {
    code: number
    message: string | any
}

const listener = async (req: IncomingMessage, res: ServerResponse) => {
    try {

        let result: returnMessage | any = { code: 200, message: "success" }

        if (req.method === "OPTIONS") {
            res.writeHead(204, headers);
            res.end();
            return;
        }

        if ((req.url as string).match('/slot(.*?)')) {

            result = await slotRequest(req) as string | object
            console.log(JSON.stringify(result));

        }

        if ((req.url as string).match('/vehicle(.*?)')) {

            if ((req.url as string).match('/vehicle/payment(.*?)')) {

                result = await paymentRequest(req) as string | object
                console.log(JSON.stringify(result));

            } else if ((req.url as string).match('/vehicle(.*?)')) {

                result = await vehicleRequest(req) as string | object
                console.log(JSON.stringify(result));

            }

        }

        if ((req.url as string).match('/entry(.*?)')) {

            result = await entryRequest(req) as string | object
            console.log(JSON.stringify(result));

        }

        res.writeHead(result.code, headers)
        res.end(JSON.stringify(result.message))

    } catch (err) {
        console.log(err);

    }
}

const server = createServer(listener)
server.listen(8080)