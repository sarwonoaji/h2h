import Card from "../../../../../components/Card";
import { ListFalsitasTarif } from "../../../../../services/loader/ListFasilitasTarif";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import CustomTable from "../../../../../components/TableList";
import { FaCirclePlus } from "react-icons/fa6";

const PungutanBC23Page = ({ data, setData, dataPungutan, setIsComplete, readOnlyView }: any) => {
  const [columns, setColumns] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  // ===============================
  // HELPER LABEL FASILITAS
  // ===============================
  const getFasilitasLabel = (kode: string) => {
    return (
      ListFalsitasTarif.find((x) => x.value === kode)?.label.split(" - ")[1] ||
      kode
    );
  };

  // ===============================
  // FORMAT RUPIAH
  // ===============================
  const formatRupiah = (value: number) => {
  const rounded = Math.ceil((value || 0) / 1000) * 1000;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
};

  // ===============================
  // CONVERT PUNGUTAN → MATRIX
  // ===============================
  const convertPungutanToMatrix = (list: any[]) => {
    const result: any = {};
    const fasilitasSet = new Set<string>();

    list.forEach((item) => {
      const jenis = item.kodeJenisPungutan;
      const fasilitas = item.kodeFasilitasTarif;

      fasilitasSet.add(fasilitas);

      if (!result[jenis]) result[jenis] = {};
      if (!result[jenis][fasilitas]) result[jenis][fasilitas] = 0;

      result[jenis][fasilitas] += item.nilaiPungutan;
    });

    return {
      data: result,
      fasilitasList: Array.from(fasilitasSet),
    };
  };

  // ===============================
  // HITUNG BM
  // ===============================
  const getBMValue = (barang: any) => {
    let totalBM = 0;

    (barang.barangTarif || []).forEach((tarif: any) => {
      if (tarif.kodeJenisPungutan !== "BM") return;

      const rate = tarif.tarif ?? 0;
      if (tarif.kodeJenisTarif === "2") {
        totalBM += rate * (barang.jumlahSatuan || 0);
      } else {
        totalBM += (barang.cifRupiah || 0) * rate / 100;
      }
    });
    return totalBM;
  };

  // ===============================
  // HITUNG NILAI NORMAL
  // ===============================
  const getNilaiNormal = (barang: any, tarif: any, bmValue: number) => {
    const rate = tarif.tarif ?? 0;

    let baseValue = 0;

    switch (tarif.kodeJenisPungutan) {
      case "PPN":
      case "PPH":
        baseValue = (barang.cifRupiah || 0) + bmValue;
        break;
      default:
        baseValue = barang.cifRupiah || 0;
        break;
    }

    if (tarif.kodeJenisTarif === "2") {
      return rate * (barang.jumlahSatuan || 0);
    } else {
      return (baseValue * rate) / 100;
    }
  };

  // ===============================
  // HITUNG PUNGUTAN
  // ===============================
  const calculatePungutan = (listBarang: any[]) => {
    const result: any = {};
    const fasilitasSet = new Set<string>();
    listBarang.forEach((barang) => {
      const bmValue = getBMValue(barang);
      (barang.barangTarif || []).forEach((tarif: any) => {
        const jenis = tarif.kodeJenisPungutan || "-";
        const fasilitas = tarif.kodeFasilitasTarif || "0";

        fasilitasSet.add(fasilitas);

        const nilaiNormal = getNilaiNormal(barang, tarif, bmValue);
        const fasilitasPersen = tarif.tarifFasilitas ?? 0;
        const nilaiFasilitas = (nilaiNormal * fasilitasPersen) / 100;

        if (!result[jenis]) result[jenis] = {};
        if (!result[jenis][fasilitas]) result[jenis][fasilitas] = 0;

        result[jenis][fasilitas] += nilaiFasilitas;
      });
    });

    return {
      data: result,
      fasilitasList: Array.from(fasilitasSet),
    };
  };

  // ===============================
  // GENERATE TABLE
  // ===============================
  const generateTable = (calcResult: any) => {
    const { data, fasilitasList } = calcResult;

    const fasilitasSorted = ListFalsitasTarif
      .map((x) => x.value)
      .filter((v) => fasilitasList.includes(v));

    const cols = [
      {
        header: "Pungutan",
        accessor: "pungutan",
        tdStyle: { minWidth: 120 },
        render: (row: any) => (
          <span style={{ fontWeight: row.isTotal ? 700 : 400 }}>
            {row.pungutan}
          </span>
        ),
      },
      ...fasilitasSorted.map((f: string) => ({
        header: getFasilitasLabel(f),
        accessor: f,
        tdStyle: { minWidth: 140 },
        render: (row: any) => (
          <span style={{ fontWeight: row.isTotal ? 700 : 400 }}>
            {formatRupiah(row[f] || 0)}
          </span>
        ),
        footer: (data: any[]) => {
          const total = data.reduce((sum, row) => {
            const value = formatRupiah(row[f] || 0).split("Rp")[1].replace(/\./g, "").replace(",", ".").trim();
            return sum + parseFloat(value);
          }, 0);

          return formatRupiah(total || 0);
        },
      })),
    ];

    const rows: any[] = [];
    // const grandTotal: any = {};

    // fasilitasSorted.forEach((f) => (grandTotal[f] = 0));

    Object.keys(data).forEach((jenis, index) => {
      const row: any = {
        id: index + 1,
        pungutan: jenis,
      };

      fasilitasSorted.forEach((f: string) => {
        const val = data[jenis][f] || 0;
        row[f] = val;
        // grandTotal[f] += val;
      });

      rows.push(row);
    });

    // const totalRow: any = {
    //   pungutan: "TOTAL",
    //   isTotal: true,
    // };

    // fasilitasSorted.forEach((f: string) => {
    //   totalRow[f] = grandTotal[f] || 0;
    // });

   // rows.push(totalRow);

    return { columns: cols, tableData: rows };
  };

  // ===============================
  // LOAD DATA PUNGUTAN (TANPA HITUNG)
  // ===============================
  useEffect(() => {
    if (dataPungutan && dataPungutan.length > 0) {
      const matrix = convertPungutanToMatrix(dataPungutan);
      const { columns, tableData } = generateTable(matrix);

      setColumns(columns);
      setTableData(tableData);

      setIsComplete?.(true);
    }
  }, [dataPungutan]);

  // ===============================
  // HANDLE HITUNG
  // ===============================
  const handleHitung = () => {
    const calc = calculatePungutan(data || []);
    const { columns, tableData } = generateTable(calc);

    setColumns(columns);
    setTableData(tableData);
    const pungutanList: any[] = [];
    let id = 1;

    Object.keys(calc.data).forEach((jenis) => {
      Object.keys(calc.data[jenis]).forEach((fasilitas) => {
        const nilai = calc.data[jenis][fasilitas];
        if (nilai === undefined || nilai === null) return;

        pungutanList.push({
          idPungutan: id.toString(),
          kodeJenisPungutan: jenis,
          kodeFasilitasTarif: fasilitas,
          nilaiPungutan: nilai,
        });

        id++;
      });
    });

    setData((prev: any) => ({
      ...prev,
      pungutan: pungutanList,
    }));
    setIsComplete?.(true);
  };
  console.log("Data pungutan yang dihitung:", tableData);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Card
        title="Pungutan"
        headerStyle={{ backgroundColor: "#f5f5f5" }}
        headerCustom={
          !readOnlyView && (
            <Button
              size="sm"
              variant="primary"
              style={{
                display: "flex",
                alignItems: "center",
              gap: 4,
              borderRadius: 0,
              fontSize: 12,
            }}
            onClick={handleHitung}
          >
            <FaCirclePlus />
            <span style={{ paddingTop: 1 }}>
              Hitung & Muat Ulang
            </span>
          </Button>
        )}
      >
        <CustomTable
          title=""
          containerStyle={{ background: "#f9fafc", padding: 0 }}
          headerStyle={{ marginBottom: 0 }}
          tableStyle={{ fontSize: 12, marginBottom: 0 }}
          columns={columns}
          data={tableData}
          striped={false}
          bordered={false}
          hover={true}
          responsive={true}
          className="custom-table"
        />
      </Card>
    </div>
  );
};

export default PungutanBC23Page;