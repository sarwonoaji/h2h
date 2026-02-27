import { Button } from "react-bootstrap";
import Card from "../../../../../components/Card";
import { ListNegara } from "../../../../../services/loader/ListNegara";
import moment from "moment";
import { useEffect } from "react";

const EntitasBC23Page = ({ data = [], setData, setIsComplete }: any) => {
  const getEntitas = (seri: string) => {
    return data.find((x: any) => x.kodeEntitas === seri) ?? {
      kodeEntitas: seri,
    };
  };
  const updateEntitas = (seri: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      entitas: prev.entitas.map((item: any) =>
        item.kodeEntitas === seri
          ? { ...item, [field]: value }
          : item
      ),
    }));
  };

  const pushPengusaha = () => {
    setData((prev: any) => {
      const entitasList = prev.entitas || [];

      const pengusaha = entitasList.find(
        (x: any) => x.kodeEntitas === "3"
      );

      if (!pengusaha) return prev;

      return {
        ...prev,
        entitas: entitasList.map((item: any) =>
          item.kodeEntitas === "7"
            ? {
                ...item,        // pertahankan struktur pemilik
                ...pengusaha,   // timpa dengan data pengusaha
                kodeEntitas: "7", // paksa tetap 7
                kodeStatus: "5",
                kodeJenisApi: "2",
                seriEntitas: 3,
              }
            : item
        ),
      };
    });
  };
  const pemilik = getEntitas("7");
  const pemasok = getEntitas("5");
  const pengusaha = getEntitas("3");

  useEffect(() => {
    const hasEntitas = !!(
      (pemilik.alamatEntitas && pemilik.kodeEntitas && pemilik.kodeJenisIdentitas && pemilik.kodeStatus && pemilik.namaEntitas && pemilik.nomorIdentitas && pemilik.seriEntitas) &&
      (pemasok.alamatEntitas && pemasok.kodeEntitas && pemasok.kodeNegara && pemasok.namaEntitas && pemasok.seriEntitas) &&
      (pengusaha.alamatEntitas && pengusaha.kodeEntitas && pengusaha.kodeJenisIdentitas && pengusaha.namaEntitas && pengusaha.nibEntitas && pengusaha.nomorIdentitas && pengusaha.nomorIjinEntitas && pengusaha.tanggalIjinEntitas && pengusaha.seriEntitas)
    );
    setIsComplete(hasEntitas);
  }, [pemilik, pemasok, pengusaha]);
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 8, justifyContent: "center" }}>
      <Card
          title="Importir/Pengusaha TPB"
          headerStyle={{ backgroundColor: "#f5f5f5", padding: "18px 12px" }}
        >
          <Card.Input
            label="NPWP"
            name="nomorIdentitas"
            value={pengusaha.nomorIdentitas}
            onChange={(val) => updateEntitas("3", "nomorIdentitas", val)}
            error={!pengusaha.nomorIdentitas ? "Nomor wajib diisi" : ""}
            readonly={true}
          />
          <Card.Input
            label="Nama"
            name="nama"
            value={pengusaha.namaEntitas}
            onChange={(val) => updateEntitas("3", "namaEntitas", val)}
            error={!pengusaha.namaEntitas ? "Nama wajib diisi" : ""}
            readonly={true}
          />
          <Card.Textarea
            label="Alamat"
            name="alamatEntitas"
            value={pengusaha.alamatEntitas}
            onChange={(val) => updateEntitas("3", "alamatEntitas", val.target.value)}
            error={!pengusaha.alamatEntitas ? "Alamat wajib diisi" : ""}
            readonly={false}
          />
        <div style={{ display: "flex", flexDirection: "row", gap: 8, marginTop: 8, }}> 
          <Card.Input
            label="Nomor Izin TPB"
            name="nomorIjinEntitas"
            value={pengusaha.nomorIjinEntitas}
            onChange={(val) => updateEntitas("3", "nomorIjinEntitas", val)}
            error={!pengusaha.nomorIjinEntitas ? "Nomor wajib diisi" : ""}
            readonly={true}
          />
          <Card.DatePicker
            label={"\u00A0"}
            name="tanggalIjinEntitas"
            value={pengusaha?.tanggalIjinEntitas}
            onChange={(val) => { val ?
              updateEntitas(
                "3",
                "tanggalIjinEntitas",
                moment(val).format("YYYY-MM-DD")
              ): updateEntitas("3", "tanggalIjinEntitas", null);
            }}
            error={!pengusaha?.tanggalIjinEntitas ? "Tanggal Ijin Entitas wajib diisi" : ""}
            readonly={false}
          />
        </div>
          <Card.Numeric
            label="NIB"
            name="nibEntitas"
            value={pengusaha.nibEntitas}
            onChange={(val) => updateEntitas("3", "nibEntitas", val)}
            error={!pengusaha.nibEntitas ? "NIB wajib diisi" : ""}
            typeChanges="number"
            readonly={false}
          />
        </Card>

        <Card
          title="Pemasok" headerStyle={{ backgroundColor: "#f5f5f5",padding: "18px 12px" }}>
          <Card.Input
            label="Nama"
            name="namaEntitas"
            value={pemasok.namaEntitas}
            onChange={(val) => updateEntitas("5", "namaEntitas", val)}
            error={!pemasok.namaEntitas ? "Nama wajib diisi" : ""}
            readonly={false}
          />
          <Card.Textarea
            label="Alamat"
            name="alamatEntitas"
            value={pemasok.alamatEntitas}
            onChange={(val) => updateEntitas("5", "alamatEntitas", val.target.value)}
            error={!pemasok.alamatEntitas ? "Alamat wajib diisi" : ""}
            readonly={false}
          />
          <Card.Select
            label="Negara"
            name="kodeNegara"
            value={pemasok.kodeNegara || ""}
            list={ListNegara.map(item => ({ label: item.label, value: item.value }))}
            onChange={(val) => updateEntitas("5", "kodeNegara", val)}
            error={!pemasok.kodeNegara ? "Negara wajib diisi" : ""}
          />
        </Card>
        <Card
          title="Pemilik Barang"
          headerStyle={{ backgroundColor: "#f5f5f5"}}
          headerCustom={(
              <div style={{ display: "flex", flexDirection: "row", gap: 8, }}>
                  <Button size="sm" variant="primary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} onClick={pushPengusaha}>
                      <span style={{paddingTop:1}}>Salin Pengusaha</span>                
                  </Button>
              </div>
          )}
        >
          <Card.Input
            label="NPWP"
            name="nomorIdentitas"
            value={pemilik.nomorIdentitas}
            onChange={(val) => updateEntitas("7", "nomorIdentitas", val)}
            error={!pemilik.nomorIdentitas ? "Nomor wajib diisi" : ""}
            readonly={false}
          />
          <Card.Input
            label="Nama"
            name="nama"
            value={pemilik.namaEntitas}
            onChange={(val) => updateEntitas("7", "namaEntitas", val)}
            error={!pemilik.namaEntitas ? "Nama wajib diisi" : ""}
            readonly={false}
          />
          <Card.Textarea
            label="Alamat"
            name="alamatEntitas"
            value={pemilik.alamatEntitas}
            onChange={(e) => updateEntitas("7", "alamatEntitas", e.target.value)}
            error={!pemilik.alamatEntitas ? "Alamat wajib diisi" : ""}
            readonly={false}
          />
        </Card>
    </div>
  );
};

export default EntitasBC23Page;