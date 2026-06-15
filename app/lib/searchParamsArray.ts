type SearchParamsReader = Pick<URLSearchParams, "getAll">;

const parseArrayValue = (value: string): string[] => {
  const trimmed = value.trim();

  if (!trimmed) return [];

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed: unknown = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        const values = parsed.filter(
          (item): item is string => typeof item === "string",
        );

        return values.length === parsed.length
          ? values.filter(Boolean)
          : [value];
      }
    } catch {
      return [value];
    }
  }

  if (trimmed.includes(",")) {
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [value];
};

export const getArraySearchParam = (
  params: SearchParamsReader,
  key: string,
): string[] => {
  return params.getAll(key).flatMap(parseArrayValue);
};

export const appendArraySearchParam = (
  params: URLSearchParams,
  key: string,
  values?: readonly string[] | null,
) => {
  values?.forEach((value) => {
    if (value) params.append(key, value);
  });
};
