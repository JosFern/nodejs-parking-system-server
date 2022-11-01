import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../util/generateParams";
import { encryptToken, validateToken } from "../util/genarateToken";
import { selectDB } from "../lib/database/query";
import { slot } from "../modules/slot";
import { getAvailableSlot } from "../util/getAvailableSlot";
import { keys, sortBy } from "lodash";

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
            // case 'POST':
            //     {
            //         const data: any = await getJSONDataFromRequestStream(req)

            //         const { slotNumber, slotType, slotPosition } = data

            //         console.log(data);

            //         console.log(req.url);

            //         const model = new slot(undefined, slotNumber, slotType, slotPosition, '', 'available')

            //         model.insertData()

            //         response = { ...response, code: 201, message: "slot successfully created" }

            //         return response
            //     }

            case 'PUT':
                {
                    //DECRYPT DATA
                    const data: any = await getJSONDataFromRequestStream(req)
                    console.log(data);


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
                        slots[0].slotCoordinates,
                        slots[0].slotPosition,
                        slots[0].entryDistance,
                        vehicle,
                        status
                    )

                    await model.updateData()

                    response = { ...response, message: "slot successfully updated" }

                    return response

                }

            case 'GET':
                {

                    if (keys(query).length === 0) {
                        //QUERY SLOTS
                        const slots: any = await selectDB('Slot')

                        const sortedSlots = sortBy(slots, [function (slot) {
                            return Number(slot.slotNumber.substring(1))
                        }])

                        //ENCRYPT SLOTS
                        const jwt = await encryptToken(sortedSlots)

                        response = { ...response, message: jwt }

                        return response

                    } else {

                        //QUERY ENTRY IF EXIST
                        const entryResult = await selectDB('Entry', `entryGate='${query.entry}'`)

                        if (entryResult.length === 0) return { code: 404, message: "entry not found" }

                        const availableSlot = await getAvailableSlot(
                            query.entry,
                            Number(query.vehicleType)
                        )

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