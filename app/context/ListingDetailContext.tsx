"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ContextProps {
  contactSellerFormVisible: boolean;
  setContactSellerFormVisible: Dispatch<SetStateAction<boolean>>;
}

const ListingDetailContext = createContext<ContextProps>({
  contactSellerFormVisible: false,
  setContactSellerFormVisible: () => false,
});

// @ts-ignore
export const ListigDetailContextProvider = ({ children }) => {
  const [contactSellerFormVisible, setContactSellerFormVisible] =
    useState(false);

  return (
    <ListingDetailContext.Provider
      value={{ contactSellerFormVisible, setContactSellerFormVisible }}
    >
      {children}
    </ListingDetailContext.Provider>
  );
};

export const useListigDetailContext = () => useContext(ListingDetailContext);
