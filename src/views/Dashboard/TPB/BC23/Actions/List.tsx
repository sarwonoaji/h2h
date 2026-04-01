import { Button, Dropdown } from "react-bootstrap";
import CustomTable from "../../../../../components/TableList";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEllipsisV, FaEye, FaPlusCircle } from "react-icons/fa";
import { bc23Service } from "../../../../../services/support/TPB/BC23/AccessBC23";
import { useEffect, useState } from "react";
import LoadingOverlay from "../../../../../components/LoadingOverlay";
import Card from "../../../../../components/Card";
import { FaEllipsis, FaEllipsisVertical } from "react-icons/fa6";
import ActionDropdown from "../../../../../components/ActionDropdown";
import CustomPagination from "../../../../../components/CustomPagination";

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
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<BC23Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
const pageSize = 2;


const GetTPB23ById = async (id: number, route: string) => {
  setIsLoading(true);
  try {
    const result = await bc23Service.getById(id);
    navigate(`${BASE_ROUTE}/${route}`, { state: { data: result.data } });
  } catch (error) {
    console.error("Error fetching BC 2.3 by ID:", error);
    // Tangani error, misalnya tampilkan pesan error di UI
  } finally {
    setIsLoading(false);
  }
};
const totalPages = Math.ceil(totalData / pageSize);
  useEffect(() => {
  const fetchData = async () => {
    const result = await bc23Service.getTPB(currentPage, pageSize); // ini sudah array
    setTotalData(result.info.total);
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
    setIsLoading(false);
  };

  fetchData();
}, [currentPage]);

  return (
    <div style={{ position: "relative"}}>
      <LoadingOverlay
        show={isLoading}
        // text="Generating Nomor AJU..."
      />
    <Card
      title=""
      bodyStyle={{padding:0, height: "100%"}}>
    <CustomTable<BC23Item>
      title="List BC 2.3"
      containerStyle={{ background: "#f9fafc", height: "calc(100vh - 170px)" }}
      titleStyle={{ fontWeight: 500, fontSize: 18 }}
      headerStyle={{ paddingBottom: 10, marginBottom: 0}}
      actionContainerStyle={{ gap: 15 }}
      tableStyle={{ fontSize: 12, marginBottom: 0}}
      striped={false}
      bordered={false}
      responsive={false}
      columns={[
        { header: "Nomor Aju", accessor: "nomorAju" },
        { header: "Tanggal Aju", accessor: "tanggalAju" },
        { header: "Nomor Daftar", accessor: "nomorDaftar" },
        { header: "Tanggal Daftar", accessor: "tanggalDaftar" },
        { header: "Supplier", accessor: "namaPenerima" },
        { header: "Status", accessor: "status" },
        { header: "Petugas", accessor: "postedBy" },
        {
          header: "Action",
          accessor: "id",
          tdStyle: { textAlign: "left" },
          render: (row) => (
            <ActionDropdown
              label={<FaEllipsisVertical />}
              actions={[
                {
                  label: "Edit",
                  icon: <FaEdit />,
                  onClick: () => GetTPB23ById(Number(row.id), "edit"),
                },
                {
                  label: "View",
                  icon: <FaEye />,
                  onClick: () => GetTPB23ById(Number(row.id), "view"),
                },
              ]}
            />
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
    <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "16px 0" }}>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={(p) => setCurrentPage(p)}
      />
      </div>
    </Card>
    
    </div>
    
  );

};

export default BC23View;