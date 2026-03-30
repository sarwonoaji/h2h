import Card from "../../../../../components/Card";
import { ListDokumen } from "../../../../../services/loader/ListDokumen";
import { ListNegara } from "../../../../../services/loader/ListNegara";
import moment from "moment";
import { useEffect, useState } from "react";
import ModalManifest from "../Modals/ModalManifest";
import { Button } from "react-bootstrap";
import CustomTable from "../../../../../components/TableList";
import { FaCircle } from "react-icons/fa";
import { FaCircleExclamation, FaCirclePlus } from "react-icons/fa6";

const PungutanBC23Page = ({ data = [], setData, setIsComplete }: any) => {
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
      <Card
          title="Dokumen Lampiran"
          headerStyle={{ backgroundColor: "#f5f5f5"}}
          headerCustom={(
            <Button size="sm" variant="primary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} onClick={() => setShowForm(true)}>
                <FaCirclePlus/><span style={{paddingTop:1}}>Hitung & Muat Ulang</span>                
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
                { header:"", accessor:"id"},
                { header: "Pungutan", accessor: "seriDokumen",tdStyle: { minWidth: 100}},
                { header: "Tidak Dipungut", accessor: "jenisDokumen", tdStyle: { minWidth: 100}},
                { header: "Dibebankan", accessor: "nomorDokumen", tdStyle: { minWidth: 100}, },
                { header: "Ditangguhkan", accessor: "fasilitasDokumen" ,tdStyle: { minWidth: 100} },
                
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
}

export default PungutanBC23Page;