import { create } from 'zustand'


// const propertyTypesInitialState = [
//     {dbId: '1', label: 'Residential building', checked: false},
//     {dbId: '2', label: 'Apartment', checked: false}
// ]

export const useFiltersStore = create((set) => ({
    bears: 0,
    propertyTypes: [],
    propertyTypesSearchQuery: {},
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
    setPropertyTypes: async (propertyTypes) => {
        set({ propertyTypes });
    },
    setPropertyTypesSearchQuery: async (propertyTypesSearchQuery) => {
        set({ propertyTypesSearchQuery });
    },
}))