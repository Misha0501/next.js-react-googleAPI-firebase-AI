import { CurrencyType } from "@/types";

/**
 * Get the currency sign for a given currency
 * @param currency Currency to get the sign for
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
