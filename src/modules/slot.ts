import { includes } from 'lodash';
import { dbOperations } from './dbOperations';
import { v4 as uuidv4 } from 'uuid';

export class slot extends dbOperations {
    public readonly id: string
    public readonly slotNumber: string
    public readonly slotType: number
    public readonly slotCoordinates: object
    private slotPosition: number[]  //NOT USED ANYMORE SINCE UPDATED //REPLACED BY entryDistance
    private entryDistance: object
    private vehicle: string
    private status: "available" | "occupied" | "leave"
    private readonly TABLE = "Slot"

    constructor(
        id: string | undefined,
        slotNumber: string,
        slotType: number,
        slotCoordinates: object,
        slotPosition: number[],
        entryDistance: object,
        vehicle: string,
        status: "available" | "occupied" | "leave"
    ) {
        super()
        this.id = id === undefined ? uuidv4() : id
        this.slotNumber = slotNumber
        this.slotType = slotType
        this.slotPosition = slotPosition
        this.slotCoordinates = slotCoordinates
        this.entryDistance = entryDistance
        this.vehicle = vehicle
        this.status = status

        this.assignData({
            id: this.id,
            slotNumber: this.slotNumber,
            slotType: this.slotType,
            slotPosition: this.slotPosition,
            slotCoordinates: this.slotCoordinates,
            entryDistance: this.entryDistance,
            vehicle: this.vehicle,
            status: this.status,
            TABLE: includes(this.id, "test") ? "TestSlot" : this.TABLE
        })
    }

    getSlotPosition = () => this.slotPosition

    getVehicle = () => this.vehicle

    getStatus = () => this.status

    getEntryDistance = () => this.entryDistance

}