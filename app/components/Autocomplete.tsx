import {useRef, useEffect} from "react";

const AutoComplete = () => {
    const autoCompleteRef = useRef();
    const inputRef = useRef();
    const options = {
        componentRestrictions: {country: "bg"},
        fields: ["address_components", "geometry", "icon", "name"],
        types: ["(cities)"]
    };
    useEffect(() => {
        autoCompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
            options
        );
    }, []);
    return (
            // <label>enter address :</label>
            <input ref={inputRef} className={"text-black w-full h-full"}/>
    );
};
export default AutoComplete;