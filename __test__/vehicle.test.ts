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