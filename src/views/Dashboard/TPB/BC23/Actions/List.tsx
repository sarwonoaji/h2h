import { Button } from "react-bootstrap";
import CustomTable from "../../../../../components/TableList";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { bc23Service } from "../../../../../services/support/TPB/BC23/AccessBC23";
import { useEffect, useState } from "react";
import LoadingOverlay from "../../../../../components/LoadingOverlay";
import Card from "../../../../../components/Card";

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
    <div style={{ position: "relative", minHeight: "calc(100vh - 96px)" }}>
      <LoadingOverlay
        show={isLoading}
        // text="Generating Nomor AJU..."
      />
    <Card
      title=""
      bodyStyle={{padding:0, height: "100%"}}>
    <CustomTable<BC23Item>
      title="List BC 2.3"
      containerStyle={{ background: "#f9fafc" }}
      titleStyle={{ fontWeight: 500, fontSize: 18 }}
      headerStyle={{ paddingBottom: 10, marginBottom: 0}}
      actionContainerStyle={{ gap: 15 }}
      tableStyle={{ fontSize: 12, marginBottom: 0}}
      striped={false}
      bordered={false}
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
    <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "16px 0" }}>

        <Button
          size="sm"
          variant={currentPage === 1 ? "secondary" : "primary"}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >Prev
        </Button>
        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? "primary" : "outline-primary"}
              onClick={() => setCurrentPage(page)}
              style={{
                minWidth: 32,
                padding: "4px 8px"
              }}
            >
              {page}
            </Button>
          );
        })}
        <Button
          size="sm"
          variant={currentPage === totalPages ? "secondary" : "primary"}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>

      </div>
    </Card>
    
    </div>
    
  );

};

export default BC23View;