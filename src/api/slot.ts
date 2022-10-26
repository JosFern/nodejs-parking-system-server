import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../util/generateParams";
import { encryptToken, validateToken } from "../util/genarateToken";
import { selectDB } from "../lib/database/query";
import { slot } from "../modules/slot";
import { getAvailableSlot } from "../util/getAvailableSlot";

interface returnMessage {
    code: number
    message: string | any
}

export const slotRequest = async (req: IncomingMessage) => {
    try {

        let response: returnMessage = { code: 200, message: "" }

        const result = getPathParams(req.url as string, '/slot/:id')

        const query: any = getQueryParams(req)

        switch (req.method) {
            case 'PUT':
                {
                    //DECRYPT DATA
                    const data: any = await getJSONDataFromRequestStream(req)

                    const validateData = await validateToken(data)

                    if (validateData === 400) return { code: 400, message: "decryption error" }

                    const { vehicle, status } = validateData;

                    //QUERY SLOT DATA
                    const statement = `id='${result.id}'`

                    const slots: any = await selectDB('Slot', statement)

                    if (slots.length === 0) return { code: 404, message: "slot not found" }

                    //UPDATING SLOT
                    const model = new slot(
                        result.id,
                        slots[0].slotNumber,
                        slots[0].slotType,
                        vehicle,
                        status
                    )

                    model.updateData()

                    response = { ...response, message: "slot successfully updated" }

                    return response

                }

            case 'GET':
                {

                    if (!query) {
                        //QUERY SLOTS
                        const slots: any = await selectDB('Slot')

                        //ENCRYPT SLOTS
                        const jwt = await encryptToken(slots)

                        response = { ...response, message: jwt }

                        return response

                    } else {

                        const availableSlot = getAvailableSlot(query.entry, query.vehicleType)

                        const jwt = await encryptToken(availableSlot)

                        response = { ...response, message: jwt }

                        return response
                    }

                }
        }
    } catch (err) {
        console.log(err);

    };

}