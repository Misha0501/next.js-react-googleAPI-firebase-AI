/**
 * Helper function to generate prisma query conditions from min and max value
 * @param minValue
 * @param maxValue
 * @param valueName
 */
export const prismaQueryConditionsFromMinMaxValue = (
  minValue: number | null | undefined,
  maxValue: number | null | undefined,
  valueName: string,
) => {
  const result: Record<string, unknown> = {};

  if (minValue == null && maxValue == null) return result;

  if (minValue != null) result[valueName] = { gte: minValue };

  if (maxValue != null)
    result[valueName] = { ...(result[valueName] as object), lte: maxValue };

  return result;
};

/**
 * Helper function to generate prisma query conditions from min and max date string values
 * @param minValue
 * @param maxValue
 * @param valueName
 */
export const prismaQueryConditionsFromMinMaxValidDateStringValue = (
  minValue: string | null | undefined,
  maxValue: string | null | undefined,
  valueName: string,
) => {
  const result: Record<string, unknown> = {};

  if (minValue == null && maxValue == null) return result;

  if (minValue != null) result[valueName] = { gte: new Date(minValue) };

  if (maxValue != null)
    result[valueName] = {
      ...(result[valueName] as object),
      lte: new Date(maxValue),
    };

  return result;
};

/**
 * Helper function to generate prisma query conditions from aray of values
 * @param valueArray
 * @param singleValueName
 * @param isNumber
 */
export const prismaQueryConditionsFromArray = (
  valueArray: (string | number)[] | undefined,
  singleValueName: string,
  isNumber = false,
) => {
  if (!valueArray) return {};
  const orConditions: Record<string, unknown>[] = [];
  const result: Record<string, unknown> = { OR: orConditions };
  if (valueArray.length === 0) return result;

  if (valueArray.length === 1) {
    const singleResult: Record<string, unknown> = {};
    singleResult[singleValueName] = isNumber
      ? Number(valueArray[0])
      : valueArray[0];
    return singleResult;
  }

  valueArray.forEach((val) => {
    const tempObj: Record<string, unknown> = {};
    tempObj[singleValueName] = isNumber ? Number(val) : val;
    orConditions.push(tempObj);
  });

  return result;
};
