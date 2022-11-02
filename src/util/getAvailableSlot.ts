import { assign, chain, filter, keys, map, sortBy } from "lodash"
import { selectDB } from "../lib/database/query"

export const getAvailableSlot = async (entry: string, car: number, isTest: boolean = false) => {

    const table = isTest ? 'TestSlot' : 'Slot'

    // QUERY SLOTS
    const slots: any = await selectDB(table)

    //SORT SLOTS BY SLOTNUMBER
    const sortedSlots = sortBy(slots, [function (slot) {
        return Number(slot.slotNumber.substring(1))
    }])


    //GET ALL SLOTS POSITION BY INDEX OF ENTRY
    const getSlotsEntryPosition = chain(sortedSlots)
        .filter((slot) => slot.vehicle === "" && car <= slot.slotType)
        .map(function (slot) {
            return slot.entryDistance[entry]
        }).value()

    //FILTER SLOTS BY MINIMUM OF THE getSlotsEntryPosition
    const nearSlot = filter(sortedSlots, (slot) =>
        slot.entryDistance[entry] === Math.min(...getSlotsEntryPosition) &&
        slot.vehicle === "" &&
        car <= slot.slotType
    )

    //ONLY RETURN THE FIRST MINIMUM SLOT
    return nearSlot[0]
}

export const filterSlots = (slots: any[]) => {
    const sortedSlots = sortBy(slots, [function (slot) {
        return Number(slot.slotNumber.substring(1))
    }])

    const filterSlotsObjects = map(sortedSlots, (s) => {

        const filterSlot = keys(s)
            .filter(key => {
                return !key.includes('Coordinates') &&
                    !key.includes('Position') &&
                    !key.includes('Distance')
            })
            .reduce((cur, key) => { return assign(cur, { [key]: s[key] }) }, {});

        return filterSlot
    })

    return filterSlotsObjects
}