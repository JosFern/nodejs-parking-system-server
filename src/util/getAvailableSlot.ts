import { chain, filter, sortBy } from "lodash"
import { selectDB } from "../lib/database/query"

export const getAvailableSlot = async (entry: number, car: number) => {

    const slots: any = await selectDB('Slot')

    const sortedSlots = sortBy(slots, [function (slot) {
        return Number(slot.slotNumber.substring(1))
    }])

    const getSlotsEntryPosition = chain(sortedSlots)
        .filter((slot) => slot.vehicle === "" && car <= slot.slotType)
        .map(function (slot) {
            return slot.slotPosition[entry]
        }).value()

    const nearSlot = filter(slots, (slot) =>
        slot.slotPosition[entry] === Math.min(...getSlotsEntryPosition) &&
        slot.vehicle === "" &&
        car <= slot.slotType
    )
    console.log(nearSlot);

    return nearSlot[0]
}