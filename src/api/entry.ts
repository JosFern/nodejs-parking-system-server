import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream } from "../util/generateParams";
import { encryptToken, validateToken } from "../util/genarateToken";
import { selectDB } from "../lib/database/query";
import { entry } from "../modules/entry";

interface returnMessage {
    code: number
    message: string | any
}

export const entryRequest = async (req: IncomingMessage) => {
    try {
        let response: returnMessage = { code: 200, message: "" }

        switch (req.method) {

            case 'POST':
                {
                    //DECRYPT DATA
                    const data: any = await getJSONDataFromRequestStream(req)

                    const validateData = await validateToken(data)

                    const { entryGate, nearestSlot } = validateData

                    //QUERY ENTRIES
                    const entries: any = await selectDB('Entry')

                    const model = new entry(undefined, entryGate, entries.length, nearestSlot)

                    model.insertData()

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
        }
    } catch (err) {
        console.log(err);

    };

}