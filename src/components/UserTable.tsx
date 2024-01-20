import React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ReactDataTables from "./ReactDataTables.tsx";
import { USER_COLUMNS } from "../utils/constants.ts";

import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";

const UserTable = () => {
  const [userData, setUserData] = useState([]);
  const users = useSelector((store: any) => store.user.users);

  useEffect(() => {
    const formattedData = users?.map((user) => {
      return { id: user.id, ...user.personalDetails, ...user.addressDetails };
    });

    setUserData(formattedData);
  }, [users]);

  return <ReactDataTables data={userData} columns={USER_COLUMNS} />;
};

export default UserTable;
