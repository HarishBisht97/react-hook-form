import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { useDebounce } from "../utils/debounce.ts";

import { addUserDetails } from "../redux/registrationSlice.ts";

interface AddressFormInputs {
  address: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
}

const schema = yup.object().shape({
  address: yup.string().notRequired(),
  state: yup.string().notRequired(),
  city: yup.string().notRequired(),
  country: yup.string().notRequired(),
  pincode: yup.string().notRequired(),
});

const AddressDetails = ({ personalDetails }) => {
  const [country, setCountry] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const dispatch = useDispatch();

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
    setValue("country", suggestion);
    setCountry(suggestion);
    setSuggestions([]); // Clear suggestions after selection
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (addressDetails: AddressFormInputs) => {
    dispatch(
      addUserDetails({
        id: uuidv4(),
        personalDetails,
        addressDetails,
      })
    );
  };
  console.log("errors", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Address</label>
        <input {...register("address")} placeholder="Enter address" />
        {errors?.address && <p>{errors.address.message}</p>}
      </div>
      <div>
        <label>State</label>
        <input {...register("state")} placeholder="Enter state" />
        {errors?.state && <p>{errors.state.message}</p>}
      </div>
      <div>
        <label>City</label>
        <input {...register("city")} placeholder="Enter city" />
        {errors?.city && <p>{errors.city.message}</p>}
      </div>
      <div>
        <label>Country</label>
        <div style={{ position: "relative" }}>
          <input
            {...register("country")}
            value={country}
            onChange={handleChange}
            placeholder="Enter country"
          />
          {suggestions.length && (
            <ul className="scrollable-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors?.country && <p>{errors.country.message}</p>}
      </div>
      <div>
        <label>Pincode</label>
        <input {...register("pincode")} placeholder="Enter pincode" />
        {errors?.pincode && <p>{errors.pincode.message}</p>}
      </div>
      <input type="submit" value="Submit" />
    </form>
  );
};

export default AddressDetails;
