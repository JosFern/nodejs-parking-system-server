import { formatISO } from "date-fns"
import { selectDB } from "../src/lib/database/query"
import { vehicle } from "../src/modules/vehicle"


test('new slot model', () => {
    const id = 'test_vehicle_123'

    const model = new vehicle(id, "J05EL12", 1, "2022-10-01T10:10:34+08:00", "")

    expect(typeof model.id).toBe("string")
    expect(model.plateNo).toBe("J05EL12")
    expect(model.vehicleType).toBe(1)
    expect(model.getTimeIn()).toBe("2022-10-01T10:10:34+08:00")
    expect(model.getTimeOut()).toBe("")

})

test('adding vehicle to db and check', async () => {
    const id = 'test_vehicle_123'

    const model = new vehicle(id, "J05EL12", 1, "2022-10-01T10:10:34+08:00", "")

    const queryVehicle = await selectDB('TestVehicle', `plateNo='J05EL12'`)

    if (queryVehicle.length === 0) {
        await model.insertData()
    }

    const vehicleSelect = await selectDB('TestVehicle', `id='${id}'`)

    if (vehicleSelect.length === 0) {
        expect(vehicleSelect).toStrictEqual([])
    } else {
        expect(typeof vehicleSelect[0].id).toBe("string")
        expect(vehicleSelect[0].plateNo).toBe("J05EL12")
        expect(vehicleSelect[0].vehicleType).toBe(1)
        expect(vehicleSelect[0].timeIn).toBe("2022-10-01T10:10:34+08:00")
        expect(vehicleSelect[0].timeOut).toBe("")
    }

})

test('update vehicle to leave in db and check', async () => {
    const id = 'test_vehicle_123'

    const model = new vehicle(id, "J05EL12", 1, "2022-10-01T10:10:34+08:00", "2022-10-01T12:10:34+08:00")

    await model.updateData()

    const vehicleSelect = await selectDB('TestVehicle', `id='${id}'`)

    expect(typeof vehicleSelect[0].id).toBe("string")
    expect(vehicleSelect[0].plateNo).toBe("J05EL12")
    expect(vehicleSelect[0].vehicleType).toBe(1)
    expect(vehicleSelect[0].timeIn).toBe("2022-10-01T10:10:34+08:00")
    expect(vehicleSelect[0].timeOut).toBe("2022-10-01T12:10:34+08:00")

    const vehicleRemodel = new vehicle(id, "J05EL12", 1, "2022-10-01T10:10:34+08:00", "")

    await vehicleRemodel.updateData() // get back to its original value from insert vehicle test

})

test('delete vehicle to unpark in db and check', async () => {
    const id = 'test_vehicle_123'

    const model = new vehicle(id, "J05EL12", 1, "2022-10-01T10:10:34+08:00", "")

    await model.deleteData()

    const vehicleSelect = await selectDB('TestVehicle', `id='${id}'`)

    expect(vehicleSelect).toStrictEqual([])
})

test('get total payment', async () => {
    const vehicleID = 'test_vehicle_model_123'

    const plateNo = 'FHT64'

    const vehicleModel = new vehicle(vehicleID, plateNo, 2, formatISO(new Date()), "")

    await vehicleModel.insertData()

    const vehicleSelect: any = await selectDB('TestVehicle', `id='${vehicleID}'`)

    const model = new vehicle(
        vehicleSelect[0].id,
        vehicleSelect[0].plateNo,
        vehicleSelect[0].vehicleType,
        vehicleSelect[0].timeIn,
        vehicleSelect[0].timeOut
    )

    const payment = model.calculateTotalPayment(2)//refer from slot L72 from update slot in slot test file

    expect(payment).toBe(40)

    await vehicleModel.deleteData()//deleted after use in order to avoid duplication
})