import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { encryptToken, validateToken } from "../util/genarateToken";
import { selectDB } from "../lib/database/query";
import { entry } from "../modules/entry";

interface returnMessage {
    code: number
    message: string | any
}

export const entryRequest = async (req: IncomingMessage) => {
    try {

        const result = getPathParams(req.url as string, '/slot/:id')

        let response: returnMessage = { code: 200, message: "" }

        switch (req.method) {

            case 'POST':
                {
                    //DECRYPT DATA
                    const data: any = await getJSONDataFromRequestStream(req)

                    // const validateData = await validateToken(data)

                    const { entryGate, nearestSlot } = data

                    //QUERY ENTRIES
                    const entryQuery: any = await selectDB('Entry', `entryGate='${entryGate}'`)

                    if (entryQuery.length > 0) return { code: 409, message: "entry gate already exist" }

                    const model = new entry(undefined, entryGate, 0, nearestSlot)

                    await model.insertData()

                    await model.updateSlots()

                    response = { ...response, code: 201, message: 'entry successfully added' }

                    return response
                }

            case 'GET':
                {
                    // QUERY ENTRIES
                    const entries: any = await selectDB('Entry')

                    const jwt = await encryptToken(entries)

                    response = { ...response, message: jwt }

                    return response
                }

            case 'DELETE':
                {
                    //QUERY ENTRY
                    const entryQuery: any = await selectDB('Entry', `id='${result.id}'`)

                    if (entryQuery.length === 0) return { code: 404, message: "entry not found" }

                    //DELETING ENTRY DATA
                    const model = new entry(
                        result.id,
                        entryQuery[0].entryGate,
                        entryQuery[0].entryNumber,
                        entryQuery[0].nearestSlot
                    )

                    await model.deleteData()

                    response = { ...response, message: "entry successfully deleted" }

                    return response
                }
        }
    } catch (err) {
        console.log(err);

    };

}