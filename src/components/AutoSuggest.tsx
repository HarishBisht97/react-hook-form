import React, { useState, useEffect } from "react";
import { useDebounce } from "../utils/debounce.ts";

const AutoSuggest = ({ register }) => {
  const [country, setCountry] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const debouncedValue = useDebounce(country, 300); // Adjust the delay as needed

  useEffect(() => {
    if (debouncedValue.trim() !== "") {
      fetchCountrySuggestions(debouncedValue);
    } else {
      setSuggestions([]);
    }
  }, [debouncedValue]);

  const fetchCountrySuggestions = async (inputValue) => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${inputValue}`
      );
      const data = await response.json();
      const countrySuggestions = data.map((country) => country.name.common);
      countrySuggestions.length > 1 && setSuggestions(countrySuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setCountry(inputValue);
  };

  const handleSuggestionClick = (suggestion) => {
    setCountry(suggestion);
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        id="country"
        {...register("country")}
        value={country}
        onChange={handleChange}
        placeholder="Type to search..."
      />
      {suggestions.length && (
        <ul className="scrollable-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoSuggest;
