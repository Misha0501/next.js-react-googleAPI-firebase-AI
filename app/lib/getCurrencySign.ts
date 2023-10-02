import { CurrencyType } from "@/types";

export const getCurrencySign = (currency: CurrencyType) => {
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
