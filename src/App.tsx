import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AddressDetails from "./components/AddressDetails.tsx";
import UserTable from "./components/UserTable.tsx";
import * as yup from "yup";
import "./index.css";

interface IFormInputs {
  name: string;
  age: string;
  sex: string;
  mobile: string;
  govtIdType: string;
  govtId: string;
}

const isValidIndianMobile = (value: any) => {
  const regex = /^[6-9]\d{9}$/; // Indian mobile numbers start with 6, 7, 8, or 9 and are 10 digits long
  return !value || regex.test(value);
};

const schema = yup.object().shape({
  name: yup
    .string()
    .required("First Name is required")
    .min(3, "Name must be at least 3 characters"),
  age: yup
    .string()
    .required("Age is required")
    .matches(/^\d+$/, "Age must be a positive integer"),
  sex: yup.string().required("Sex is required"),
  mobile: yup
    .string()
    .notRequired()
    .test("isIndianMobile", "Invalid mobile number", isValidIndianMobile),
  govtIdType: yup.string().notRequired().nullable(),
  govtId: yup.string().test("govtIdValidation", "", (value, context) => {
    if (!value) return true;
    const govtIdType = context.parent.govtIdType;

    const validationMessage =
      govtIdType === "Aadhar"
        ? "Invalid Aadhar number"
        : govtIdType === "PAN"
        ? "Invalid PAN number"
        : "Invalid govtId";

    const isValid =
      govtIdType === "Aadhar"
        ? /^[2-9]\d{11}$/.test(value)
        : govtIdType === "PAN"
        ? /^[a-zA-Z0-9]{10}$/.test(value)
        : true;

    if (!isValid) return context.createError({ message: validationMessage });

    return isValid;
  }),
});

function App() {
  const [personalDetails, setPersonalDetails] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInputs) => {
    console.log(data);
    setPersonalDetails(data);
  };
  console.log("errors", errors);

  return (
    <div>
      <div className="registrationForm">
        {!personalDetails && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>First Name</label>
              <input {...register("name")} placeholder="John" />
              {errors?.name && <p>{errors.name.message}</p>}
            </div>
            <div>
              <label>Age</label>
              <input {...register("age")} placeholder="25" />
              {errors?.age && <p>{errors.age.message}</p>}
            </div>
            <div>
              <label>Sex</label>
              <select {...register("sex", { required: true })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors?.sex && <p>{errors.sex.message}</p>}
            </div>
            <div>
              <label>Mobile</label>
              <input
                type="tel"
                placeholder="Mobile number"
                {...register("mobile", {
                  required: true,
                  minLength: 6,
                  maxLength: 12,
                })}
              />
              {errors?.mobile && <p>{errors.mobile.message}</p>}
            </div>
            <div>
              <label>Govt Issued ID Type</label>
              <select {...register("govtIdType")}>
                <option value="">Please select an option</option>
                <option value="Aadhar">Aadhar</option>
                <option value="PAN">PAN</option>
              </select>
              {errors?.govtIdType && <p>{errors.govtIdType.message}</p>}
            </div>
            <div>
              <label>Govt Issued Id</label>
              <input
                {...register("govtId")}
                placeholder="4455 5555 0000 1111"
              />
              {errors?.govtId && <p>{errors.govtId.message}</p>}
            </div>
            <input type="submit" value="Next" />
          </form>
        )}
        {personalDetails && (
          <AddressDetails personalDetails={personalDetails} />
        )}
      </div>
      <UserTable />
    </div>
  );
}

export default App;
