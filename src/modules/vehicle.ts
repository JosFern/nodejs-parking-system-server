import { includes } from 'lodash';
import { dbOperations } from './dbOperations';
import { v4 as uuidv4 } from 'uuid';
import { differenceInDays, differenceInHours, differenceInMinutes, parseISO } from 'date-fns';

export class vehicle extends dbOperations {
    public readonly id: string
    public readonly plateNo: string
    public readonly vehicleType: number
    private timeIn: string
    private timeOut: string
    private readonly TABLE = "Vehicle"

    constructor(
        id: string | undefined,
        plateNo: string,
        vehicleType: number,
        timeIn: string,
        timeOut: string
    ) {
        super()
        this.id = id === undefined ? uuidv4() : id
        this.plateNo = plateNo
        this.vehicleType = vehicleType
        this.timeIn = timeIn
        this.timeOut = timeOut

        this.assignData({
            id: this.id,
            plateNo: this.plateNo,
            vehicleType: this.vehicleType,
            timeIn: this.timeIn,
            timeOut: this.timeOut,
            TABLE: includes(this.id, "test") ? "TestVehicle" : this.TABLE
        })
    }

    getTimeIn = () => this.timeIn

    getTimeOut = () => this.timeOut

    calculateTotalPayment = async (slotType: number) => {

        const currTime = new Date();

        const dayDiff = differenceInDays(currTime, parseISO(this.timeIn))
        const hoursDiff = differenceInHours(currTime, parseISO(this.timeIn));
        const minutesDiff = differenceInMinutes(currTime, parseISO(this.timeIn)) % 60;

        const flatRate = 40;    //starting rate upon parking

        const fullChunk = 5000; //if vehicle stayed for 24 hours long

        const exceedHrRate = 3; //starts hourly charge if exceeded 3 hours

        const carCharge = slotType === 0 ? 20 : slotType === 1 ? 60 : 100

        let payment = dayDiff > 0 ? dayDiff * fullChunk : flatRate

        if (hoursDiff >= exceedHrRate) payment += (hoursDiff - exceedHrRate) * carCharge

        if (dayDiff > 0) payment = ((hoursDiff - (dayDiff * 24)) * carCharge) + (fullChunk * dayDiff)

        if (hoursDiff >= exceedHrRate && Math.round(minutesDiff / 60) === 1) payment += carCharge

        return payment
    }
}