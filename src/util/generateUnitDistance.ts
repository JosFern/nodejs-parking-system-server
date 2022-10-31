

export const generateUnitDistance = (x1: number, x2: number, y1: number, y2: number) => {

    //GET THE UNIT DISTANCE FROM EACH SLOT TO ORIGIN
    //REFER TO THE UNIT DISTANCE FORMULA
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

    //ROUND THE UNIT DISTANCE BY 2 DECIMALS
    const rounded = Math.round(distance * 100) / 100

    return rounded
}