import { chain, filter } from "lodash"
import { selectDB } from "../lib/database/query"

export const getAvailableSlot = async (entry: number, car: number) => {

    const slots = await selectDB('Slot')

    const getSlotsEntryPosition = chain(slots)
        .filter((slot) => slot.vehicle === null && car <= slot.type)
        .map(function (slot) {
            return slot.position[entry]
        }).value()

    const nearSlot = filter(slots, (slot) =>
        slot.position[entry] === Math.min(...getSlotsEntryPosition) &&
        slot.vehicle === null &&
        car <= slot.type
    )

    return nearSlot[0].number
}