import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../utils/debounce.ts";

import { addUserDetails } from "../redux/registrationSlice.ts";
import { COUNTRY_API_BASE_URL } from "../utils/constants.ts";

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

const AddressDetails = ({ personalDetails, resetFrom, resetFields }) => {
  const [country, setCountry] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const dispatch = useDispatch();

  const debouncedValue = useDebounce(country, 300);

  useEffect(() => {
    if (debouncedValue.trim() !== "") {
      fetchCountrySuggestions(debouncedValue);
    } else {
      setSuggestions([]);
    }
  }, [debouncedValue]);

  const fetchCountrySuggestions = async (inputValue) => {
    try {
      const response = await fetch(COUNTRY_API_BASE_URL + inputValue);
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
    setSuggestions([]);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
  });

  const users = useSelector((store: any) => store.user.users);

  const onSubmit = (addressDetails: AddressFormInputs) => {
    dispatch(
      addUserDetails({
        id: users.length + 1,
        personalDetails,
        addressDetails,
      })
    );
    resetFields();
    resetFrom(true);
  };

  const RenderSuggestions = () => (
    <ul className="scrollable-list">
      {suggestions.map((suggestion, index) => (
        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
          {suggestion}
        </li>
      ))}
    </ul>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="formFields">
        <div className="formField">
          <label>Address</label>
          <input {...register("address")} placeholder="Enter address" />
          {errors?.address && <p>{errors.address.message as string}</p>}
        </div>
        <div className="formField">
          <label>State</label>
          <input {...register("state")} placeholder="Enter state" />
          {errors?.state && <p>{errors.state.message as string}</p>}
        </div>
        <div className="formField">
          <label>City</label>
          <input {...register("city")} placeholder="Enter city" />
          {errors?.city && <p>{errors.city.message as string}</p>}
        </div>
        <div className="formField">
          <label>Country</label>
          <div style={{ position: "relative" }}>
            <input
              {...register("country")}
              value={country}
              onChange={handleChange}
              placeholder="Enter country"
            />
            {suggestions.length > 0 && !suggestions.includes[country] && (
              <RenderSuggestions />
            )}
          </div>
          {errors?.country && <p>{errors.country?.message as string}</p>}
        </div>
        <div className="formField">
          <label>Pincode</label>
          <input {...register("pincode")} placeholder="Enter pincode" />
          {errors?.pincode && <p>{errors.pincode.message as string}</p>}
        </div>
      </div>
      <button className="submitButton" type="submit">
        Submit
      </button>
    </form>
  );
};

export default AddressDetails;
