export const prismaQueryConditionsFromMinMaxValue = (minValue: number | null, maxValue: number | null, valueName: string) => {
    let result = {};

    if (minValue == null && maxValue == null) return result;

    if (minValue != null) result[valueName] = {gte: minValue}

    if (maxValue != null) result[valueName] = {...result[valueName], lte: maxValue}

    return result;
}

export const prismaQueryConditionsFromMinMaxValidDateStringValue = (minValue: string | null, maxValue: string | null, valueName: string) => {
    let result = {};

    if (minValue == null && maxValue == null) return result;

    if (minValue != null) result[valueName] = {gte: new Date(minValue)}

    if (maxValue != null) result[valueName] = {...result[valueName], lte: new Date(maxValue)}

    return result;
}

export const prismaQueryConditionsFromArray = (valueArray, singleValueName) => {
    if (!valueArray) return {};
    let result = {
        OR: [],
    };
    if (valueArray.length === 0) return result;

    if (valueArray.length === 1) {
        result[singleValueName] = valueArray[0];
        return result;
    }

    if (valueArray.length > 1) {
        valueArray.forEach(val => {
            const tempObj = {}
            tempObj[singleValueName] = val;
            result.OR.push(tempObj);
        })
    }

    return result;
}
