import Card from "../../../../../components/Card";
import { ListNegara } from "../../../../../services/loader/ListNegara";
import moment from "moment";
import { useEffect } from "react";
import { ListCaraAngkut } from "../../../../../services/loader/ListCaraAngkut";
import { ListPelabuhan } from "../../../../../services/loader/ListPelabuhan";
import ListJenisTPS from "../../../../../services/loader/ListJenisTPS";

const PengangkutBC23Page = ({ data = [], setData, headers, setIsComplete }: any) => {
    
    const updatePengangkut = (field: string, value: any) => {
        setData((prev: any) => ({
          ...prev,
            pengangkut: {
                ...prev.pengangkut,
                [field]: value,
            }
        }));
      }
    useEffect(() => {
        if(headers.kodePelBongkar == null || headers.kodePelBongkar === "") {
            setData((prev: any) => ({
                ...prev,
                kodeTps: "",
            }));
        }
  const isBc11Complete =
    headers?.nomorBc11 &&
    headers?.tanggalBc11 &&
    headers?.posBc11 &&
    headers?.subposBc11;

  const isPengangkutanComplete =
    data?.kodeCaraAngkut &&
    data?.namaPengangkut &&
    data?.nomorPengangkut &&
    data?.kodeBendera;

  const isPelabuhanComplete =
    headers?.kodePelMuat &&
    headers?.kodePelTransit &&
    headers?.kodePelBongkar &&
    headers?.kodeTps;

  const isAllComplete =
    isBc11Complete &&
    isPengangkutanComplete &&
    isPelabuhanComplete;

  setIsComplete(!!isAllComplete);
}, [
  headers?.nomorBc11,
  headers?.tanggalBc11,
  headers?.posBc11,
  headers?.subposBc11,
  headers?.kodePelMuat,
  headers?.kodePelTransit,
  headers?.kodePelBongkar,
  headers?.kodeTps,
  data?.kodeCaraAngkut,
  data?.namaPengangkut,
  data?.nomorPengangkut,
  data?.kodeBendera,
]);
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 8, justifyContent: "center" }}>
      <Card
          title="BC 1.1"
          headerStyle={{ backgroundColor: "#f5f5f5"}}
        >
        <div style={{ display: "flex", flexDirection: "row", gap: 8, marginTop: 8, }}> 
            <Card.Input
                label="Nomor BC 1.1"
                name="nomorBc11"
                value={headers?.nomorBc11 || ""}
                onChange={(val) => setData({ ...headers, nomorBc11: val })}
                error={!headers?.nomorBc11 ? "Nomor BC 1.1 wajib diisi" : ""}
                onlyNumber={true}
                maxLength={6}
                readonly={false}
            />
            <Card.DatePicker
                label={"\u00A0"}
                name="tanggalBc11"
                value={headers?.tanggalBc11}
                onChange={(val) => { val ?
                setData({ ...headers, tanggalBc11: moment(val).format("YYYY-MM-DD") })
                : setData({ ...headers, tanggalBc11: null });
                }}
                error={!headers?.tanggalBc11 ? "Tanggal BC 1.1 wajib diisi" : ""}
                readonly={false}
            />
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 8, marginTop: 8, }}> 
            <Card.Input
                label="Nomor Pos"
                name="posBc11"
                value={headers?.posBc11 || ""}
                onChange={(val) => setData({ ...headers, posBc11: val })}
                error={!headers?.posBc11 ? "Nomor Pos wajib diisi" : ""}
                readonly={false}
                onlyNumber={true}
                maxLength={4}
            />
            <Card.Input
                label={"\u00A0"}
                name="subposBc11"
                value={headers?.subposBc11 || ""}
                onChange={(val) => setData({ ...headers, subposBc11: val })}
                error={!headers?.subposBc11 ? "Nomor Subpos wajib diisi" : ""}
                readonly={false}
                onlyNumber={true}
                maxLength={8}
            />
        </div>
        </Card>
        <Card
            title="Pengangkutan" headerStyle={{ backgroundColor: "#f5f5f5"}}>
        <Card.Select
            label="Cara Pengangkutan"
            name="kodeCaraAngkut"
            value={data.kodeCaraAngkut || ""}
            list={ListCaraAngkut.map(item => ({ label: `${item.value} - ${item.label}`, value: item.value }))}
            onChange={(val) => updatePengangkut("kodeCaraAngkut", val)}
            error={!data.kodeCaraAngkut ? "Cara Pengangkutan wajib dipilih" : ""}
        />
        <Card.Input
                label="Nama Sarana Angkut"
                name="namaPengangkut"
                value={data?.namaPengangkut || ""}
                onChange={(val) => updatePengangkut("namaPengangkut", val)}
                error={!data?.namaPengangkut ? "Nama Sarana Angkut wajib diisi" : ""}
                readonly={false}
            />
            <Card.Input
                label="Nomor Voy/Flight"
                name="nomorPengangkut"
                value={data?.nomorPengangkut || ""}
                onChange={(val) => updatePengangkut("nomorPengangkut", val)}
                error={!data?.nomorPengangkut ? "Nomor Voy/Flight wajib diisi" : ""}
                readonly={false}
            />
        <Card.Select
            label="Negara"
            name="kodeBendera"
            value={data.kodeBendera || ""}
            list={ListNegara.map(item => ({ label: `${item.value} - ${item.label}`, value: item.value }))}
            onChange={(val) => updatePengangkut("kodeBendera", val)}
            error={!data.kodeBendera ? "Negara wajib diisi" : ""}
        />
        </Card>
        <Card
            title="Pelabuhan & Tempat Penimbunan" 
            headerStyle={{ backgroundColor: "#f5f5f5"}}
        >
        <Card.Select
            label="Pelabuhan Muat"
            name="kodePelMuat"
            value={headers?.kodePelMuat || ""}
            list={ListPelabuhan.map(item => ({ label: item.label, value: item.value }))}
            onChange={(val) => setData({ ...headers, kodePelMuat: val })}
            error={!headers?.kodePelMuat ? "Pelabuhan Muat wajib diisi" : ""}
        />
        <Card.Select
            label="Pelabuhan Transit"
            name="kodePelTransit"
            value={headers?.kodePelTransit || ""}
            list={ListPelabuhan.map(item => ({ label: item.label, value: item.value }))}
            onChange={(val) => setData({ ...headers, kodePelTransit: val })}
            error={!headers?.kodePelTransit ? "Pelabuhan Transit wajib diisi" : ""}
        />
        <Card.Select
            label="Pelabuhan Tujuan"
            name="kodePelTujuan"
            value={headers?.kodePelBongkar || ""}
            list={ListPelabuhan.map(item => ({ label: item.label, value: item.value }))}
            onChange={(val) => setData({ ...headers, kodePelBongkar: val })}
            error={!headers?.kodePelBongkar ? "Pelabuhan Tujuan wajib diisi" : ""}
            readonly={true}
        />
         <Card.Select
                label="Tempat Penimbunan"
                name="kodeTps"
                value={headers?.kodeTps || ""}
                list={ListJenisTPS[headers?.kodePelBongkar ?? ""] ?? []}
                onChange={(val) => setData({ ...headers, kodeTps: val })}
                error={!headers?.kodeTps ? "Tempat Penimbunan wajib diisi" : ""}
                readonly={false}
            />
        </Card>
    </div>
  );
};

export default PengangkutBC23Page;