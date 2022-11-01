import { find, includes, map, sortBy } from 'lodash';
import { dbOperations } from './dbOperations';
import { v4 as uuidv4 } from 'uuid';
import { selectDB } from '../lib/database/query';
import { slot } from './slot';
import { generateUnitDistance } from '../util/generateUnitDistance';

export class entry extends dbOperations {
    public readonly id: string
    public readonly entryGate: string
    public readonly entryNumber: number // NOT USED ANYMORE SINCE UPDATED //REPLACED BY entryGate
    public readonly nearestSlot: string
    private readonly TABLE = "Entry"

    constructor(
        id: string | undefined,
        entryGate: string,
        entryNumber: number,
        nearestSlot: string,
    ) {
        super()
        this.id = id === undefined ? uuidv4() : id
        this.entryGate = entryGate
        this.entryNumber = entryNumber
        this.nearestSlot = nearestSlot

        this.assignData({
            id: this.id,
            entryGate: this.entryGate,
            entryNumber: this.entryNumber,
            nearestSlot: this.nearestSlot,
            TABLE: includes(this.id, "test") ? "TestEntry" : this.TABLE
        })
    }

    updateSlots = async () => {

        //QUERY SLOTS
        const slots: any = await selectDB('Slot')

        //SORT SLOTS BY SLOTNUMBER
        const sortedSlots = sortBy(slots, [function (slot) {
            return Number(slot.slotNumber.substring(1))
        }])

        //GET THE NEAREST SLOT OF THE ENTRY
        const origin = find(sortedSlots, { slotNumber: this.nearestSlot })

        map(sortedSlots, async (s) => {

            //GET THE UNIT DISTANCE FROM EACH SLOT TO ORIGIN
            const unitDistance = generateUnitDistance(
                s.slotCoordinates.x,
                origin.slotCoordinates.x,
                s.slotCoordinates.y,
                origin.slotCoordinates.y
            )

            //ADD NEW DATA TO THE CURRENT SLOT
            const model = new slot(
                s.id,
                s.slotNumber,
                s.slotType,
                s.slotCoordinates,
                [...s.slotPosition],
                { ...s.entryDistance, [this.entryGate]: unitDistance },
                s.vehicle,
                s.status
            )

            // console.log(model.slotNumber, model.slotCoordinates, model.getEntryDistance());

            //UPDATE SLOT
            await model.updateData()
        })
    }

}