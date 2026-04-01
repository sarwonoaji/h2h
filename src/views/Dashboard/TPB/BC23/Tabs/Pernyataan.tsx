import Card from "../../../../../components/Card";
import moment from "moment";
import { useEffect } from "react";

const PernyataanBC23Page = ({ data = [], setData, setIsComplete, readOnlyView }: any) => {
    useEffect(() => {
        const isComplete = !!(
            data.kotaTtd &&
            data.tanggalTtd &&
            data.namaTtd &&
            data.jabatanTtd
        );
        setIsComplete(isComplete);
    }, [data, setIsComplete]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
    <div style={{padding: "15px", background:"#cfe2ff", fontWeight:"600"}}>Dengan ini saya menyatakan bertanggung jawab atas kebenaran hal-hal yang diberitahukan dalam dokumen ini dan keabsahan dokumen pelengkap pabean yang menjadi dasar pembuatan dokumen ini.</div>
    <div style={{ display: "flex", flexDirection: "row", gap: 8, justifyContent: "center" }}>
      <Card
          title="Tempat & Tanggal"
          headerStyle={{ backgroundColor: "#f5f5f5" }}
        >
          <Card.Input
            label="Tempat"
            name="kotaTtd"
            value={data.kotaTtd}
            onChange={(val) => setData((prev: any) => ({ ...prev, kotaTtd: val }))}
            error={!data.kotaTtd ? "Tempat wajib diisi" : ""}
            readonly={true}
          />
          <Card.DatePicker
        label={"Tanggal"}
        name="tanggalTtd"
        value={data?.tanggalTtd}
        onChange={(val) => {
            const tanggal = val
            ? moment(val).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD");

            setData((prev: any) => ({
            ...prev,
            tanggalTtd: tanggal
            }));
        }}
        error={!data?.tanggalTtd ? "Tanggal wajib diisi" : ""}
        readonly={true}
        />
        </Card>
        <Card
          title="Nama & Jabatan"
          headerStyle={{ backgroundColor: "#f5f5f5"}}
        >
          <Card.Input
            label="Nama"
            name="namaTtd"
            value={data.namaTtd}
            onChange={(val) => setData((prev: any) => ({ ...prev, namaTtd: val }))}
            error={!data.namaTtd ? "Nama wajib diisi" : ""}
            readonly={true}
          />
          <Card.Input
            label="Jabatan"
            name="jabatanTtd"
            value={data.jabatanTtd}
            onChange={(val) => setData((prev: any) => ({ ...prev, jabatanTtd: val }))}
            error={!data.jabatanTtd ? "Jabatan wajib diisi" : ""}
            readonly={true}
          />
        </Card>
    </div>
    </div>
  );
};

export default PernyataanBC23Page;