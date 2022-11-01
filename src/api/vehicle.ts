import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { encryptToken, validateToken } from "../util/genarateToken";
import { selectDB } from "../lib/database/query";
import { vehicle } from "../modules/vehicle";
import { find, map } from "lodash";

interface returnMessage {
    code: number
    message: string | any
}

export const vehicleRequest = async (req: IncomingMessage) => {
    try {
        let response: returnMessage = { code: 200, message: "" }

        const result = getPathParams(req.url as string, '/vehicle/:id')

        switch (req.method) {
            case 'POST':
                {
                    //DECRYPT DATA
                    const data: any = await getJSONDataFromRequestStream(req)

                    const validateData = await validateToken(data)

                    const { plateNo, vehicleType, timeIn } = validateData

                    //INSERTING VEHICLE DATA
                    const model = new vehicle(undefined, plateNo, vehicleType, timeIn, '')

                    await model.insertData()

                    response = { ...response, code: 201, message: "vehicle successfully created" }

                    return response
                }

            case 'PUT':
                {
                    //DECRYPT DATA
                    const data: any = await getJSONDataFromRequestStream(req)
                    console.log(data);


                    const validateData = await validateToken(data)

                    if (validateData === 401) return { code: 400, message: "decryption error" }

                    const { timeIn, timeOut } = validateData;

                    //QUERY VEHICLE DATA
                    const statement = `id='${result.id}'`

                    const vehicles: any = await selectDB('Vehicle', statement)

                    if (vehicles.length === 0) return { code: 404, message: "vehicle not found" }

                    const model = new vehicle(
                        result.id,
                        vehicles[0].plateNo,
                        vehicles[0].vehicleType,
                        timeIn,
                        timeOut
                    )

                    await model.updateData()

                    response = { ...response, message: "vehicle successfully updated" }

                    return response

                }

            case 'GET':
                {
                    //QUERY VEHICLES
                    const vehicles: any = await selectDB('Vehicle')

                    const slots: any = await selectDB('Slot')

                    const vehicleInfo = map(vehicles, (v) => {
                        const slotInfo = find(slots, { vehicle: v.plateNo })
                        return { ...v, ...slotInfo, vehicleID: v.id }
                    })
                    console.log(vehicleInfo);


                    //ENCRYPT COMPANIES
                    const jwt = await encryptToken(vehicleInfo)

                    response = { ...response, message: jwt }

                    return response
                }

            case 'DELETE':
                {

                    //QUERY VEHICLE DATA
                    const statement = `id='${result.id}'`

                    const vehicles: any = await selectDB('Vehicle', statement)

                    if (vehicles.length === 0) return { code: 404, message: "vehicle not found" }

                    //DELETING VEHICLE DATA
                    const model = new vehicle(
                        result.id,
                        vehicles[0].plateNo,
                        vehicles[0].vehicleType,
                        vehicles[0].timeIn,
                        vehicles[0].timeOut
                    )

                    await model.deleteData()

                    response = { ...response, message: "vehicle successfully deleted" }

                    return response

                }
        }
    } catch (err) {
        console.log(err);

    };

}