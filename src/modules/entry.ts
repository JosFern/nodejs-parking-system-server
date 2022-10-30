import { find, includes, map } from 'lodash';
import { dbOperations } from './dbOperations';
import { v4 as uuidv4 } from 'uuid';
import { selectDB } from 'src/lib/database/query';
import { slot } from './slot';

export class entry extends dbOperations {
    public readonly id: string
    public readonly entryGate: string
    public readonly entryNumber: number
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

        //GET THE NEAREST SLOT OF THE ENTRY
        const origin = find(slots, { slotNumber: this.nearestSlot })

        map(slots, async (s) => {

            //GET THE UNIT DISTANCE FROM EACH SLOT TO ORIGIN
            //REFER TO THE UNIT DISTANCE FORMULA
            const getUnitDistance = Math.sqrt(
                (origin.slotCoordinates.x - s.slotCoordinates.x) ** 2 +
                (origin.slotCoordinates.y - s.slotCoordinates.y) ** 2
            )

            //ROUND THE UNIT DISTANCE BY 2 DECIMALS
            const rounded = Math.round(getUnitDistance * 100) / 100

            const model = new slot(
                s.id,
                s.slotNumber,
                s.slotType,
                [...s.slotPosition, rounded],
                s.vehicle,
                s.status
            )

            await model.updateData()
        })
    }

}