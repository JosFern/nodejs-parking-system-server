import { generateUnitDistance } from "../src/util/generateUnitDistance"
import { selectDB } from "../src/lib/database/query"
import { entry } from "../src/modules/entry"


test('new entry model', () => {
    const id = 'test_entry_123'

    const model = new entry(id, "D", 0, "L71")

    expect(typeof model.id).toBe("string")
    expect(model.entryGate).toBe("D")
    expect(model.entryNumber).toBe(0)
    expect(model.nearestSlot).toBe("L71")
})

test('add new entry and check in db', async () => {
    const id = "test_entry_123"

    const model = new entry(id, "D", 0, "L71")

    await model.insertData()

    const entryQuery = await selectDB('TestEntry', `id='${id}'`)

    expect(typeof entryQuery[0].id).toBe("string")
    expect(entryQuery[0].entryGate).toBe('D')
    expect(entryQuery[0].entryNumber).toBe(0)
    expect(entryQuery[0].nearestSlot).toBe("L71")
})

test('delete entry and check in db', async () => {
    const id = "test_entry_123"

    const entryQuery: any = await selectDB('TestEntry', `id='${id}'`)

    const model = new entry(
        entryQuery[0].id,
        entryQuery[0].entryGate,
        entryQuery[0].entryNumber,
        entryQuery[0].nearestSlot
    )

    await model.deleteData()

    const modelQuery: any = await selectDB('TestEntry', `id='${id}'`)

    expect(modelQuery).toStrictEqual([])
})

test('test unit distances function', async () => {
    //GET ENTRY 'A' DATA
    const entries = await selectDB('TestEntry', `entryGate='A'`)

    const entryNearestSlot = entries[0].nearestSlot

    const slotQuery: any = await selectDB('TestSlot', `slotNumber='${entryNearestSlot}'`)

    const originCoordinates = slotQuery[0].slotCoordinates

    //REFER SLOT FROM L80
    const unitDistanceToL80 = generateUnitDistance(
        10,
        originCoordinates.x,//x=1
        1,
        originCoordinates.y//y=5
    )

    expect(unitDistanceToL80).toBe(9.85)

    //REFER SLOT FROM L71
    const unitDistanceToL71 = generateUnitDistance(
        1,
        originCoordinates.x,//x=1
        1,
        originCoordinates.y//y=5
    )

    expect(unitDistanceToL71).toBe(4)

    //REFER SLOT FROM S1
    const unitDistanceToS1 = generateUnitDistance(
        1,
        originCoordinates.x,//x=1
        8,
        originCoordinates.y//y=5
    )

    expect(unitDistanceToS1).toBe(3)


})