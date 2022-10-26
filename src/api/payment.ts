import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { encryptToken, validateToken } from "../util/genarateToken";
import { selectDB } from "../lib/database/query";
import { vehicle } from "../modules/vehicle";

interface returnMessage {
    code: number
    message: string | any
}

export const paymentRequest = async (req: IncomingMessage) => {
    try {
        let response: returnMessage = { code: 200, message: "" }

        const result = getPathParams(req.url as string, '/vehicle/payment/:id')

        switch (req.method) {
            case 'GET':
                {
                    // QUERY SLOT
                    const vehicles: any = await selectDB('Vehicle', `id='${result.id}'`)

                    if (vehicles.length === 0) return { code: 404, message: "slot not found" }

                    //QUERY SLOT
                    const statement = `vehicle='${result.id}'`

                    const slot = selectDB('Slot', statement)

                    const model = new vehicle(
                        result.id,
                        vehicles[0].plateNo,
                        vehicles[0].vehicleType,
                        vehicles[0].timeIn,
                        vehicles[0].timeOut
                    )

                    const payment = await model.calculateTotalPayment(slot[0].slotType)

                    const jwt = await encryptToken({ payment })

                    response = { ...response, message: jwt }

                    return response
                }
        }
    } catch (err) {
        console.log(err);

    };

}