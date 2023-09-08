"use client";
import { PropertyTypeFilter } from "@/app/components/PropertyTypeFilter";
import { useEffect, useRef, useState } from "react";
import { useFiltersStore } from "@/store/Filters";
import { FromToFilter } from "@/app/components/FromToFilter";
import { Divider } from "@tremor/react";
import { RadioGroupCustom } from "@/app/components/RadioGroupCustom";
import { useRouter } from "next/navigation";

const propertyTypesInitialState = [
  { dbId: "1", label: "Residential building", checked: false },
  { dbId: "2", label: "Apartment", checked: false },
];

const buildingTypesInitialOptions = [
  { dbId: "1", label: "New building", checked: false },
  { dbId: "2", label: "Existing building", checked: false },
];

const NO_MAX = "No max";

const propertyMinPriceBuy = [
  "0",
  "50000",
  "75000",
  "100000",
  "125000",
  "150000",
];
const propertyMaxPriceBuy = [
  "50000",
  "75000",
  "100000",
  "125000",
  "150000",
  NO_MAX,
];
const minRoomsOptions = ["0", "1", "2", "3", "4", "5"];
const maxRoomsOptions = ["1", "2", "3", "4", "5", NO_MAX];
const minBedroomsOptions = ["0", "1", "2", "3", "4", "5"];
const maxBedroomsOptions = ["1", "2", "3", "4", "5", NO_MAX];
const areaLivingMinOptions = [
  "0",
  "50",
  "75",
  "100",
  "125",
  "150",
  "175",
  "200",
  "250",
];
const areaLivingMaxOptions = [
  "50",
  "75",
  "100",
  "125",
  "150",
  "175",
  "200",
  "250",
  NO_MAX,
];

const areaLandMinOptions = [
  "0",
  "100",
  "150",
  "200",
  "250",
  "300",
  "350",
  "400",
  "450",
  "500",
];
const areaLandMaxOptions = [
  "100",
  "150",
  "200",
  "250",
  "300",
  "350",
  "400",
  "450",
  NO_MAX,
];

const now = new Date();
const listedSinceOptions = [
  {
    label: "No preference",
    checked: true,
    value: "noPref",
  },
  {
    label: "Last 24 hours",
    checked: false,
    value: "1",
  },
  {
    label: "3 days",
    checked: false,
    value: "3",
  },
  {
    label: "7 days",
    checked: false,
    value: "7",
  },
  {
    label: "10 days",
    checked: false,
    value: "10",
  },
  {
    label: "30 days",
    checked: false,
    value: "30",
  },
];

