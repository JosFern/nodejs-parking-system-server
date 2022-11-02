import { getAvailableSlot } from "../src/util/getAvailableSlot"
import { slot } from "../src/modules/slot"
import { selectDB } from "../src/lib/database/query"


test('new slot model', () => {
    const id = 'test_slot_123'

    const model = new slot(id, "S1", 0, { x: 1, y: 8 }, [1, 4, 6], { A: 4, B: 5, C: 13 }, "test_vehicle_model_123", "occupied")

    expect(typeof model.id).toBe("string")
    expect(model.slotNumber).toBe("S1")
    expect(model.slotCoordinates).toStrictEqual({ x: 1, y: 8 })
    expect(model.slotType).toBe(0)
    expect(model.getSlotPosition()).toStrictEqual([1, 4, 6])
    expect(model.getEntryDistance()).toStrictEqual({ A: 4, B: 5, C: 13 })
    expect(model.getVehicle()).toBe("test_vehicle_model_123")
    expect(model.getStatus()).toBe("occupied")

})

test('test get available slot', async () => {

    const availableSlot1 = await getAvailableSlot('A', 1, true)

    expect(availableSlot1.slotNumber).toBe("L41")
    expect(typeof availableSlot1.id).toBe("string")
    expect(availableSlot1.slotType).toBe(2)
    expect(availableSlot1.vehicle).toBe('')
    expect(availableSlot1.status).toBe("available")

    //----------------------------------------------------

    const availableSlot2 = await getAvailableSlot('B', 2, true)

    expect(availableSlot2.slotNumber).toBe("L9")
    expect(typeof availableSlot2.id).toBe("string")
    expect(availableSlot2.slotCoordinates).toStrictEqual({ x: 9, y: 8 })
    expect(availableSlot2.slotType).toBe(2)
    expect(availableSlot2.vehicle).toBe('')
    expect(availableSlot2.status).toBe("available")


    //---------------------------------------------------
    const availableSlot3 = await getAvailableSlot('C', 0, true)

    expect(availableSlot3.slotNumber).toBe("L40")
    expect(typeof availableSlot3.id).toBe("string")
    expect(availableSlot3.slotCoordinates).toStrictEqual({ x: 10, y: 5 })
    expect(availableSlot3.slotType).toBe(2)
    expect(availableSlot3.vehicle).toBe('')
    expect(availableSlot3.status).toBe("available")

})

test('update slot to occupy and unoccupy in db and check', async () => {

    const slotID = 'test_fa65-c67a-4ae2-9c73-3dcca545e64f'  //FROM TestSlot

    const slotQuery: any = await selectDB('TestSlot', `id='${slotID}'`)

    const slotModel = new slot(
        slotQuery[0].id,
        slotQuery[0].slotNumber,
        slotQuery[0].slotType,
        slotQuery[0].slotCoordinates,
        slotQuery[0].slotPosition,
        slotQuery[0].entryDistance,
        "FHT64", //VEHICLE FROM get payment TEST IN VEHICLE TEST FILE
        "occupied"
    )

    //OCCUPY SLOT
    await slotModel.updateData()

    const modelQuery: any = await selectDB('TestSlot', `id='${slotID}'`)

    expect(typeof modelQuery[0].id).toBe("string")
    expect(modelQuery[0].vehicle).toBe("FHT64")
    expect(modelQuery[0].status).toBe("occupied")



})

test('unoccupy slot and check in db', async () => {
    //UPDATE BACK TO ITS ORIGINAL STATE // UNOCCUPY SLOT

    const slotID = 'test_fa65-c67a-4ae2-9c73-3dcca545e64f'  //FROM TestSlot

    const slotQuery: any = await selectDB('TestSlot', `id='${slotID}'`)

    const model = new slot(
        slotQuery[0].id,
        slotQuery[0].slotNumber,
        slotQuery[0].slotType,
        slotQuery[0].slotCoordinates,
        slotQuery[0].slotPosition,
        slotQuery[0].entryDistance,
        "",
        "available"
    )

    await model.updateData()

    const remodelQuery: any = await selectDB('TestSlot', `id='${slotID}'`)

    expect(typeof remodelQuery[0].id).toBe("string")
    expect(remodelQuery[0].vehicle).toBe("")
    expect(remodelQuery[0].status).toBe("available")
})