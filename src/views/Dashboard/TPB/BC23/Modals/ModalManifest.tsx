import Card from "../../../../../components/Card";
import { ListNegara } from "../../../../../services/loader/ListNegara";
import { ListCaraAngkut } from "../../../../../services/loader/ListCaraAngkut";
import { ListPelabuhan } from "../../../../../services/loader/ListPelabuhan";
import CustomTable from "../../../../../components/TableList";
import { ListTipeKontainer } from "../../../../../services/loader/ListTipeKontainer";
import { ListJenisKontainer } from "../../../../../services/loader/ListJenisKontainer";
import { ListUkuranKontainer } from "../../../../../services/loader/ListUkuranKontainer";
import { Button } from "react-bootstrap";
import { FaCircleExclamation } from "react-icons/fa6";
const ModalManifest = ({ header, setHeader, data, setData, setModal, respon }: any) => {
    const isDokumenDitutup = respon?.includes("Dokumen Sudah Ditutup");
    const getNamaTipeKontainer = (kode: string) => {
            const kontainer = ListTipeKontainer.find((item) => item.value === kode);
            return kontainer ? `${kontainer.value} - ${kontainer.label}` : "";
        };
        const getNamaJenisKontainer = (kode: string) => {
            const kontainer = ListJenisKontainer.find((item) => item.value === kode);
            return kontainer ? `${kontainer.value} - ${kontainer.label}` : "";
        }
        const getUkuranKontainer = (kode: string) => {
            const ukuran = ListUkuranKontainer.find((item) => item.value === kode);
            return ukuran ? `${ukuran.value} - ${ukuran.label}` : "";
        };
    const handleSimpan = () => {
        setData((prev: any) => ({
                    ...prev,
                    nomorBc11: header.data.noBc11 ?? prev.nomorBc11,
                    tanggalBc11: header.data.tglBc11 ?? prev.tanggalBc11,
                    posBc11: header.data.noPos?.slice(0, 4) ?? prev.posBc11,
                    subposBc11: header.data.noPos?.length > 4 ? header.data.noPos.slice(4) : prev.subposBc11,
                    tanggalTiba: header.data.tglTiba ?? prev.tanggalTiba,
                    kodePelTransit: header.data.pelTransit ?? prev.kodePelTransit,
                    kodePelMuat: header.data.pelAsal ?? prev.kodePelMuat,
                    kodePelBongkar: header.data.pelBongkar ?? prev.kodePelBongkar,
                    pengangkut:
                        {
                            ...prev.pengangkut,
                            kodeBendera: header.data.bendera ?? prev.pengangkut?.kodeBendera,
                            namaPengangkut: header.data.namaSaranaPengangkut ?? prev.pengangkut?.namaPengangkut,
                            nomorPengangkut: header.data.noVoyage ?? prev.pengangkut?.nomorPengangkut,
                            kodeCaraAngkut: header.data.caraPengangkutan ?? prev.pengangkut?.kodeCaraAngkut,
                            seriPengangkut: 1,
                        }
                    ,
                    kontainer: Array.isArray(header.data.listContainer)
                    ? header.data.listContainer.map((item: any, index: number) => ({
                        kodeTipeKontainer: item.tipeKontainer || null,
                        kodeUkuranKontainer: item.ukuranKontainer || null,
                        nomorKontainer: item.noKontainer || null,
                        kodeJenisKontainer: item.jenisKontainer || null,
                        seriKontainer: index + 1,
                    }))
                    : header.data.listContainer
                    ? [{
                        kodeTipeKontainer: header.data.listContainer.tipeKontainer || null,
                        kodeUkuranKontainer: header.data.listContainer.ukuranKontainer || null,
                        nomorKontainer: header.data.listContainer.noKontainer || null,
                        kodeJenisKontainer: header.data.listContainer.jenisKontainer || null,
                        seriKontainer: 1,
                    }]
                    : []
                }));
                setHeader(null);
                setModal(false);
    };
    return (
        <div>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(54, 54, 54, 0.6)", // overlay gelap
                    zIndex: 2
                }}>
                <div
                    style={{
                        position: "absolute",
                        top: "20%",
                        left: "50%",
                        width: "80%",
                        transform: "translate(-50%, -20%)",
                        zIndex: 3,
                        backgroundColor: "#fff",
                        padding: 20,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        minWidth: 300
                    }}
                >
                    {isDokumenDitutup && 
                    <div style={{ display: "flex", flexDirection: "row", fontWeight: 500, fontSize: 12, padding: 12, backgroundColor: "#fff7db", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <FaCircleExclamation style={{color:"orange"}}/> <span style={{color:"black"}}>{respon}</span>
                    </div>}
                <div style={{ display: "flex", flexDirection: "row", gap: 8, justifyContent: "center" }}>
                    <Card
                            title="BC 1.1"
                            headerStyle={{ backgroundColor: "#f5f5f5"}}
                            >
                            <div style={{ display: "flex", flexDirection: "row", gap: 8, marginTop: 8, }}> 
                                <Card.Input
                                    label="Nomor BC 1.1"
                                    name="nomorBc11"
                                    value={header.data.noBc11 || ""}
                                    // onChange={(val) => setHeader({ ...header.data, noBc11: val })}
                                    // error={!header.data?.noBc11 ? "Nomor BC 1.1 wajib diisi" : ""}
                                    onlyNumber={true}
                                    maxLength={6}
                                    readonly={true}
                                />
                                <Card.DatePicker
                                    label={"\u00A0"}
                                    name="tanggalBc11"
                                    value={header.data.tglBc11}
                                    // onChange={(val) => { val ?
                                    // setHeader({ ...header.data, tanggalBc11: moment(val).format("YYYY-MM-DD") })
                                    // : setHeader({ ...header.data, tanggalBc11: null });
                                    // }}
                                    // error={!header.data?.tanggalBc11 ? "Tanggal BC 1.1 wajib diisi" : ""}
                                    readonly={true}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", gap: 8, marginTop: 8, }}> 
                                <Card.Input
                                    label="Nomor Pos"
                                    name="noPos"
                                    value={header.data.noPos || ""}
                                    // onChange={(val) => setHeader({ ...header.data, noPos: val })}
                                    // error={!header.data?.noPos ? "Nomor Pos wajib diisi" : ""}
                                    readonly={true}
                                    onlyNumber={true}
                                />
                            </div>
                            </Card>
                            <Card
                                title="Pengangkutan" headerStyle={{ backgroundColor: "#f5f5f5"}}>
                            <Card.Select
                                label="Cara Pengangkutan"
                                name="caraPengangkutan"
                                value={header.data.caraPengangkutan || ""}
                                list={ListCaraAngkut.map(item => ({ label: `${item.value} - ${item.label}`, value: item.value }))}
                                // onChange={(val) => setHeader({ ...header.data, caraPengangkutan: val })}
                                // error={!header.data?.caraPengangkutan ? "Cara Pengangkutan wajib dipilih" : ""}
                                readonly={true}
                            />
                            <Card.Input
                                    label="Nama Sarana Angkut"
                                    name="namaSaranaPengangkut"
                                    value={header.data.namaSaranaPengangkut || ""}
                                    // onChange={(val) => setHeader({ ...header.data, namaSaranaPengangkut: val })}
                                    // error={!header.data?.namaSaranaPengangkut ? "Nama Sarana Angkut wajib diisi" : ""}
                                    readonly={true}
                                />
                                <Card.Input
                                    label="Nomor Voy/Flight"
                                    name="noVoyage"
                                    value={header.data.noVoyage || ""}
                                    // onChange={(val) => setHeader({ ...header.data, noVoyage: val })}
                                    // error={!header.data?.noVoyage ? "Nomor Voy/Flight wajib diisi" : ""}
                                    readonly={true}
                                />
                            <Card.Select
                                label="Negara"
                                name="bendera"
                                value={header.data.bendera || ""}
                                list={ListNegara.map(item => ({ label: `${item.value} - ${item.label}`, value: item.value }))}
                                // onChange={(val) => setHeader({ ...header.data, bendera: val })}
                                // error={!header.data?.bendera ? "Negara wajib diisi" : ""}
                                readonly={true}
                            />
                            </Card>
                        <Card 
                                title=""
                                bodyStyle={{ display: "flex", flexDirection:"column", padding: 0, gap: 10, justifyContent:"space-between", height:"100%"}}
                                style={{backgroundColor:"transparent", border:"none", boxShadow:"none"}}      
                                >       
                            <Card
                                title="Pelabuhan & Tempat Penimbunan" 
                                headerStyle={{ backgroundColor: "#f5f5f5"}}
                            >
                            <Card.Select
                                label="Pelabuhan Muat"
                                name="pelAsal"
                                value={header.data?.pelAsal || ""}
                                list={ListPelabuhan.map(item => ({ label: item.label, value: item.value }))}
                                // onChange={(val) => setHeader({ ...header.data, pelAsal: val })}
                                // error={!header.data?.pelAsal ? "Pelabuhan Muat wajib diisi" : ""}
                                readonly={true}
                            />
                            <Card.Select
                                label="Pelabuhan Transit"
                                name="pelTransit"
                                value={header.data.pelTransit || ""}
                                list={ListPelabuhan.map(item => ({ label: item.label, value: item.value }))}
                                // onChange={(val) => setHeader({ ...header.data, pelTransit: val })}
                                // error={!header.data?.pelTransit ? "Pelabuhan Transit wajib diisi" : ""}
                                readonly={true}
                            />
                            <Card.Select
                                label="Pelabuhan Tujuan"
                                name="pelBongkar"
                                value={header.data.pelBongkar || ""}
                                list={ListPelabuhan.map(item => ({ label: item.label, value: item.value }))}
                                // onChange={(val) => setHeader({ ...header.data, pelBongkar: val })}
                                // error={!header.data?.pelBongkar ? "Pelabuhan Tujuan wajib diisi" : ""}
                                readonly={true}
                            />
                            </Card>
                            <Card
                                title="Kontainer"
                                headerStyle={{ backgroundColor: "#f5f5f5"}}
                            >
                                <Card.Input
                                    label="Nama Consignee"
                                    name="namaConsignee"
                                    value={header.data.namaPenerima || ""}
                                    // onChange={(val) => setHeader({ ...header.data, namaPenerima: val })}
                                    // error={!header.data?.namaPenerima ? "Nama Penerima wajib diisi" : ""}
                                    readonly={true}
                                />
                                <Card.Input
                                    label="Nama Notify"
                                    name="namaPemilik"
                                    value={header.data.namaPemilik || ""}
                                    // onChange={(val) => setHeader({ ...header.data, namaPemilik: val })}
                                    // error={!header.data?.namaPemilik ? "Nama Notify wajib diisi" : ""}
                                    readonly={true}
                                />
                            </Card>
                    </Card> 
                </div>
                <div style={{marginTop:8}}>
                    <Card
                        title="Peti Kemas"
                        headerStyle={{ backgroundColor: "#f5f5f5"}}
                        >
                        <CustomTable
                                title=""
                                containerStyle={{ background: "#f9fafc", padding: 0}}
                                headerStyle={{marginBottom:0}}
                                actionContainerStyle={{ gap: 15 }}
                                tableStyle={{ fontSize: 12, marginBottom: 0 }}
                                columns={[
                                    { header: "Seri", accessor: "seriKontainer",thStyle: { textAlign: "center" }, tdStyle: { textAlign: "center" }, render: (row, index) => index + 1 },
                                    { header: "Nomor", accessor: "noKontainer"},
                                    { header: "Ukuran", accessor: "ukuranKontainer", render: (row) => getUkuranKontainer(row.ukuranKontainer) },
                                    { header: "Jenis", accessor: "jenisKontainer", render: (row) => getNamaJenisKontainer(row.jenisKontainer) },
                                    { header: "Tipe", accessor: "tipeKontainer", render: (row) => getNamaTipeKontainer(row.tipeKontainer) },
                                    {
                                        header: "",
                                        accessor: "id",
                                        thStyle: { display: "none" },
                                        tdStyle: { display: "none" },
                                    },
                                ]}
                                data={header.data.listContainer || []}   
                                striped={false}
                                bordered={false}
                                hover={true}
                                responsive={true}
                                className="custom-table"
                            />  
                            </Card>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 8 }}>
                    <Button size="sm" variant="outline-secondary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} 
                    onClick={() => {
                        setHeader(null);
                        setModal(false);
                    }}>
                        <span style={{paddingTop:1, minWidth:70}}>Batal</span>                
                    </Button>
                    <Button size="sm" variant={isDokumenDitutup ? "secondary" : "primary"} disabled={isDokumenDitutup}
                        style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} 
                        onClick={handleSimpan}>
                        <span style={{paddingTop:1, minWidth:70}}>Simpan</span>                
                    </Button>
                    
                </div>
            </div>
        </div>
        </div>
    );
};

export default ModalManifest;