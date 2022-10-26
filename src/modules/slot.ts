import { includes } from 'lodash';
import { dbOperations } from './dbOperations';
import { v4 as uuidv4 } from 'uuid';

export class slot extends dbOperations {
    private readonly id: string
    private readonly slotNumber: string
    private readonly slotType: number
    private vehicle: string
    private status: "available" | "occupied" | "leave"
    private readonly TABLE = "Slot"

    constructor(
        id: string,
        slotNumber: string,
        slotType: number,
        vehicle: string,
        status: "available" | "occupied" | "leave"
    ) {
        super()
        this.id = id === undefined ? uuidv4() : id
        this.slotNumber = slotNumber
        this.slotType = slotType
        this.vehicle = vehicle
        this.status = status

        this.assignData({
            id: this.id,
            slotNumber: this.slotNumber,
            vehicle: this.vehicle,
            slotType: this.slotType,
            status: this.status,
            TABLE: includes(this.id, "test") ? "TestSlot" : this.TABLE
        })
    }
}