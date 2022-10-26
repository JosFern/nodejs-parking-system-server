import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { encryptToken, validateToken } from "../util/genarateToken";

interface returnMessage {
    code: number
    message: string | any
}

export const paymentRequest = async (req: IncomingMessage) => {
    try {
        let response: returnMessage = { code: 200, message: "" }

        const result = getPathParams(req.url as string, '/slot/:id')

        switch (req.method) {
            case 'PUT':
                {
                    //DECRYPT DATA
                    const data: any = await getJSONDataFromRequestStream(req)

                    const validateData = await validateToken(data)

                    if (validateData === 401) return { code: 400, message: "decryption error" }

                    const { vehicle, status } = validateData;

                    //QUERY SLOT DATA
                    const statement = `id='${result.id}'`


                }

            case 'GET':
                {

                }
        }
    } catch (err) {
        console.log(err);

    };

}