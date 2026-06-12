type NumberLike = number | string | null | undefined;

type FormatEuroPriceOptions = {
  fallback?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

const BULGARIAN_LOCALE = "bg-BG";
const EURO_CURRENCY = "EUR";

const getNumericValue = (value: NumberLike) => {
  if (value === null || value === undefined || value === "") return null;

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
};

export const formatEuroPrice = (
  value: NumberLike,
  {
    fallback = "",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  }: FormatEuroPriceOptions = {},
) => {
  const numericValue = getNumericValue(value);

  if (numericValue === null) return fallback;

  return new Intl.NumberFormat(BULGARIAN_LOCALE, {
    style: "currency",
    currency: EURO_CURRENCY,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numericValue);
};

export const formatEuroPricePerSquareMeter = (value: NumberLike) => {
  const formattedValue = formatEuroPrice(value);

  return formattedValue ? `${formattedValue}/m²` : "";
};

export const formatEuroPriceRange = (
  min: NumberLike,
  max: NumberLike,
  noMaxLabel = "No max",
) => {
  const formattedMin = formatEuroPrice(min, { fallback: "-" });
  const formattedMax =
    max === noMaxLabel ? noMaxLabel : formatEuroPrice(max, { fallback: "-" });

  return `From ${formattedMin} to ${formattedMax}`;
};

export const moneyFormatter = (number: NumberLike) => {
  return formatEuroPrice(number);
};
