import "datatables.net-dt/css/jquery.dataTables.css";
import ReactDataTables from "./ReactDataTables.tsx";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const columns = [
  { data: "name", title: "Name" },
  { data: "age", title: "Age" },
  { data: "sex", title: "Sex" },
  { data: "govtIdType", title: "govtIdType" },
  { data: "govtId", title: "govtId" },
  { data: "address", title: "Address" },
  { data: "state", title: "state" },
  { data: "city", title: "City" },
  { data: "country", title: "Country" },
  { data: "pincode", title: "Pincode" },
];

const UserTable = () => {
  const [userData, setUserData] = useState([]);
  const users = useSelector((store: any) => store.user.users);

  useEffect(() => {
    const formattedData = users?.map((user) => {
      return { id: user.id, ...user.personalDetails, ...user.addressDetails };
    });
    setUserData(formattedData);
  }, [users]);

  return <ReactDataTables data={userData} columns={columns} />;
};

export default UserTable;