export function Filters({ listingType, onListedSinceChange }) {
  const router = useRouter();
  const [propertyTypes, setPropertyTypes] = useState(propertyTypesInitialState);
  const [buildingTypes, setBuildingTypes] = useState(
    buildingTypesInitialOptions
  );
  // const [listedSinceSelected, setListedSinceSelected] = useState(buildingTypesInitialOptions);
  const [listedSince, setListedSince] = useState(null);
  const setPropertyTypesSearchQuery = useFiltersStore(
    (state) => state.setPropertyTypesSearchQuery
  );
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("No max");
  const [roomsMinSelected, setRoomsMinSelected] = useState("0");
  const [roomsMaxSelected, setRoomsMaxSelected] = useState(NO_MAX);
  const [bedroomsMinSelected, setBedroomsMinSelected] = useState("0");
  const [bedroomsMaxSelected, setBedroomsMaxSelected] = useState(NO_MAX);
  const [areaLivingMin, setAreaLivingMin] = useState("0");
  const [areaLivingMax, setAreaLivingMax] = useState(NO_MAX);
  const [areaLandMin, setAreaLandMin] = useState("0");
  const [areaLandMax, setAreaLandMax] = useState(NO_MAX);
  const firstUpdate = useRef(true);
  let searchQuery = ``;

  const handleChangePropertyTypes = (propertyTypes) =>
    setPropertyTypes([...propertyTypes]);
  const handleBuildingTypeChange = (result) => setBuildingTypes([...result]);
  const handleListedSince = (result) => {
    const newQuery = { ...router.query, selectedValue: result };
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
    setListedSince(result);
    onListedSinceChange(result);
  };

  const handleClick = async () => {
    setPropertyTypes([
      { dbId: "1", label: "Residential building", checked: false },
      { dbId: "2", label: "Apartment", checked: false },
    ]);
  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    propertyTypes.forEach((value, index) => {
      if (value.checked) {
        searchQuery += "&propertyTypeId=" + Number(value.dbId);
      }
    });

    let selecteListedSince = listedSinceOptions.find(
      (value, index) => value.checked
    );

    if (selecteListedSince && Number(selecteListedSince.value))
      searchQuery += `&listedSince=${selecteListedSince.value}`;

    if (roomsMaxSelected != NO_MAX)
      searchQuery += `&roomsMax=${roomsMaxSelected}`;
    if (Number(roomsMinSelected))
      searchQuery += `&roomsMin=${roomsMinSelected}`;

    if (bedroomsMaxSelected != NO_MAX)
      searchQuery += `&bedroomsMax=${bedroomsMaxSelected}`;
    if (Number(bedroomsMinSelected))
      searchQuery += `&bedroomsMin=${bedroomsMinSelected}`;

    if (areaLivingMax != NO_MAX)
      searchQuery += `&areaLivingMax=${areaLivingMax}`;
    if (Number(areaLivingMin)) searchQuery += `&areaLivingMin=${areaLivingMin}`;

    if (areaLandMax != NO_MAX) searchQuery += `&areaLandMax=${areaLandMax}`;
    if (Number(areaLandMin)) searchQuery += `&areaLandMin=${areaLandMin}`;

    setPropertyTypesSearchQuery(searchQuery)
      .then(() => {})
      .catch((e) => {
        console.error(e);
      });

    const url = searchQuery ? `listings?${searchQuery}` : `listings`;

    // router.push(url, undefined, { shallow: true });
  }, [
    propertyTypes,
    buildingTypes,
    listedSince,
    minPrice,
    maxPrice,
    roomsMinSelected,
    roomsMaxSelected,
    bedroomsMinSelected,
    bedroomsMaxSelected,
    areaLivingMin,
    areaLivingMax,
    areaLandMin,
    areaLandMax,
  ]);

  return (
    <>
      <p className={"font-bold mb-4"}>Property type</p>
      <PropertyTypeFilter
        filters={propertyTypesInitialState}
        handleChange={handleChangePropertyTypes}
      ></PropertyTypeFilter>
      <Divider />
      <p className={"font-bold mb-4"}>Square meters living area</p>
      <FromToFilter
        initialFrom={areaLivingMin}
        initialTo={areaLivingMax}
        valuesFrom={areaLivingMinOptions}
        valuesTo={areaLivingMaxOptions}
        onChangeFrom={setAreaLivingMin}
        onChangeTo={setAreaLivingMax}
      ></FromToFilter>
      <Divider />
      <p className={"font-bold mb-4"}>Square meters property</p>
      <FromToFilter
        initialFrom={areaLandMin}
        initialTo={areaLandMax}
        valuesFrom={areaLandMinOptions}
        valuesTo={areaLandMaxOptions}
        onChangeFrom={setAreaLandMin}
        onChangeTo={setAreaLandMax}
      ></FromToFilter>
      <Divider />
      <p className={"font-bold mb-4"}>Rooms</p>
      <FromToFilter
        initialFrom={roomsMinSelected}
        initialTo={roomsMaxSelected}
        valuesFrom={minRoomsOptions}
        valuesTo={maxRoomsOptions}
        onChangeFrom={setRoomsMinSelected}
        onChangeTo={setRoomsMaxSelected}
      ></FromToFilter>
      <Divider />
      <p className={"font-bold mb-4"}>Bedrooms</p>
      <FromToFilter
        initialFrom={bedroomsMinSelected}
        initialTo={bedroomsMaxSelected}
        valuesFrom={minBedroomsOptions}
        valuesTo={maxBedroomsOptions}
        onChangeFrom={setBedroomsMinSelected}
        onChangeTo={setBedroomsMaxSelected}
      ></FromToFilter>
      <Divider />
      {/*<p className={"font-bold mb-4"}>Building type</p>*/}
      {/*<PropertyTypeFilter filters={buildingTypes} handleChange={handleBuildingTypeChange}></PropertyTypeFilter>*/}
      {/*<Divider/>*/}
      <p className={"font-bold mb-4"}>Listed since</p>
      <RadioGroupCustom
        options={listedSinceOptions}
        onChange={handleListedSince}
      ></RadioGroupCustom>
      <Divider />
      <button onClick={handleClick}>Click</button>
      {propertyTypes.map((item, index) => (
        <div key={item.dbId} className="flex items-center gap-3">
          <p>{item.label}</p>
          <p>{item.checked ? "yes" : "no"}</p>
        </div>
      ))}
    </>
  );
}
