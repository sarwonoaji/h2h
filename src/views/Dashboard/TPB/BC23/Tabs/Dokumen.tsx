import { Button } from "react-bootstrap";
import Card from "../../../../../components/Card";
import { FaPlusCircle } from "react-icons/fa";
import CustomTable from "../../../../../components/TableList";
import { use, useEffect, useState } from "react";
import { ListDokumen } from "../../../../../services/loader/ListDokumen";
import moment from "moment";
import ModalManifest from "../Modals/ModalManifest";
import { FaCircleExclamation } from "react-icons/fa6";
import { ceisaService } from "../../../../../services/support/Ceisa/AccessCeisa";


const DokumenBC23Page = ({ data, setData, headers, setIsComplete }: any) => {

    const initForm = {
        seriDokumen: "",
        jenisDokumen: "",
        nomorDokumen: "",
        tanggalDokumen: "",
    };
    const [dataDokumen, setDataDokumen] = useState<any>(null);
    const [headState, setHeadState] = useState(() => ({
        kodeKantor: "",
        namaImportir: "",
        noHostBl: "",
        tglHostBl: "",
    }));
    console.log("Data Dokumen:", headState);
    console.log("Data Dokumen 2:", dataDokumen);
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [form, setForm] = useState({ ...initForm });
    const generateSeri = () => {
        if (data.length === 0) return "1";
        const maxSeri = Math.max(...data.map((item: any) => parseInt(item.seriDokumen)));
        return (maxSeri + 1).toString();
    };
    const [showForm, setShowForm] = useState(false);
    const handleInputChange = (field: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleSimpan = async () => {
    if (!form.jenisDokumen || !form.nomorDokumen || !form.tanggalDokumen) {
        alert("Lengkapi data terlebih dahulu");
        return;
    }

    if (!headers?.kodeKantor) {
        alert("Kode kantor tidak boleh kosong");
        return;
    }

    let res = null;

    if (form.jenisDokumen === "705" || form.jenisDokumen === "740") {
        setShowModal(true);

        const head = {
            noHostBl: form.nomorDokumen,
            tglHostBl: form.tanggalDokumen,
            kodeKantor: headers.kodeKantor,
            namaImportir: headers?.entitas?.find((x: any) => x.kodeEntitas === "3")?.namaEntitas || "",
        };

        setHeadState(head);

        try {
            res = await ceisaService.getManifes(
                head.kodeKantor,
                head.noHostBl,
                head.tglHostBl,
                head.namaImportir
            );
            console.log("Response Manifest:", res);
           if (res.data.respon !== "OK") {
                console.warn(res.data.respon);
            }

            setDataDokumen(res);

        } catch (err) {
            console.error(err);
            return;
        }
    }

    setData((prev: any) => {
        let updated = [...(prev.dokumen || [])];

        if (editingIndex !== null) {
            updated[editingIndex] = {
                ...updated[editingIndex],
                ...form,
            };
        } else {
            updated.push({
                ...form,
                seriDokumen: generateSeri(),
            });
        }

        return {
            ...prev,
            dokumen: updated,
        };
    });

    setEditingIndex(null);
    setForm({ ...initForm });
    setShowForm(false);
};

    const getNamaDokumen = (kode: string) => {
        const dokumen = ListDokumen.find((item) => item.key === kode);
        return dokumen ? `${dokumen.key} - ${dokumen.value}` : "";
    };

    const handleEdit = (row: any, index: number) => {
        setForm({
            seriDokumen: row.seriDokumen,
            jenisDokumen: row.jenisDokumen,
            nomorDokumen: row.nomorDokumen,
            tanggalDokumen: row.tanggalDokumen,
        });

        setEditingIndex(index);
        setShowForm(true);
    };

const handleDelete = (index: number) => {
  if (!window.confirm("Yakin ingin menghapus dokumen ini?")) return;

  setData((prev: any) => {
    const updated = [...(prev.dokumen || [])];
    updated.splice(index, 1);
        const reIndexed = updated.map((item, i) => ({
        ...item,
        seriDokumen: (i + 1).toString(),
        }));
    return {
      ...prev,
      dokumen: reIndexed,
    };
  });
};
useEffect(() => {
    const isComplete = data?.length > 0;
    setIsComplete(isComplete);
}, [data, setIsComplete]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "row", fontWeight: 500, fontSize: 12, padding: 12, backgroundColor: "#fff7db", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <FaCircleExclamation style={{color:"orange"}}/> <span style={{color:"black"}}>Wajib melampirkan dokumen invoice dan dokumen B/L atau AWB</span>
        </div>
      {showModal && dataDokumen && <ModalManifest header={dataDokumen} setHeader={setDataDokumen} data={data} setData={setData} setModal={setShowModal} respon={dataDokumen.data.respon} />}
      {showForm && (
      <Card
            title="Tambah Dokumen"
            headerStyle={{ backgroundColor: "#f5f5f5"}}
            //tampilkan form jika showForm true
            bodyStyle={{display:"flex", flexDirection:"row", width:"100%", gap: 16, justifyContent:"center"}}
            headerCustom={(
                <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                    <Button size="sm" variant="primary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} 
                        onClick={handleSimpan}>
                        <span style={{paddingTop:1, minWidth:70}}>Simpan</span>                
                    </Button>
                    <Button size="sm" variant="outline-secondary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} 
                    onClick={() => {setForm({ ...initForm });
                                setShowForm(false);     
                            }}> 
                        <span style={{paddingTop:1, minWidth:70}}>Batal</span>                
                    </Button>
                </div>
          )}
        >
          <Card.Input
            label="Seri"
            name="seriDokumen"
            value={form.seriDokumen || generateSeri()}
            onChange={(val) => handleInputChange("seriDokumen", val)}
            readonly={true}
            inputStyle={{ width: "100%" }}
        />
            <Card.Select
            label="Jenis Dokumen"
            name="jenisDokumen"
            value={form.jenisDokumen}
            onChange={(value) => handleInputChange("jenisDokumen", value)}
            error={!form.jenisDokumen ? "Jenis Dokumen Kosong" : ""}
            list={ListDokumen.map((item) => ({ value: item.key, label: `${item.key} - ${item.value}` }))}
            inputStyle={{ width: "100%" }}
        />
            <Card.Input
            label="Nomor Dokumen"
            name="nomorDokumen"
            value={form.nomorDokumen}
            onChange={(val) => handleInputChange("nomorDokumen", val)}
            error={!form.nomorDokumen ? "Nomor Dokumen Kosong" : ""}
            inputStyle={{ width: "100%" }}
        />
            <Card.DatePicker
            label="Tanggal Dokumen"
            name="tanggalDokumen"
            value={form.tanggalDokumen}
            onChange={(val) => handleInputChange("tanggalDokumen", moment(val).format("YYYY-MM-DD"))}
            error={!form.tanggalDokumen ? "Tanggal Dokumen Kosong" : ""}
            inputStyle={{ width: "100%" }}
        />
      </Card>
        )}
      <Card
          title="Dokumen Lampiran"
          headerStyle={{ backgroundColor: "#f5f5f5"}}
          headerCustom={(
            <Button size="sm" variant="primary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} onClick={() => setShowForm(true)}>
                <FaPlusCircle/><span style={{paddingTop:1}}>Tambah</span>                
            </Button>
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
                { header: "Jenis", accessor: "jenisDokumen", tdStyle: { minWidth: 100}, render: (row) => getNamaDokumen(row.jenisDokumen) },
                { header: "Nomor", accessor: "nomorDokumen", tdStyle: { minWidth: 100}, },
                { header: "Tanggal", accessor: "tanggalDokumen", tdStyle: { minWidth: 100}, render: (row) => row.tanggalDokumen ? moment(row.tanggalDokumen).format("DD MMM YYYY") : "" },
                { header: "Fasilitas", accessor: "fasilitasDokumen" ,tdStyle: { minWidth: 100} },
                { header: "Izin", accessor: "izinDokumen", tdStyle: { minWidth: 100} },
                { header: "Kantor", accessor: "kantorDokumen", tdStyle: { minWidth: 100} },
                { header: "File", accessor: "fileDokumen", tdStyle: { minWidth: 100} },
                {
                    header: "Action",
                    accessor: "id",
                    tdStyle: { minWidth: 100 },
                    render: (row, index) => (
                        <div style={{ display: "flex", gap: 6 }}>
                        <Button
                            size="sm"
                            variant="outline-warning"
                            onClick={() => handleEdit(row, index)}
                        >
                            Edit
                        </Button>

                        <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(index)}
                        >
                            Hapus
                        </Button>
                        </div>
                    ),
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
    </div>
  );
};

export default DokumenBC23Page;