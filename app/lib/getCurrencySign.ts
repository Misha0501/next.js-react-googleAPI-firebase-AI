import { CurrencyType } from "@/types";

/**
 * Returns the corresponding currency sign for the given currency type.
 *
 * @param {CurrencyType | undefined} currency - The currency type for which the sign is to be returned.
 * Supported currency types include EUR, USD, and BGN.
 *
 * @returns {string} The currency sign for the given currency type.
 * If the currency type is not recognized or not provided, returns an empty string.
 *
 * @example
 * const currencySign = getCurrencySign("USD"); // returns "$"
 * const unknownCurrencySign = getCurrencySign("XYZ"); // returns ""
 *
 */
export const getCurrencySign = (currency: CurrencyType | undefined) => {
  if(!currency) return "";
  switch (currency) {
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "BGN":
      return "лв.";
    default:
      return "";
  }
};
