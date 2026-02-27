import { useEffect, useState } from "react";
import Card from "../../../../../components/Card";
import { ListPelabuhan } from "../../../../../services/loader/ListPelabuhan";
import { ListTujuanTPB } from "../../../../../services/loader/ListTujuanTPB";
import { ListKantor } from "../../../../../services/loader/ListKantor";

const HeaderPageBC23 = ({ data, setData, setIsComplete }: any) => {
  console.log("HeaderPageBC23 received data:", data);
  useEffect(() => {
  const hasHeader = !!(
    data.nomorAju &&
    data.kodeKantor &&
    data.kodeKantorBongkar &&
    data.kodePelBongkar &&
    data.kodeTujuanTpb
  );
  setIsComplete(hasHeader);
}, [data]);
  const customViewNumberAju = (value: string) => {
    //4 digit - 2 digit - 6 digit - 8 digit - 6 digit contoh: 0001 - 23 - 000001 - 00000001 - 000001
    const numericValue = value.replace(/\D/g, "");
    let formattedValue = "";
    if (numericValue.length > 0) {
      formattedValue += numericValue.slice(0, 4);
    }
    if (numericValue.length > 4) {
      formattedValue += " - " + numericValue.slice(4, 6);
    }
    if (numericValue.length > 6) {
      formattedValue += " - " + numericValue.slice(6, 12);
    }
    if (numericValue.length > 12) {
      formattedValue += " - " + numericValue.slice(12, 20);
    }
    if (numericValue.length > 20) {
      formattedValue += " - " + numericValue.slice(20, 26);
    }
    return formattedValue;
  }
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 8, justifyContent: "center" }}>
      <Card
          title="Pengajuan"
          headerStyle={{ backgroundColor: "#f5f5f5"}}
        >
          <Card.Input
            label="Nomor Aju"
            name="nomorAju"
            value={customViewNumberAju(data.nomorAju || "")}
            onChange={(val) => {
              setData({ ...data, nomorAju: val });
            }}
            error={!data.nomorAju ? "Nomor Kosong" : ""}
            readonly={true}
          />
        </Card>
        <Card
          title="Kantor Pabean" headerStyle={{ backgroundColor: "#f5f5f5" }}>
          <Card.Select
            label="Pelabuhan Bongkar"
            name="kodePelBongkar"
            value={data.kodePelBongkar || ""}
            list={ListPelabuhan.map(item => ({ label: item.label, value: item.value }))}
            onChange={(val) => {
              setData({ ...data, kodePelBongkar: val });
            }}
            error={!data.kodePelBongkar ? "Pelabuhan wajib dipilih" : ""}
          />
          <Card.Select
            label="Kantor Pabean Bongkar"
            name="kodeKantorBongkar"
            value={data.kodeKantorBongkar || ""}
            onChange={(val) => {
              setData({ ...data, kodeKantorBongkar: val });
            }}
            list={ListKantor.map(item => ({ label: `${item.key} - ${item.name}`, value: item.key }))}
            readonly={false}
            error={!data.kodeKantorBongkar ? "Kantor wajib dipilih" : ""}
          />
          <Card.Select
            label="Kantor Pabean Pengawas"
            name="kodeKantor"
            value={data.kodeKantor || ""}
            onChange={(val) => {
              setData({ ...data, kodeKantor: val });
            }}
            readonly={false}
            list={ListKantor.map(item => ({ label: `${item.key} - ${item.name}`, value: item.key }))}
            error={!data.kodeKantor ? "Kantor wajib dipilih" : ""}
          />
        </Card>
        <Card
          title="Keterangan Lain"
          headerStyle={{ backgroundColor: "#f5f5f5"}}
        >
          <Card.Select
            label="Tujuan"
            name="kodeTujuanTpb"
            value={data.kodeTujuanTpb || ""}
            onChange={(val) => {
              setData({ ...data, kodeTujuanTpb: val });
            }}
            list={ListTujuanTPB.map(item => ({ label: `${item.value} - ${item.label}`, value: item.value }))}
            error={!data.kodeTujuanTpb ? "Tujuan wajib dipilih" : ""}
          />
        </Card>
    </div>
  );
};

export default HeaderPageBC23;