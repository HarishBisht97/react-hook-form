import React from "react";
import DataTables, { Config } from "datatables.net-dt";
import { useEffect, useRef } from "react";

export function ReactDataTables({ ...props }: Config) {
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const dt = new DataTables(tableRef.current!, props);
    return () => {
      dt.destroy();
    };
  }, [props]);

  return (
    <div className="abc">
      <table ref={tableRef}></table>
    </div>
  );
}

export default ReactDataTables;
