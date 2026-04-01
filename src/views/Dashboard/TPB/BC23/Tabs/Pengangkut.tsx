import Card from "../../../../../components/Card";
import { ListNegara } from "../../../../../services/loader/ListNegara";
import moment from "moment";
import { useEffect } from "react";
import { ListCaraAngkut } from "../../../../../services/loader/ListCaraAngkut";
import { ListPelabuhan } from "../../../../../services/loader/ListPelabuhan";
import ListJenisTPS from "../../../../../services/loader/ListJenisTPS";

type Pengangkut = {
  kodeBendera: string | null;
  namaPengangkut: string | null;
  nomorPengangkut: string | null;
  kodeCaraAngkut: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | null;
  seriPengangkut: number;
};

type Props = {
    data: Pengangkut[];
    setData: (fn: (prev: any) => any) => void;
    headers: Record<string, any>;
    setIsComplete: (val: boolean) => void;
    readOnlyView: boolean;
};

const PengangkutBC23Page = ({ data = [], setData, headers, setIsComplete, readOnlyView }: Props) => {
    // Update pengangkut dengan validasi data
    const updatePengangkut = (field: string, value: any) => {
        setData((prev: any) => {
            if (!Array.isArray(prev.pengangkut) || prev.pengangkut.length === 0) {
                return {
                    ...prev,
                    pengangkut: [{ [field]: value }],
                };
            }
            return {
                ...prev,
                pengangkut: prev.pengangkut.map((item: any, index: number) =>
                    index === 0 ? { ...item, [field]: value } : item
                ),
            };
        });
    };

    useEffect(() => {
        if (headers.kodePelBongkar == null || headers.kodePelBongkar === "") {
            setData((prev: any) => {
                if (prev.kodeTps === "") return prev;
                return {
                    ...prev,
                    kodeTps: "",
                };
            });
        }

        const pengangkut = Array.isArray(data) && data.length > 0 ? data[0] : null;

        const isBc11Complete =
            !!headers?.nomorBc11 &&
            !!headers?.tanggalBc11 &&
            !!headers?.posBc11 &&
            !!headers?.subposBc11;

        const isPengangkutanComplete =
            !!pengangkut?.kodeCaraAngkut &&
            !!pengangkut?.namaPengangkut &&
            !!pengangkut?.nomorPengangkut &&
            !!pengangkut?.kodeBendera;

        const isPelabuhanComplete =
            !!headers?.kodePelMuat &&
            !!headers?.kodePelTransit &&
            !!headers?.kodePelBongkar &&
            !!headers?.kodeTps;

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
        data,
        setIsComplete,
        setData,
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
                onChange={(val) => setData((prev: any) => ({ ...prev, nomorBc11: val }))}
                error={!headers?.nomorBc11 ? "Nomor BC 1.1 wajib diisi" : ""}
                onlyNumber={true}
                maxLength={6}
                readonly={readOnlyView}
            />
            <Card.DatePicker
                label={"\u00A0"}
                name="tanggalBc11"
                value={headers?.tanggalBc11}
                onChange={(val) => { val ?
                setData((prev: any) => ({ ...prev, tanggalBc11: moment(val).format("DD-MM-YYYY") }))
                : setData((prev: any) => ({ ...prev, tanggalBc11: null }));
                }}
                error={!headers?.tanggalBc11 ? "Tanggal BC 1.1 wajib diisi" : ""}
                readonly={readOnlyView}
            />
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 8, marginTop: 8, }}> 
            <Card.Input
                label="Nomor Pos"
                name="posBc11"
                value={headers?.posBc11 || ""}
                onChange={(val) => setData((prev: any) => ({ ...prev, posBc11: val }))}
                error={!headers?.posBc11 ? "Nomor Pos wajib diisi" : ""}
                readonly={readOnlyView}
                onlyNumber={true}
                maxLength={4}
            />
            <Card.Input
                label={"\u00A0"}
                name="subposBc11"
                value={headers?.subposBc11 || ""}
                onChange={(val) => setData((prev: any) => ({ ...prev, subposBc11: val }))}
                error={!headers?.subposBc11 ? "Nomor Subpos wajib diisi" : ""}
                readonly={readOnlyView}
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
            value={data[0]?.kodeCaraAngkut || ""}
            list={ListCaraAngkut.map(item => ({ label: `${item.value} - ${item.label}`, value: item.value }))}
            onChange={(val) => updatePengangkut("kodeCaraAngkut", val)}
            error={!data[0]?.kodeCaraAngkut ? "Cara Pengangkutan wajib dipilih" : ""}
            readonly={readOnlyView}
        />
        <Card.Input
                label="Nama Sarana Angkut"
                name="namaPengangkut"
                value={data[0]?.namaPengangkut || ""}
                onChange={(val) => updatePengangkut("namaPengangkut", val)}
                error={!data[0]?.namaPengangkut ? "Nama Sarana Angkut wajib diisi" : ""}
                readonly={readOnlyView}
            />
            <Card.Input
                label="Nomor Voy/Flight"
                name="nomorPengangkut"
                value={data[0]?.nomorPengangkut || ""}
                onChange={(val) => updatePengangkut("nomorPengangkut", val)}
                error={!data[0]?.nomorPengangkut ? "Nomor Voy/Flight wajib diisi" : ""}
                readonly={readOnlyView}
            />
        <Card.Select
            label="Negara"
            name="kodeBendera"
            value={data[0]?.kodeBendera || ""}
            list={ListNegara.map(item => ({ label: `${item.value} - ${item.label}`, value: item.value }))}
            onChange={(val) => updatePengangkut("kodeBendera", val)}
            error={!data[0]?.kodeBendera ? "Negara wajib diisi" : ""}
            readonly={readOnlyView}
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
            onChange={(val) => setData((prev: any) => ({ ...prev, kodePelMuat: val }))}
            error={!headers?.kodePelMuat ? "Pelabuhan Muat wajib diisi" : ""}
            readonly={readOnlyView}
        />
        <Card.Select
            label="Pelabuhan Transit"
            name="kodePelTransit"
            value={headers?.kodePelTransit || ""}
            list={ListPelabuhan.map(item => ({ label: item.label, value: item.value }))}
            onChange={(val) => setData((prev: any) => ({ ...prev, kodePelTransit: val }))}
            error={!headers?.kodePelTransit ? "Pelabuhan Transit wajib diisi" : ""}
            readonly={readOnlyView}

        />
        <Card.Select
            label="Pelabuhan Tujuan"
            name="kodePelTujuan"
            value={headers?.kodePelBongkar || ""}
            list={ListPelabuhan.map(item => ({ label: item.label, value: item.value }))}
            onChange={(val) => setData((prev: any) => ({ ...prev, kodePelBongkar: val }))}
            error={!headers?.kodePelBongkar ? "Pelabuhan Tujuan wajib diisi" : ""}
            readonly={true}
        />
         <Card.Select
                label="Tempat Penimbunan"
                name="kodeTps"
                value={headers?.kodeTps || ""}
                list={ListJenisTPS[headers?.kodePelBongkar ?? ""] ?? []}
                onChange={(val) => setData((prev: any) => ({ ...prev, kodeTps: val }))}
                error={!headers?.kodeTps ? "Tempat Penimbunan wajib diisi" : ""}
                readonly={readOnlyView}
            />
        </Card>
    </div>
  );
};

export default PengangkutBC23Page;