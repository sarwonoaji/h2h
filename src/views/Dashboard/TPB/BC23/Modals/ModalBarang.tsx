import { FaCircleExclamation, FaSquareCheck } from "react-icons/fa6";
import Card from "../../../../../components/Card";
import { Button } from "react-bootstrap";
import CustomTable from "../../../../../components/TableList";
import { FaPlusCircle, FaSquare } from "react-icons/fa";
import { use, useEffect, useState } from "react";
import type { Barang } from "../../../../../models/BC23Model/BC23.types";
import { createInitialBarang } from "../../../../../models/BC23Model/DataModel/BarangModels";
import { ListKategoriBarang } from "../../../../../services/loader/ListKategoriBarang";
import { ListNegara } from "../../../../../services/loader/ListNegara";
import { ListJenisKemasan } from "../../../../../services/loader/ListJenisKemasan";
import { ListSatuanBarang } from "../../../../../services/loader/ListSatuanBarang";
import { ListJenisTarif } from "../../../../../services/loader/ListJenisTarif";
import { ListPungutan } from "../../../../../services/loader/ListPungutan";
import { ListFalsitasTarif } from "../../../../../services/loader/ListFasilitasTarif";

export const ModalBarang = ({data, setData, header, setActiveForm, editingIndex = null, editData = null, readOnlyView}: any) => {
  const [barang, setBarang] = useState<Barang>(editData ? editData : createInitialBarang());
  const [showForm, setShowForm] = useState(false);
  const [checkedBMT, setCheckedBMT] = useState(false);
      // Set checkedBMT true saat edit jika ada BMAD, BMTP, BMI, BMP
      useEffect(() => {
        if (editData && Array.isArray(editData.barangTarif)) {
          const hasBMT = editData.barangTarif.some((item: any) =>
            ["BMAD", "BMTP", "BMI", "BMP"].includes(item.kodeJenisPungutan)
          );
          setCheckedBMT(hasBMT);
        }
      }, [editData]);
  const [checkedCukai, setCheckedCukai] = useState(false);

  // Jika editData berubah (misal user klik edit), isi form dengan data yang diedit
  useEffect(() => {
    if (editData) {
      setBarang(editData);
    } else {
      setBarang(createInitialBarang());
    }
  }, [editData]);
    
    
    const generateSeri = () => {
        if (!data || data.length === 0) return "1";
        const maxSeri = Math.max(...data.map((item: any) => parseInt(item.seriBarang)));
        return (maxSeri + 1).toString();
    }
    // Simpan data baru atau update data jika edit
    const handleSimpan = () => {
      if (!barang.kodeBarang || !barang.uraian || 
          !barang.jumlahSatuan || !barang.kodeSatuanBarang) {
        alert("Lengkapi data terlebih dahulu");
        return;
      }

      if (editingIndex !== null && editingIndex !== undefined) {
        // Edit mode: update barang pada index tertentu, seriBarang tidak berubah
        setData((prev: any) => {
          const updatedBarang = [...(prev.barang || [])];
          updatedBarang[editingIndex] = barang;
          return {
            ...prev,
            barang: updatedBarang,
          };
        });
      } else {
        // Tambah baru, seriBarang auto increment
        const nextSeri = generateSeri();
        setData((prev: any) => ({
          ...prev,
          barang: [
            ...(prev.barang || []),
            { ...barang, seriBarang: nextSeri },
          ],
        }));
      }

      setBarang(createInitialBarang());
      setActiveForm(null);
    };
    const updateBarang = (field: string, value: any) => {
        setBarang((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    }
    // const updateBarangTarifBM = (field: string, value: any) => {
    //     setBarang((prev: any) => {
    //         const list = prev.barangTarif ?? [];
    //         if (list.length === 0) {
    //             return {
    //                 ...prev,
    //                 barangTarif: [{ [field]: value }],
    //             };
    //         }
    //         return {
    //             ...prev,
    //             barangTarif: list.map((item: any, i: number) =>
    //                 i === 0 ? { ...item, [field]: value } : item
    //             ),
    //         };
    //     });
    // };
    const isEmptyTarif = (item: any) => {
        const isSpesifik = item.kodeJenisTarif === "2";

        return (
            (!item.tarif || item.tarif === 0) &&
            (!item.tarifFasilitas || item.tarifFasilitas === 0) &&
            (!item.kodeJenisTarif || item.kodeJenisTarif === "") &&
            (!item.kodeFasilitasTarif || item.kodeFasilitasTarif === "") &&
            (
                isSpesifik
                    ? (!item.jumlahSatuan || item.jumlahSatuan === 0) &&
                      (!item.kodeSatuanBarang || item.kodeSatuanBarang === "")
                    : true
            )
        );
    };
    const updateBarangTarifOpsional = (
    kodeJenisPungutan: string,
    field?: string,
    value?: any
) => {
    setBarang((prev: any) => {
        let list = [...(prev.barangTarif ?? [])];

        const index = list.findIndex(
            (item: any) => item.kodeJenisPungutan === kodeJenisPungutan
        );

        // ===== PILIH JENIS SAJA (BM / BMKITE) =====
        if (!field) {
            // ❗ pastikan hanya 1 BM/BMKITE
            list = list.filter(
                (item: any) =>
                    !["BM", "BMKITE"].includes(item.kodeJenisPungutan)
            );

            list.push({
                kodeJenisPungutan,
            });

            return {
                ...prev,
                barangTarif: list,
            };
        }

        // ===== UPDATE FIELD =====
        if (index === -1) {
            list.push({
                kodeJenisPungutan,
                [field]: value,
            });
        } else {
            list[index] = {
                ...list[index],
                [field]: value,
            };
        }

        // ===== FILTER KOSONG (kecuali BM/BMKITE) =====
        list = list.filter((item: any) => {
            if (["BM", "BMKITE"].includes(item.kodeJenisPungutan)) {
                return true; // ❗ jangan dihapus walaupun kosong
            }
            return !isEmptyTarif(item);
        });

        return {
            ...prev,
            barangTarif: list,
        };
    });
};

    const pushUraianHS = () => {
        let generatedUraian = barang.kodeBarang;
        updateBarang("uraian", generatedUraian);
    }

    useEffect(() => {
      if (!barang || !header) return;
      
      const persenatase = header.fob ? header.freight / header.fob : 0;
      const nilaiTambah = barang.nilaiBarang * (header.biayaTambahan / 100) - barang.nilaiBarang * (header.biayaPengurang / 100);
      const fob = barang.nilaiBarang + nilaiTambah;
      const freight = persenatase * fob;
      const asuransi = Math.ceil(((fob + freight) * 0.005)* 100 )/ 100;
      const cif = fob + freight + asuransi;
      const hargaSatuan = barang.jumlahSatuan ? Math.ceil((fob / barang.jumlahSatuan) * 100) / 100 : 0;
      const cifRupiah = cif * header.ndpbm;

      setBarang((prev: any) => {
      if (
        prev.fob === fob &&
        prev.cif === cif &&
        prev.hargaSatuan === hargaSatuan &&
        prev.cifRupiah === cifRupiah &&
        prev.freight === freight &&
        prev.asuransi === asuransi &&
        prev.nilaiTambah === nilaiTambah
      ) {
        return prev; // tidak update → tidak trigger ulang
      }

      return {
        ...prev,
        fob,
        cif,
        hargaSatuan,
        cifRupiah,
        freight,
        asuransi,
        nilaiTambah,
      };
    });
  }, [
    barang.nilaiBarang,
    barang.jumlahSatuan,
    header.freight,
    header.fob,
    header.ndpbm,
    header.biayaTambahan,
    header.biayaPengurang,
  ]);


  const bmItem = barang.barangTarif?.find((item: any) =>
        ["BM", "BMKITE"].includes(item.kodeJenisPungutan)
    );
    const [IsSpecificBM, setIsSpecificBM] = useState(false);
    const [IsSpecificBMAD, setIsSpecificBMAD] = useState(false);
    const [IsSpecificBMI, setIsSpecificBMI] = useState(false);
    const [IsSpecificBMP, setIsSpecificBMP] = useState(false);
    const [IsSpecificBMTP, setIsSpecificBMTP] = useState(false);
    const [IsSpecificCukai, setIsSpecificCukai] = useState(false);
    useEffect(() => {
        const list = barang.barangTarif ?? [];

        const isBM = list.some(
            (item: any) =>
                (item.kodeJenisPungutan === "BM" || item.kodeJenisPungutan === "BMKITE") &&
                item.kodeJenisTarif === "2"
        );

        const bmad = list.some(
            (item: any) =>
                item.kodeJenisPungutan === "BMAD" &&
                item.kodeJenisTarif === "2"
        );
        const bmtp = list.some(
            (item: any) =>
                item.kodeJenisPungutan === "BMTP" &&
                item.kodeJenisTarif === "2"
        );

        const bmi = list.some(
            (item: any) =>
                item.kodeJenisPungutan === "BMI" &&
                item.kodeJenisTarif === "2"
        );

        const bmp = list.some(
            (item: any) =>
                item.kodeJenisPungutan === "BMP" &&
                item.kodeJenisTarif === "2"
        );
        setIsSpecificBM(prev => prev !== isBM ? isBM : prev);
        setIsSpecificBMAD(prev => prev !== bmad ? bmad : prev);
        setIsSpecificBMI(prev => prev !== bmi ? bmi : prev);
        setIsSpecificBMP(prev => prev !== bmp ? bmp : prev);
        setIsSpecificBMTP(prev => prev !== bmtp ? bmtp : prev);
        const cukai = list.some(
            (item: any) =>
                item.kodeJenisPungutan === "Cukai" &&
                item.kodeJenisTarif === "2"
        );
        setIsSpecificCukai(prev => prev !== cukai ? cukai : prev);
    }, [barang.barangTarif]);

    useEffect(() => {
      barang.ndpbm = header.ndpbm;
    }, [header.ndpbm]);
    return (
    <div>
        <Card
          title="Tambah Barang"
          headerStyle={{ backgroundColor: "#f5f5f5"}}
          headerCustom={(
            readOnlyView ? 
            <Button size="sm" variant="outline-secondary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} 
                onClick={() => {setActiveForm(false);}}> 
                <span style={{paddingTop:1, minWidth:70}}>Kembali</span>                
            </Button> : (
            <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Button size="sm" variant="primary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} 
                    onClick={() => { handleSimpan();}}>
                    <span style={{paddingTop:1, minWidth:70}}>Simpan</span>                
                </Button>
                <Button size="sm" variant="outline-secondary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} 
                onClick={() => {setActiveForm(false);}}> 
                    <span style={{paddingTop:1, minWidth:70}}>Batal</span>                
                </Button>
            </div>
            )
          )}
        >
        <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          <Card
            title="Jenis"
            headerStyle={{ backgroundColor: "#f5f5f5"}} 
          >
            <Card.Input
              label="Seri"
              name="seriBarang"
              value={barang.seriBarang || generateSeri()}
              onChange={(val) => updateBarang("seriBarang", val)}
              error={!barang.seriBarang ? "Seri wajib diisi" : ""}
              readonly={true}
            />
            <Card.Select
              label="HS"
              name="posTarif"
              value={barang.posTarif}
              onChange={(val) => updateBarang("posTarif", val)}
              error={!barang.posTarif ? "HS wajib diisi" : ""}
              list={[]} // ganti dengan list kode barang yang valid
              readonly={readOnlyView}
            />
            <div style={{ display: "flex", flexDirection: "column", fontWeight: 500, fontSize: 12, gap: 4, marginBottom: 8}}>
              <span>Lartas</span>
              <div style={{ display: "flex", flexDirection: "row", fontWeight: 500, fontSize: 12, padding: 12, backgroundColor: "#fff7db", alignItems: "center", gap: 6}}>
                <FaCircleExclamation style={{color:"orange"}}/> <span style={{color:"black"}}>HS Terkena Lartas</span>
              </div>
            </div>

            <Card.Input
              label="Kode"
              name="kodeBarang"
              value={barang.kodeBarang}
              onChange={(val) => updateBarang("kodeBarang", val)}
              readonly={readOnlyView}
            />

            <Card.Textarea
              label={
                <>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                  Uraian
                  {!readOnlyView && (
                  <Button size="sm" variant="primary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} 
                    onClick={() => {
                      pushUraianHS();
                    }}>
                    <span style={{paddingTop:1, minWidth:70}}>Sesuai HS</span>
                  </Button>
                  )}
                  </div>
                </>
              }
              name="uraian"
              value={barang.uraian}
              onChange={(val) => updateBarang("uraian", val.target.value)}
              error={!barang.uraian ? "Uraian wajib diisi" : ""}
              readonly={readOnlyView}
            />
            
            <Card.Input
              label="Merk"
              name="merk"
              value={barang.merk}
              onChange={(val) => updateBarang("merk", val)}
              readonly={readOnlyView}
            />

            <Card.Input
              label="Tipe"
              name="tipe"
              value={barang.tipe}
              onChange={(val) => updateBarang("tipe", val)}
              readonly={readOnlyView}
            />
            <Card.Input
              label="Ukuran"
              name="ukuran"
              value={barang.ukuran}
              onChange={(val) => updateBarang("ukuran", val)}
              readonly={readOnlyView}
            />

            <Card.Input
              label="Spesifikasi Lain"
              name="spesifikasiLain"
              value={barang.spesifikasiLain}
              onChange={(val) => updateBarang("spesifikasiLain", val)}
              readonly={readOnlyView}
            />
          </Card>

          <Card 
              title=""
              bodyStyle={{ display: "flex", flexDirection:"column", padding: 0, gap: 10, justifyContent:"space-between", height:"100%"}}
              style={{backgroundColor:"transparent", border:"none", boxShadow:"none"}}      
              >
              <Card 
                  title="Keterangan Lainnya"
                  style={{height:"100%"}}
              >
                  <Card.Select
                      label="Kategori Barang"
                      name="kodeKategoriBarang"
                      value={barang.kodeKategoriBarang}
                      onChange={(val) => {updateBarang("kodeKategoriBarang", val),
                        updateBarang("kodeDokumen", ListKategoriBarang.find(item => item.kodeKategoriBarang === val)?.kodeDokumen)
                      }}
                      list={ListKategoriBarang.map(item => ({ value: item.kodeKategoriBarang, label: `${item.kodeKategoriBarang} - ${item.uraian}` }))} // ganti dengan list kode kategori yang valid
                      readonly={readOnlyView}
                  />
                  <Card.Select
                      label="Negara"
                      name="kodeNegaraAsal"
                      value={barang.kodeNegaraAsal}
                      onChange={(val) => updateBarang("kodeNegaraAsal", val)}
                      error={!barang.kodeNegaraAsal ? "Kode Negara wajib diisi" : ""}
                      list={ListNegara.map(item => ({ value: item.value, label: `${item.value} - ${item.label}` }))} // ganti dengan list kode negara yang valid
                      readonly={readOnlyView} 
                  />
              </Card>
              <Card
                  title="Harga"
                  style={{ height:"100%"}}
                  >
                    <Card.Numeric
                        label="Harga"
                        name="nilaiBarang"
                        value={barang.nilaiBarang}
                        onChange={(val) => updateBarang("nilaiBarang", val)}
                        readonly={readOnlyView}
                        error={barang.nilaiBarang <= 0 ? "Harga harus lebih dari 0" : ""}
                    />
                    <Card.Numeric
                        label="Biaya Tambahan"
                        name="nilaiTambah"
                        value={barang.nilaiTambah}
                        onChange={(val) => updateBarang("nilaiTambah", val)}
                        readonly={true}
                    />
                    <Card.Numeric
                        label="FOB"
                        name="fob"
                        value={barang.fob}
                        onChange={(val) => updateBarang("fob", val)}
                        readonly={true}
                    />
                    <Card.Numeric
                        label="Harga Satuan"
                        name="hargaSatuan"
                        value={barang.hargaSatuan}
                        onChange={(val) => updateBarang("hargaSatuan", val)}
                        readonly={true}
                    />
                    <Card.Numeric
                        label="Freight"
                        name="freight"
                        value={barang.freight}
                        onChange={(val) => updateBarang("freight", val)}
                        readonly={true}
                    />
                    <Card.Numeric
                        label="Asuransi"
                        name="asuransi"
                        value={barang.asuransi}
                        onChange={(val) => updateBarang("asuransi", val)}
                        readonly={true}
                    />
                    <Card.Numeric
                        label="Nilai CIF"
                        name="cif"
                        value={barang.cif}
                        onChange={(val) => updateBarang("cif", val)}
                        readonly={true}
                    />
                    <Card.Numeric
                        label="Nilai Pabean"
                        name="cifRupiah"
                        value={barang.cifRupiah}
                        onChange={(val) => updateBarang("cifRupiah", val)}
                        readonly={true}
                    />
              </Card>
          </Card>
          <Card 
              title=""
              bodyStyle={{ display: "flex", flexDirection:"column", padding: 0, gap: 10, justifyContent:"space-between", height:"100%"}}
              style={{backgroundColor:"transparent", border:"none", boxShadow:"none"}}      
              >
              <Card 
                  title="Jumlah & Berat"
                  style={{height:"100%"}}
              >
                <div style={{display:"flex", flexDirection:"row", gap: 8}}>
                  <Card.Numeric
                      label="Satuan"
                      name="jumlahSatuan"
                      value={barang.jumlahSatuan}
                      onChange={(val) => updateBarang("jumlahSatuan", val)}
                      readonly={readOnlyView}
                  />
                  <Card.Select
                      label={"\u00A0"}
                      name="kodeSatuanBarang"
                      value={barang.kodeSatuanBarang}
                      onChange={(val) => updateBarang("kodeSatuanBarang", val)}
                      error={!barang.kodeSatuanBarang ? "Kode Satuan wajib diisi" : ""}
                      list={ListSatuanBarang.map((item) => ({ label: `${item.tableKey} - ${item.tableValue}`, value: item.tableKey }))} // ganti dengan list kode satuan yang valid
                      readonly={readOnlyView}
                  />
                </div>
                <div style={{display:"flex", flexDirection:"row", gap: 8}}>
                  <Card.Numeric
                      label="Kemasan"
                      name="jumlahKemasan"
                      value={barang.jumlahKemasan}
                      onChange={(val) => updateBarang("jumlahKemasan", val)}
                      readonly={readOnlyView}
                      error={barang.jumlahKemasan <= 0 ? "Jumlah Kemasan harus lebih dari 0" : ""}
                  />
                  <Card.Select
                      label={"\u00A0"}
                      name="kodeJenisKemasan"
                      value={barang.kodeJenisKemasan}
                      onChange={(val) => updateBarang("kodeJenisKemasan", val)}
                      error={!barang.kodeJenisKemasan ? "Kode Jenis Kemasan wajib diisi" : ""}
                      list={ListJenisKemasan.map((item) => ({ label: `${item.value} - ${item.label}`, value: item.value }))} // ganti dengan list kode jenis kemasan yang valid
                      readonly={readOnlyView}
                  />
                </div>
                  <Card.Numeric
                      label="Berat Bersih (KG)"
                      name="netto"
                      value={barang.netto}
                      onChange={(val) => updateBarang("netto", val)}
                      readonly={readOnlyView}
                  />
              </Card>
              <Card
                  title="Dokumen Fasilitas/Lartas"
                  style={{ height:"100%"}}
                  headerCustom={(
                        readOnlyView ? null : (
                              <Button size="sm" variant="primary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} onClick={() => setShowForm(true)}>
                                  <FaPlusCircle/><span style={{paddingTop:1}}>Tambah</span>                
                              </Button>
                          )
                            )}
                  >
                  <CustomTable
                  title=""
                  containerStyle={{ background: "#f9fafc", padding: 0}}
                  headerStyle={{marginBottom:0}}
                  actionContainerStyle={{ gap: 15 }}
                  tableStyle={{ fontSize: 12, marginBottom: 0 }}
                  columns={[
                      { header: "Seri", accessor: "seriDokumen",thStyle:{ textAlign: "center" }, tdStyle: { minWidth: 50, textAlign: "center" } },
                      { header: "Jenis", accessor: "nomorDokumen", tdStyle: { minWidth: 100}, },
                      { header: "Nomor", accessor: "fasilitasDokumen" ,tdStyle: { minWidth: 100} },
                      { header: "Izin", accessor: "izinDokumen", tdStyle: { minWidth: 100} },
                      { header: "Kantor", accessor: "kantorDokumen", tdStyle: { minWidth: 100} },
                      { header: "File", accessor: "fileDokumen", tdStyle: { minWidth: 100} },
                      {
                          header: "Action",
                          accessor: "id",
                          tdStyle: { minWidth: 100 },
                          // render: (row, index) => (
                          //     <div style={{ display: "flex", gap: 6 }}>
                          //     <Button
                          //         size="sm"
                          //         variant="outline-warning"
                          //         onClick={() => handleEditDokumen(row, index)}
                          //     >
                          //         Edit
                          //     </Button>

                          //     <Button
                          //         size="sm"
                          //         variant="outline-danger"
                          //         onClick={() => handleDeleteDokumen(index)}
                          //         // onClick={() => handleDelete(index)}
                          //     >
                          //         Hapus
                          //     </Button>
                          //     </div>
                          // ),
                      },
                  ]}
                  data={data}   
                  striped={false}
                  bordered={false}
                  hover={true}
                  responsive={true}
                  className="custom-table"
              />
              </Card>
          </Card>
        </div>
      </Card>
      <Card 
              title=""
              bodyStyle={{ display: "flex", flexDirection:"row", padding: 12, gap: 8, justifyContent:"space-between", height:"100%"}}     
              >
              <Card 
                  title=""
                  bodyStyle={{ display: "flex", flexDirection:"column", padding: 0, gap: 10, justifyContent:"space-between", height:"100%"}}
                  style={{backgroundColor:"transparent", border:"none", boxShadow:"none"}} 
              >
                <Card 
                
                  title="BM"
                  style={{height:"100%"}}
                >
                  <div style={{display:"flex", flexDirection:"row", gap: 8, flexWrap:"wrap", }}>
                    <div style={{display:"flex", flexDirection:"row", gap: 6, width:"100%"}}>
                      <Card.Select
                          label="Jenis Pungutan"
                          name="kodeJenisPungutan"
                          value={bmItem?.kodeJenisPungutan || ""}
                          onChange={(val) => {updateBarangTarifOpsional(val.toString())}}
                          list={ListPungutan?.filter(item => 
                                  ["BM", "BMKITE"].includes(item.value)
                              )}
                          readonly={readOnlyView}
                      />
                      <Card.Select
                          label="Jenis Tarif"
                          name="kodeJenisTarif"
                          value={bmItem?.kodeJenisTarif || ""}
                          onChange={(val) => {
                            if (!bmItem?.kodeJenisPungutan) return;

                            updateBarangTarifOpsional(
                              bmItem.kodeJenisPungutan,
                              "kodeJenisTarif",
                              val
                            );
                          }}
                          list={ListJenisTarif}
                          readonly={readOnlyView}
                      />
                    </div>
                  {IsSpecificBM && (
                    <div style={{display:"flex", flexDirection:"row", gap: 8, width:"100%"}}>
                    <Card.Numeric
                      label="Jumlah Satuan"
                      name="JumlahSatuan"
                      value={bmItem?.jumlahSatuan || ""}
                      onChange={(val) => {
                        if (!bmItem?.kodeJenisPungutan) return;

                            updateBarangTarifOpsional(
                              bmItem.kodeJenisPungutan,
                              "jumlahSatuan",
                              val
                            );
                          }
                        }
                      readonly={readOnlyView}
                    />
                    <Card.Select
                      label="Satuan Barang"
                      name="SatuanBarang"
                      value={bmItem?.kodeSatuanBarang || ""}
                      onChange={(val) => {
                        if (!bmItem?.kodeJenisPungutan) return;
                            updateBarangTarifOpsional(
                              bmItem.kodeJenisPungutan,
                              "kodeSatuanBarang",
                              val
                            );
                          }}
                      list={ListSatuanBarang.map((item) => ({ label: `${item.tableKey} - ${item.tableValue}`, value: item.tableKey }))} // ganti dengan list kode satuan yang valid
                      readonly={readOnlyView}
                    />
                    </div>
                  )}
                  <div style={{display:"flex", flexDirection:"row", gap: 6, width:"100%"}}>
                  <Card.Numeric
                      label="Tarif"
                      name="tarif"
                      value={bmItem?.tarif || ""}
                      onChange={(val) => {
                        if (!bmItem?.kodeJenisPungutan) return;
                            updateBarangTarifOpsional(
                              bmItem.kodeJenisPungutan,
                              "tarif",
                              val
                            );
                          }}
                      readonly={readOnlyView}
                      labelUnit={{"1": "%", "2": "", null:""}[bmItem?.kodeJenisTarif || "1"]}
                  />
                   <Card.Select
                      label="Fasilitas Tarif"
                      name="kodeFasilitasTarif"
                      value={bmItem?.kodeFasilitasTarif || ""}
                      onChange={(val) => {
                        if (!bmItem?.kodeJenisPungutan) return;
                        updateBarangTarifOpsional(
                          bmItem.kodeJenisPungutan,
                          "kodeFasilitasTarif",
                          val
                        );
                        updateBarang("kodeDokumen", ListKategoriBarang.find(item => item.kodeKategoriBarang === val)?.kodeDokumen)
                      }}
                      list={ListFalsitasTarif} // ganti dengan list kode kategori yang valid
                      readonly={readOnlyView}
                  />
                  <Card.Numeric
                      label="Tarif Fasilitas"
                      name="tarifFasilitas"
                      value={bmItem?.tarifFasilitas || ""}
                      onChange={(val) => {
                        if (!bmItem?.kodeJenisPungutan) return;
                            updateBarangTarifOpsional(
                              bmItem.kodeJenisPungutan,
                              "tarifFasilitas",
                              val
                            );
                      }}
                      readonly={readOnlyView}
                      labelUnit={{"1": "%", "2": "", null:""}[bmItem?.kodeJenisTarif || "1"]}
                  />
                  </div>
                  </div>
                </Card>
                <Card
                  title="BMT"
                  style={!checkedBMT ? { height: "100%" } : {}}
                  bodyStyle={!checkedBMT ? { padding: 0 } : {}}
                  headerCustom={
                    <Button
                      size="sm"
                      variant={""}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 0,
                        fontSize: 16,
                      }}
                      onClick={() => setCheckedBMT(!checkedBMT)}
                    >
                      {checkedBMT ? <FaSquareCheck style={{border:"1px solid black",padding:0, color: "#007bff"}} /> : <FaSquare color="white" style={{border: "1px solid black"}} />}
                    </Button>
                  }
                >
                  {checkedBMT && (
                  <div style={{display:"flex", flexDirection:"row", gap: 8}}>
                  <div className="label" style={{height:"inherit", paddingRight:"20px", }}>
                    <div> BMAD</div>
                    <div style={{display:"flex", flexDirection:"row", gap: 6}}><input type="checkbox" name="" id="" onChange={() => setCheckedCukai(!checkedCukai)}/><span>Sementara</span></div>
                    
                  </div>
                  <div style={{display:"flex", flexDirection:"row", gap: 8, flexWrap:"wrap", }}>
                    <div style={{display:"flex", flexDirection:"row", gap: 6, width:"100%"}}>
                      <Card.Select
                          label="Jenis Tarif"
                          name="kodeJenisTarif"
                          value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMAD")[0]?.kodeJenisTarif}
                          onChange={(val) => {updateBarangTarifOpsional("BMAD","kodeJenisTarif", val)}}
                          list={ListJenisTarif}
                          readonly={readOnlyView}
                      />
                    </div>
                  {IsSpecificBMAD && (
                    <div style={{display:"flex", flexDirection:"row", gap: 8, width:"100%"}}>
                    <Card.Numeric
                      label="Jumlah Satuan"
                      name="JumlahSatuan"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMAD")[0]?.jumlahSatuan}
                      onChange={(val) => updateBarangTarifOpsional("BMAD","jumlahSatuan", val)} 
                      readonly={readOnlyView}
                    />
                    <Card.Select
                      label="Satuan Barang"
                      name="SatuanBarang"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMAD")[0]?.kodeSatuanBarang}
                      onChange={(val) => updateBarangTarifOpsional("BMAD","kodeSatuanBarang", val)}
                      list={ListSatuanBarang.map((item) => ({ label: `${item.tableKey} - ${item.tableValue}`, value: item.tableKey }))} // ganti dengan list kode satuan yang valid
                      readonly={readOnlyView}
                    />
                    </div>
                  )}
                  <div style={{display:"flex", flexDirection:"row", gap: 6, width:"100%"}}>
                  <Card.Numeric
                      label="Tarif"
                      name="tarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMAD")[0]?.tarif}
                      onChange={(val) => updateBarangTarifOpsional("BMAD","tarif", val)}
                      readonly={readOnlyView}
                      labelUnit={{"1": "%", "2": "", null:""}[barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMAD")[0]?.kodeJenisTarif || "1"]}
                  />
                   <Card.Select
                      label="Fasilitas Tarif"
                      name="kodeFasilitasTarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMAD")[0]?.kodeFasilitasTarif}
                      onChange={(val) => {updateBarangTarifOpsional("BMAD","kodeFasilitasTarif", val),
                        updateBarang("kodeDokumen", ListKategoriBarang.find(item => item.kodeKategoriBarang === val)?.kodeDokumen)
                      }}
                      list={ListFalsitasTarif} // ganti dengan list kode kategori yang valid
                      readonly={readOnlyView}
                  />
                  <Card.Numeric
                      label="Tarif Fasilitas"
                      name="tarifFasilitas"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMAD")[0]?.tarifFasilitas}
                      onChange={(val) => updateBarangTarifOpsional("BMAD","tarifFasilitas", val)}
                      readonly={readOnlyView}
                      labelUnit={{"1": "%", "2": "", null:""}[barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMAD")[0]?.kodeJenisTarif || "1"]}
                  />
                  </div>
                  </div>
                  </div>
                  
                )}
                {checkedBMT && (
                  <div style={{display:"flex", flexDirection:"row", gap: 8}}>
                  <div className="label" style={{height:"inherit", paddingRight:"20px", }}>
                    <div> BMTP</div>
                    <div style={{display:"flex", flexDirection:"row", gap: 6}}><input type="checkbox" name="" id="" onChange={() => setCheckedCukai(!checkedCukai)}/><span>Sementara</span></div>
                    
                  </div>
                  <div style={{display:"flex", flexDirection:"row", gap: 8, flexWrap:"wrap", }}>
                    <div style={{display:"flex", flexDirection:"row", gap: 6, width:"100%"}}>
                      <Card.Select
                          label="Jenis Tarif"
                          name="kodeJenisTarif"
                          value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMTP")[0]?.kodeJenisTarif}
                          onChange={(val) => {updateBarangTarifOpsional("BMTP","kodeJenisTarif", val)}}
                          list={ListJenisTarif}
                          readonly={readOnlyView}
                      />
                    </div>
                  {IsSpecificBMTP && (
                    <div style={{display:"flex", flexDirection:"row", gap: 8, width:"100%"}}>
                    <Card.Numeric
                      label="Jumlah Satuan"
                      name="JumlahSatuan"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMTP")[0]?.jumlahSatuan}
                      onChange={(val) => updateBarangTarifOpsional("BMTP","jumlahSatuan", val)} 
                      readonly={readOnlyView}
                    />
                    <Card.Select
                      label="Satuan Barang"
                      name="SatuanBarang"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMTP")[0]?.kodeSatuanBarang}
                      onChange={(val) => updateBarangTarifOpsional("BMTP","kodeSatuanBarang", val)}
                      list={ListSatuanBarang.map((item) => ({ label: `${item.tableKey} - ${item.tableValue}`, value: item.tableKey }))} // ganti dengan list kode satuan yang valid
                      readonly={readOnlyView}
                    />
                    </div>
                  )}
                  <div style={{display:"flex", flexDirection:"row", gap: 6, width:"100%"}}>
                  <Card.Numeric
                      label="Tarif"
                      name="tarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMTP")[0]?.tarif}
                      onChange={(val) => updateBarangTarifOpsional("BMTP","tarif", val)}
                      readonly={readOnlyView}
                      labelUnit={{"1": "%", "2": "", null:""}[barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMTP")[0]?.kodeJenisTarif || "1"]}
                  />
                  <Card.Select
                      label="Fasilitas Tarif"
                      name="kodeFasilitasTarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMTP")[0]?.kodeFasilitasTarif}
                      onChange={(val) => {updateBarangTarifOpsional("BMTP","kodeFasilitasTarif", val),
                        updateBarang("kodeDokumen", ListKategoriBarang.find(item => item.kodeKategoriBarang === val)?.kodeDokumen)
                      }}
                      list={ListFalsitasTarif} // ganti dengan list kode kategori yang valid
                      readonly={readOnlyView}
                  />
                  <Card.Numeric
                      label="Tarif Fasilitas"
                      name="tarifFasilitas"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMTP")[0]?.tarifFasilitas}
                      onChange={(val) => updateBarangTarifOpsional("BMTP","tarifFasilitas", val)}
                      readonly={readOnlyView}
                      labelUnit={{"1": "%", "2": "", null:""}[barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMTP")[0]?.kodeJenisTarif || "1"]}
                  />
                  </div>
                  </div>
                  </div>
                  
                )}
                {checkedBMT && (
                  <div style={{display:"flex", flexDirection:"row", gap: 8}}>
                  <div className="label" style={{height:"inherit", paddingRight:"20px", }}>
                    <div> BMI</div>
                    <div style={{display:"flex", flexDirection:"row", gap: 6}}><input type="checkbox" name="" id="" onChange={() => setCheckedCukai(!checkedCukai)}/><span>Sementara</span></div>
                    
                  </div>
                  <div style={{display:"flex", flexDirection:"row", gap: 8, flexWrap:"wrap", }}>
                    <div style={{display:"flex", flexDirection:"row", gap: 6, width:"100%"}}>
                      <Card.Select
                          label="Jenis Tarif"
                          name="kodeJenisTarif"
                          value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMI")[0]?.kodeJenisTarif}
                          onChange={(val) => {updateBarangTarifOpsional("BMI","kodeJenisTarif", val)}}
                          list={ListJenisTarif}
                          readonly={readOnlyView}
                      />
                    </div>
                  {IsSpecificBMI && (
                    <div style={{display:"flex", flexDirection:"row", gap: 8, width:"100%"}}>
                    <Card.Numeric
                      label="Jumlah Satuan"
                      name="JumlahSatuan"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMI")[0]?.jumlahSatuan}
                      onChange={(val) => updateBarangTarifOpsional("BMI","jumlahSatuan", val)} 
                      readonly={readOnlyView}
                    />
                    <Card.Select
                      label="Satuan Barang"
                      name="SatuanBarang"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMI")[0]?.kodeSatuanBarang}
                      onChange={(val) => updateBarangTarifOpsional("BMI","kodeSatuanBarang", val)}
                      list={ListSatuanBarang.map((item) => ({ label: `${item.tableKey} - ${item.tableValue}`, value: item.tableKey }))} // ganti dengan list kode satuan yang valid
                      readonly={readOnlyView}
                    />
                    </div>
                  )}
                  <div style={{display:"flex", flexDirection:"row", gap: 6, width:"100%"}}>
                  <Card.Numeric
                      label="Tarif"
                      name="tarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMI")[0]?.tarif}
                      onChange={(val) => updateBarangTarifOpsional("BMI","tarif", val)}
                      readonly={readOnlyView}
                      labelUnit={{"1": "%", "2": "", null:""}[barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMI")[0]?.kodeJenisTarif || "1"]}
                  />
                   <Card.Select
                      label="Fasilitas Tarif"
                      name="kodeFasilitasTarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMI")[0]?.kodeFasilitasTarif}
                      onChange={(val) => {updateBarangTarifOpsional("BMI","kodeFasilitasTarif", val),
                        updateBarang("kodeDokumen", ListKategoriBarang.find(item => item.kodeKategoriBarang === val)?.kodeDokumen)
                      }}
                      list={ListFalsitasTarif} // ganti dengan list kode kategori yang valid
                      readonly={readOnlyView}
                  />
                  <Card.Numeric
                      label="Tarif Fasilitas"
                      name="tarifFasilitas"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMI")[0]?.tarifFasilitas}
                      onChange={(val) => updateBarangTarifOpsional("BMI","tarifFasilitas", val)}
                      readonly={readOnlyView}
                      labelUnit={{"1": "%", "2": "", null:""}[barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMI")[0]?.kodeJenisTarif || "1"]}
                  />
                  </div>
                  </div>
                  </div>
                  
                )}
                {checkedBMT && (
                  <div style={{display:"flex", flexDirection:"row", gap: 8}}>
                  <div className="label" style={{height:"inherit", paddingRight:"20px", }}>
                    <div> BMP</div>
                    <div style={{display:"flex", flexDirection:"row", gap: 6}}><input type="checkbox" name="" id="" onChange={() => setCheckedCukai(!checkedCukai)}/><span>Sementara</span></div>
                    
                  </div>
                  <div style={{display:"flex", flexDirection:"row", gap: 8, flexWrap:"wrap", }}>
                    <div style={{display:"flex", flexDirection:"row", gap: 6, width:"100%"}}>
                      <Card.Select
                          label="Jenis Tarif"
                          name="kodeJenisTarif"
                          value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMP")[0]?.kodeJenisTarif}
                          onChange={(val) => {updateBarangTarifOpsional("BMP","kodeJenisTarif", val)}}
                          list={ListJenisTarif}
                          readonly={readOnlyView}
                      />
                    </div>
                  {IsSpecificBMP && (
                    <div style={{display:"flex", flexDirection:"row", gap: 8, width:"100%"}}>
                    <Card.Numeric
                      label="Jumlah Satuan"
                      name="JumlahSatuan"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMP")[0]?.jumlahSatuan}
                      onChange={(val) => updateBarangTarifOpsional("BMP","jumlahSatuan", val)} 
                      readonly={readOnlyView}
                    />
                    <Card.Select
                      label="Satuan Barang"
                      name="SatuanBarang"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMP")[0]?.kodeSatuanBarang}
                      onChange={(val) => updateBarangTarifOpsional("BMP","kodeSatuanBarang", val)}
                      list={ListSatuanBarang.map((item) => ({ label: `${item.tableKey} - ${item.tableValue}`, value: item.tableKey }))} // ganti dengan list kode satuan yang valid
                      readonly={readOnlyView}
                    />
                    </div>
                  )}
                  <div style={{display:"flex", flexDirection:"row", gap: 6, width:"100%"}}>
                  <Card.Numeric
                      label="Tarif"
                      name="tarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMP")[0]?.tarif}
                      onChange={(val) => updateBarangTarifOpsional("BMP","tarif", val)}
                      readonly={readOnlyView}
                      labelUnit={{"1": "%", "2": "", null:""}[barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMP")[0]?.kodeJenisTarif || "1"]}
                  />
                  <Card.Select
                      label="Fasilitas Tarif"
                      name="kodeFasilitasTarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMP")[0]?.kodeFasilitasTarif}
                      onChange={(val) => {updateBarangTarifOpsional("BMP","kodeFasilitasTarif", val),
                        updateBarang("kodeDokumen", ListKategoriBarang.find(item => item.kodeKategoriBarang === val)?.kodeDokumen)
                      }}
                      list={ListFalsitasTarif} // ganti dengan list kode kategori yang valid
                      readonly={readOnlyView}
                  />
                  <Card.Numeric
                      label="Tarif Fasilitas"
                      name="tarifFasilitas"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMP")[0]?.tarifFasilitas}
                      onChange={(val) => updateBarangTarifOpsional("BMP","tarifFasilitas", val)}
                      readonly={readOnlyView}
                      labelUnit={{"1": "%", "2": "", null:""}[barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "BMP")[0]?.kodeJenisTarif || "1"]}
                  />
                  </div>
                  </div>
                  </div>
                  
                )}
                </Card>
                <Card
                  title="Cukai"
                  style={!checkedCukai ? { height: "100%" } : {}}
                  bodyStyle={!checkedCukai ? { padding: 0 } : {}}
                  headerCustom={
                    <Button
                      size="sm"
                      variant={""}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 0,
                        fontSize: 16,
                      }}
                      onClick={() => setCheckedCukai(!checkedCukai)}
                    >
                      {checkedCukai ? <FaSquareCheck style={{border:"1px solid black",padding:0, color: "#007bff"}} /> : <FaSquare color="white" style={{border: "1px solid black"}} />}
                    </Button>
                  }
                >
                  {checkedCukai && (
                  <div style={{display:"flex", flexDirection:"row", gap: 8}}>
                  <div className="label" style={{height:"inherit", paddingRight:"20px", }}>
                    <div> Cukai</div>
                    <div style={{display:"flex", flexDirection:"row", gap: 6}}><input type="checkbox" name="" id="" onChange={() => setCheckedCukai(!checkedCukai)}/><span>Sementara</span></div>
                    
                  </div>
                  <div style={{display:"flex", flexDirection:"row", gap: 8, flexWrap:"wrap", }}>
                    <div style={{display:"flex", flexDirection:"row", gap: 6, width:"100%"}}>
                      <Card.Select
                          label="Jenis Tarif"
                          name="kodeJenisTarif"
                          value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "Cukai")[0]?.kodeJenisTarif}
                          onChange={(val) => {updateBarangTarifOpsional("Cukai","kodeJenisTarif", val)}}
                          list={ListJenisTarif}
                          readonly={readOnlyView}
                      />
                    </div>
                  {IsSpecificCukai && (
                    <div style={{display:"flex", flexDirection:"row", gap: 8, width:"100%"}}>
                    <Card.Numeric
                      label="Jumlah Satuan"
                      name="JumlahSatuan"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "Cukai")[0]?.jumlahSatuan}
                      onChange={(val) => updateBarangTarifOpsional("Cukai","jumlahSatuan", val)} 
                      readonly={readOnlyView}
                    />
                    <Card.Select
                      label="Satuan Barang"
                      name="SatuanBarang"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "Cukai")[0]?.kodeSatuanBarang}
                      onChange={(val) => updateBarangTarifOpsional("Cukai","kodeSatuanBarang", val)}
                      list={ListSatuanBarang.map((item) => ({ label: `${item.tableKey} - ${item.tableValue}`, value: item.tableKey }))} // ganti dengan list kode satuan yang valid
                      readonly={readOnlyView}
                    />
                    </div>
                  )}
                  <div style={{display:"flex", flexDirection:"row", gap: 6, width:"100%"}}>
                  <Card.Numeric
                      label="Tarif"
                      name="tarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "Cukai")[0]?.tarif}
                      onChange={(val) => updateBarangTarifOpsional("Cukai","tarif", val)}
                      readonly={readOnlyView}
                      labelUnit={{"1": "%", "2": "", null:""}[barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "Cukai")[0]?.kodeJenisTarif || "1"]}
                  />
                  <Card.Select
                      label="Fasilitas Tarif"
                      name="kodeFasilitasTarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "Cukai")[0]?.kodeFasilitasTarif}
                      onChange={(val) => {updateBarangTarifOpsional("Cukai","kodeFasilitasTarif", val),
                        updateBarang("kodeDokumen", ListKategoriBarang.find(item => item.kodeKategoriBarang === val)?.kodeDokumen)
                      }}
                      list={ListFalsitasTarif} // ganti dengan list kode kategori yang valid
                      readonly={readOnlyView}
                  />
                  <Card.Numeric
                      label="Tarif Fasilitas"
                      name="tarifFasilitas"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "Cukai")[0]?.tarifFasilitas}
                      onChange={(val) => updateBarangTarifOpsional("Cukai","tarifFasilitas", val)}
                      readonly={readOnlyView}
                      labelUnit={{"1": "%", "2": "", null:""}[barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "Cukai")[0]?.kodeJenisTarif || "1"]}
                  />
                  </div>
                  </div>
                  </div>
                  
                )}
                </Card>
              </Card>
              <Card
                  title="PDRI"
                  style={{ height:"100%"}}
                  >
                  <div style={{display:"flex", flexDirection:"row", gap: 8}}>
                    <div className="label" style={{height:"inherit", minWidth:"100px", alignItems:"center", display:"flex", paddingRight:"50px", }}>
                      <div>PPN</div>
                    </div>
              
                  <Card.Numeric
                      label="Tarif"
                      name="tarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "PPN")[0]?.tarif}
                      onChange={(val) => {updateBarangTarifOpsional("PPN","tarif", val)}}
                      readonly={readOnlyView}
                      labelUnit="%"
                  />
                   <Card.Select
                      label="Fasilitas Tarif"
                      name="kodeFasilitasTarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "PPN")[0]?.kodeFasilitasTarif}
                      onChange={(val) => {updateBarangTarifOpsional("PPN","kodeFasilitasTarif", val),
                        updateBarang("kodeDokumen", ListKategoriBarang.find(item => item.kodeKategoriBarang === val)?.kodeDokumen)
                      }}
                      //error={!barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "PPN")[0]?.kodeFasilitasTarif ? "Kategori Barang wajib diisi" : ""}
                      list={ListFalsitasTarif} // ganti dengan list kode kategori yang valid
                      readonly={readOnlyView}
                  />
                  <Card.Numeric
                      label="Tarif Fasilitas"
                      name="tarifFasilitas"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "PPN")[0]?.tarifFasilitas}
                      onChange={(val) => updateBarangTarifOpsional("PPN", "tarifFasilitas", val)}
                      readonly={readOnlyView}
                      labelUnit="%"
                  />
                  </div>

                  <div style={{display:"flex", flexDirection:"row", gap: 8}}>
                    <div className="label" style={{height:"inherit", minWidth:"100px", alignItems:"center", display:"flex", paddingRight:"50px", }}>
                      <div>PPNBM</div>
                    </div>
              
                  <Card.Numeric
                      label="Tarif"
                      name="tarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "PPNBM")[0]?.tarif}
                      onChange={(val) => {updateBarangTarifOpsional("PPNBM","tarif", val)}}
                      readonly={readOnlyView}
                      labelUnit="%"
                  />
                   <Card.Select
                      label="Fasilitas Tarif"
                      name="kodeFasilitasTarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "PPNBM")[0]?.kodeFasilitasTarif}
                      onChange={(val) => {updateBarangTarifOpsional("PPNBM","kodeFasilitasTarif", val),
                        updateBarang("kodeDokumen", ListKategoriBarang.find(item => item.kodeKategoriBarang === val)?.kodeDokumen)
                      }}
                      //error={!barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "PPNBM")[0]?.kodeFasilitasTarif ? "Kategori Barang wajib diisi" : ""}
                      list={ListFalsitasTarif} // ganti dengan list kode kategori yang valid
                      readonly={readOnlyView}
                  />
                  <Card.Numeric
                      label="Tarif Fasilitas"
                      name="tarifFasilitas"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "PPNBM")[0]?.tarifFasilitas}
                      onChange={(val) => updateBarangTarifOpsional("PPNBM", "tarifFasilitas", val)}
                      readonly={readOnlyView}
                      labelUnit="%"
                  />
                  </div>

                  <div style={{display:"flex", flexDirection:"row", gap: 8}}>
                    <div className="label" style={{height:"inherit", minWidth:"100px", alignItems:"center", display:"flex", paddingRight:"50px", }}>
                      <div>PPH</div>
                    </div>
              
                  <Card.Numeric
                      label="Tarif"
                      name="tarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "PPH")[0]?.tarif}
                      onChange={(val) => {updateBarangTarifOpsional("PPH","tarif", val)}}
                      readonly={readOnlyView}
                      labelUnit="%"
                  />
                   <Card.Select
                      label="Fasilitas Tarif"
                      name="kodeFasilitasTarif"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "PPH")[0]?.kodeFasilitasTarif}
                      onChange={(val) => {updateBarangTarifOpsional("PPH","kodeFasilitasTarif", val),
                        updateBarang("kodeDokumen", ListKategoriBarang.find(item => item.kodeKategoriBarang === val)?.kodeDokumen)
                      }}
                      //error={!barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "PPH")[0]?.kodeFasilitasTarif ? "Kategori Barang wajib diisi" : ""}
                      list={ListFalsitasTarif} // ganti dengan list kode kategori yang valid
                      readonly={readOnlyView}
                  />
                  <Card.Numeric
                      label="Tarif Fasilitas"
                      name="tarifFasilitas"
                      value={barang.barangTarif.filter((item: any) => item.kodeJenisPungutan === "PPH")[0]?.tarifFasilitas}
                      onChange={(val) => updateBarangTarifOpsional("PPH", "tarifFasilitas", val)}
                      readonly={readOnlyView}
                      labelUnit="%"
                  />
                  </div>
              </Card>
          </Card>
    </div>
  );
}