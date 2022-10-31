import { chain, filter, sortBy } from "lodash"
import { selectDB } from "../lib/database/query"

export const getAvailableSlot = async (entry: string, car: number) => {

    // QUERY SLOTS
    const slots: any = await selectDB('Slot')

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
    console.log(nearSlot);

    //ONLY RETURN THE FIRST MINIMUM SLOT
    return nearSlot[0]
}