import { slot } from "../src/modules/slot"


test('new slot model', () => {
    const id = 'test_slot_123'

    const model = new slot(id, "testSlot1", 0, [1, 4, 6], "test_vehicle_model_123", "occupied")

    expect(typeof model.id).toBe("string")
    expect(model.slotNumber).toBe("testSlot1")
    expect(model.slotType).toBe(0)
    expect(model.getSlotPosition()).toStrictEqual([1, 4, 6])
    expect(model.getVehicle()).toBe("test_vehicle_model_123")
    expect(model.getStatus()).toBe("occupied")

})