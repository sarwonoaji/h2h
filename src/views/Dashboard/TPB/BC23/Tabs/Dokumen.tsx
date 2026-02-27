import { Button } from "react-bootstrap";
import Card from "../../../../../components/Card";
import { FaPlusCircle } from "react-icons/fa";
import CustomTable from "../../../../../components/TableList";
import { useEffect, useState } from "react";
import { ListDokumen } from "../../../../../services/loader/ListDokumen";
import moment from "moment";
import ModalManifest from "../Modals/ModalManifest";

const DokumenBC23Page = ({ data, setData, headers }: any) => {

    const initForm = {
        seriDokumen: "",
        jenisDokumen: "",
        nomorDokumen: "",
        tanggalDokumen: "",
    };
    const [headState, setHeadState] = useState(() => ({
        kodeKantor: "",
        namaImportir: "",
        noHostBl: "",
        tglHostBl: "",
    }));
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
    const handleSimpan = () => {
    if (!form.jenisDokumen || !form.nomorDokumen || !form.tanggalDokumen) {
        alert("Lengkapi data terlebih dahulu");
        return;
    }
    if (editingIndex !== null) {
        // MODE EDIT
        setData((prev: any) => {
        const updated = [...(prev.dokumen || [])];
        updated[editingIndex] = {
            ...updated[editingIndex],
            ...form,
        };
        if(updated[editingIndex].jenisDokumen === "705" || updated[editingIndex].jenisDokumen === "740") {
            setShowModal(true);
            setHeadState((prev) => ({
                ...prev,
                noHostBl: form.nomorDokumen,
                tglHostBl: form.tanggalDokumen,
            }));
        }

        return {
            ...prev,
            dokumen: updated,
        };
        });

        setEditingIndex(null);
    } else {
        const newData = {
        ...form,
        seriDokumen: generateSeri(),
        };
        if(newData.jenisDokumen === "705" || newData.jenisDokumen === "740") {
            setShowModal(true);
            setHeadState((prev) => ({
                ...prev,
                noHostBl: form.nomorDokumen,
                tglHostBl: form.tanggalDokumen,
            }));
        }

        setData((prev: any) => ({
            ...prev,
            dokumen: [...(prev.dokumen || []), newData],
    }))};

    setForm({ ...initForm });
    setShowForm(false);
    };
    useEffect(() => {
        setHeadState((prev) => ({
            ...prev,
            kodeKantor: headers?.kodeKantor || "",
            namaImportir: headers?.entitas?.find((x: any) => x.kodeEntitas === "3")?.namaEntitas || "",
        }));
    }, [headers]);

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

    return {
      ...prev,
      dokumen: updated,
    };
  });
};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
      {showModal && <ModalManifest header={headState} data={data} setData={setData} />}
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