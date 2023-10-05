/**
 * Helper function to generate prisma query conditions from min and max value
 * @param minValue
 * @param maxValue
 * @param valueName
 */
export const prismaQueryConditionsFromMinMaxValue = (minValue: number | null | undefined, maxValue: number | null | undefined, valueName: string) => {
    let result: any = {};

    if (minValue == null && maxValue == null) return result;

    if (minValue != null) result[valueName] = {gte: minValue}

    if (maxValue != null) result[valueName] = {...result[valueName], lte: maxValue}

    return result;
}

/**
 * Helper function to generate prisma query conditions from min and max date string values
 * @param minValue
 * @param maxValue
 * @param valueName
 */
export const prismaQueryConditionsFromMinMaxValidDateStringValue = (minValue: string | null | undefined, maxValue: string | null | undefined, valueName: string) => {
    let result: any = {};

    if (minValue == null && maxValue == null) return result;

    if (minValue != null) result[valueName] = {gte: new Date(minValue)}

    if (maxValue != null) result[valueName] = {...result[valueName], lte: new Date(maxValue)}

    return result;
}

/**
 * Helper function to generate prisma query conditions from aray of values
 * @param valueArray
 * @param singleValueName
 * @param isNumber
 */
export const prismaQueryConditionsFromArray = (valueArray: any[] | undefined, singleValueName: string, isNumber = false) => {
    if (!valueArray) return {};
    let result: any = {
        OR: [],
    };
    if (valueArray.length === 0) return result;

    if (valueArray.length === 1) {
        if(isNumber) {
            result[singleValueName] = Number(valueArray[0]);
        } else {
            result[singleValueName] = valueArray[0];
        }
        return result;
    }

    if (valueArray.length > 1) {
        valueArray.forEach((val: any) => {
            const tempObj: any = {}
            if(isNumber) {
                tempObj[singleValueName] = Number(val);
            } else {
                tempObj[singleValueName] = val;
            }
            result.OR.push(tempObj);
        })
    }

    return result;
}
