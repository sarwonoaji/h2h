import { Button } from "react-bootstrap";
import CustomTable from "../../../../../components/TableList";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { bc23Service } from "../../../../../services/support/TPB/BC23/AccessBC23";
import { useEffect, useState } from "react";

const BASE_ROUTE = "/dashboard/tpb/bc23";

interface BC23Item {
  id: string;
  nomorAju: string;
  tanggalAju: string;
  nomorDaftar: string;
  tanggalDaftar: string;
  namaPenerima: string;
  status: string;
  postedBy: string;
}

const BC23View = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<BC23Item[]>([]);

  useEffect(() => {
  const fetchData = async () => {
    const result = await bc23Service.getTPB(); // ini sudah array

    const mapped: BC23Item[] = result.data.map((item: any) => ({
      id: item.Id?.toString() ?? "",
      nomorAju: item.nomorAju ?? "",
      tanggalAju: item.tanggalAju ?? "",
      nomorDaftar: item.nomorDaftar ?? "",
      tanggalDaftar: item.tanggalDaftar ?? "",
      namaPenerima: item.namaPenerima ?? "",
      status: item.isPosted ? "Sudah Posting" : "Belum Posting",
      postedBy: item.postedBy ?? "",
    }));

    setData(mapped);
  };

  fetchData();
}, []);

  return (
    <CustomTable<BC23Item>
      title="List BC 2.3"
      containerStyle={{ background: "#f9fafc" }}
      titleStyle={{ fontWeight: 500, fontSize: 18 }}
      headerStyle={{ paddingBottom: 10, marginBottom: 0 }}
      actionContainerStyle={{ gap: 15 }}
      tableStyle={{ fontSize: 12, marginBottom: 0 }}
      striped={false}
      bordered={false}
      columns={[
        {
          header: "Nomor Aju",
          accessor: "nomorAju",
          thStyle: { background: "#f1f3f5" },
        },
        {
          header: "Tanggal Aju",
          accessor: "tanggalAju",
          thStyle: { background: "#f1f3f5" },
        },
        {
          header: "Nomor Daftar",
          accessor: "nomorDaftar",
          thStyle: { background: "#f1f3f5" },
        }
        ,
        {
          header: "Tanggal Daftar",
          accessor: "tanggalDaftar",
          thStyle: { background: "#f1f3f5" },
        },
        {
          header: "Supplier",
          accessor: "namaPenerima",
          thStyle: { background: "#f1f3f5" },
        },
        {
          header: "Status",
          accessor: "status",
          thStyle: { background: "#f1f3f5" },
        },
        {
          header: "Petugas",
          accessor: "postedBy",
          thStyle: { background: "#f1f3f5" },
        },
        {
          header: "Action",
          accessor: "id",
          thStyle: { background: "#f1f3f5" },
          render: (row) => (
            <Button size="sm" variant="outline-primary">
              Detail
            </Button>
          ),
        },
      ]}
      data={data}
      headerActions={[
        {
          label: (
            <>
              <FaPlusCircle style={{ marginRight: 3 }} />
              Dokumen Baru
            </>
          ),
          onClick: () => navigate(`${BASE_ROUTE}/create`),
          variant: "primary",
        },
      ]}
    />
  );
};

export default BC23View;