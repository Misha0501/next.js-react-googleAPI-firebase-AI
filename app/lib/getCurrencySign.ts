import { CurrencyType } from "@/types";

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
