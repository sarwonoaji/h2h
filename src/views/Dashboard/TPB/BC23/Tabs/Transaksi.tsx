import Card from "../../../../../components/Card";
import { use, useEffect, useState } from "react";
import { ListIncoterm } from "../../../../../services/loader/ListIncoterm";
import { ListValuta } from "../../../../../services/loader/ListValuta";
import { ceisaService } from "../../../../../services/support/Ceisa/AccessCeisa";
import { ListAsuransi } from "../../../../../services/loader/ListAsuransi";
import { ListKenaPajak } from "../../../../../services/loader/ListKenaPajak";


const TransaksiBC23Page = ({ data = [], setData, setIsComplete }: any) => {
    const [isFreightValid, setIsFreightValid] = useState(true);
    const [isAsuransiValid, setIsAsuransiValid] = useState(true);
    useEffect(() => {
        if (data.kodeIncoterm === "FOB") {
        const nilaiCif = data.hargaPenyerahan + data.freight;
        const fobValue = data.hargaPenyerahan;
        setIsFreightValid(false);
        setData((value: any) => ({ ...value, cif: nilaiCif, fob: fobValue }));
        } else {
        setIsFreightValid(true);
        setData((value: any) => ({
            ...value,
            cif: data.hargaPenyerahan,
            fob: 0,
            freight: 0,
        }));
        }
    }, [data.kodeIncoterm, data.hargaPenyerahan, data.freight]);

    useEffect(() => {
        data.cif = data.hargaPenyerahan + data.freight + data.asuransi + (data.biayaTambahan - data.biayaPengurang);
        setData((value: any) => ({ ...value, cif: data.cif }));
        data.fob = data.hargaPenyerahan + (data.biayaTambahan - data.biayaPengurang);
        setData((value: any) => ({ ...value, fob: data.fob }));

        data.nilaiBarang = data.ndpbm * data.cif;
        setData((value: any) => ({ ...value, nilaiBarang: data.nilaiBarang }));
    },[data.biayaTambahan, data.biayaPengurang, data.fob, data.freight, data.hargaPenyerahan, data.asuransi, data.ndpbm]);
    useEffect(() => {
        if (data.kodeAsuransi === "LN") {
            setIsAsuransiValid(false);
            if(data.kodeIncoterm === "CIF") {
                setIsAsuransiValid(true);
                setData((value: any) => ({ ...value, asuransi: 0 }));
            }
            
        } else {
            setIsAsuransiValid(true);
            setData((value: any) => ({  ...value, asuransi: 0 }));
        }
    }, [data.kodeAsuransi, data.kodeIncoterm]);

    useEffect(() => {
        const fetchRate = async () => {
         if (!data.kodeValuta) {
            setData((prev: any) => ({
                ...prev,
                ndpbm: ""
            }));
            return;
        }

        try {
            const rateValuta = await ceisaService.getRate(data.kodeValuta);
            const [{ nilaiKurs = 0 } = {}] = rateValuta?.data ?? [];
            setData((prev: any) => ({
            ...prev,
            ndpbm: nilaiKurs,
            }));
        } catch (err) {
            console.error("Gagal ambil rate valuta:", err);
        }
        };

        fetchRate();
    }, [data.kodeValuta]);

    useEffect(() => {
        const isComplete =
        data.kodeValuta &&
        data.kodeIncoterm &&
        data.kodeAsuransi &&
        data.bruto > 0 &&
        data.kodeKenaPajak;
        setIsComplete(!!isComplete);
    }, [data, setIsComplete]);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 8, justifyContent: "center" }}>
      <Card 
        title="Harga"
        headerStyle={{ backgroundColor: "#f5f5f5", padding: "18px 12px" }}
      >
        <Card.Select
            label="Valuta"
            name="kodeValuta"
            value={data.kodeValuta || ""}
            list={ListValuta}
            onChange={(val) => setData((prev: any) => ({ ...prev, kodeValuta: val }))}
            error={!data.kodeValuta ? "Valuta wajib diisi" : ""}
        />
        <Card.Input
            label="NDPBM"
            name="ndpbm"
            value={data.ndpbm}
            onChange={(val) => setData((prev: any) => ({ ...prev, ndpbm: val }))}
            readonly={true}
        />
        <div style={{ display: "flex", flexDirection: "row", gap: 8, marginTop: 8, }}>
            <Card.Select
                label="Harga Barang"
                name="kodeIncoterm"
                value={data.kodeIncoterm}
                list={ListIncoterm}
                onChange={(val) => setData((prev: any) => ({ ...prev, kodeIncoterm: val }))}
                error={!data.kodeIncoterm ? "Kode Barang wajib diisi" : ""}
                readonly={false}
            />
            <Card.Numeric
                label={"\u00A0"}
                name="hargaPenyerahan"
                value={data.hargaPenyerahan}
                onChange={(val) => setData((prev: any) => ({ ...prev, hargaPenyerahan: val }))}
                readonly={false}
            />
        </div>
        <Card.Numeric
                label="Nilai CIF"
                name="cif"
                value={data.cif}
                onChange={(val) => setData((prev: any) => ({ ...prev, cif: val }))}
                readonly={true}
            />
            <Card.Numeric
                label="Nilai Pabean"
                name="nilaiPabean"
                value={data.nilaiBarang}
                // onChange={(val) => setData((prev: any) => ({ ...prev, nilaiPabean: val }))}
                readonly={true}
            />
      </Card>
       <Card 
        title="Harga Lainnya"
        headerStyle={{ backgroundColor: "#f5f5f5", padding: "18px 12px" }}
      >
            <Card.Numeric
                label="Biaya Penambah"
                name="biayaTambahan"
                value={data.biayaTambahan}
                onChange={(val) => setData((prev: any) => ({ ...prev, biayaTambahan: val }))}
                readonly={false}
            />
            <Card.Numeric
                label="Biaya Pengurang"
                name="biayaPengurang"
                value={data.biayaPengurang}
                onChange={(val) => setData((prev: any) => ({ ...prev, biayaPengurang: val }))}
                readonly={false}
            />
            <Card.Numeric
                label="FOB"
                name="fob"
                value={data.fob}
                onChange={(val) => setData((prev: any) => ({ ...prev, fob: val }))}
                readonly={true}
            />
            <Card.Numeric
                label="Freight"
                name="freight"
                value={data.freight}
                onChange={(val) => setData((prev: any) => ({ ...prev, freight: val }))}
                readonly={isFreightValid}
            />
        <div style={{ display: "flex", flexDirection: "row", gap: 8, marginTop: 8, }}>
            <Card.Select
                label="Asuransi"
                name="kodeAsuransi"
                value={data.kodeAsuransi}
                list={ListAsuransi}
                onChange={(val) => setData((prev: any) => ({ ...prev, kodeAsuransi: val }))}
                error={!data.kodeAsuransi ? "Kode Asuransi wajib diisi" : ""}
                readonly={false}
            />
            <Card.Numeric
                label={"\u00A0"}
                name="asuransi"
                value={data.asuransi}
                onChange={(val) => setData((prev: any) => ({ ...prev, asuransi: val }))}
                readonly={isAsuransiValid}
            />
        </div>
      </Card>
      <Card 
        title=""
        bodyStyle={{ display: "flex", flexDirection:"column", padding: 0, gap: 10, justifyContent:"space-between", height:"100%"}}
        style={{backgroundColor:"transparent", border:"none", boxShadow:"none"}}      
        >
            <Card 
                title="Berat"
                style={{height:"100%"}}
            >
                <Card.Numeric
                    label="Berat Kotor (KGM)"
                    name="bruto"
                    value={data.bruto}
                    onChange={(val) => setData((prev: any) => ({ ...prev, bruto: val }))}
                    readonly={false}
                    error={data.bruto <= 0 ? "Berat Kotor harus lebih dari 0" : ""}
                />
                <Card.Numeric
                    label="Berat Bersih (KGM)"
                    name="netto"
                    value={data.netto}
                    onChange={(val) => setData((prev: any) => ({ ...prev, netto: val }))}
                    readonly={true}
                />
            </Card>
            <Card
                title="Keterangan Pajak"
                style={{ height:"100%"}}
                >
                <Card.Select
                    label="Jasa Kena Pajak"
                    name="kodeKenaPajak"
                    value={data.kodeKenaPajak}
                    list={ListKenaPajak}
                    onChange={(val) => setData((prev: any) => ({ ...prev, kodeKenaPajak: val }))}
                    error={!data.kodeKenaPajak ? "Jasa Kena Pajak wajib diisi" : ""}
                    readonly={false}
                />
            </Card>
      </Card>
    </div>
  );
};

export default TransaksiBC23Page;