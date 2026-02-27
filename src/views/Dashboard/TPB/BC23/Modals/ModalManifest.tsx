import { useEffect, useState } from "react";
import { ceisaService } from "../../../../../services/support/Ceisa/AccessCeisa";

const ModalManifest = ({ header, data, setData }: any) => {
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const isComplete =
        header?.kodeKantor &&
        header?.noHostBl &&
        header?.tglHostBl &&
        header?.namaImportir;

        if (!isComplete) return;

        const fetchManifest = async () => {
        try {
            setLoading(true);

            const res = await ceisaService.getManifes(
            header.kodeKantor,
            header.noHostBl,
            header.tglHostBl,
            header.namaImportir
            );

            setResponse(res);
        } catch (err) {
            console.error("Manifest Error:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchManifest();
    }, [
        header?.kodeKantor,
        header?.noHostBl,
        header?.tglHostBl,
        header?.namaImportir,
    ]);

    return (
        <div>
        <h3>Modal Manifest</h3>

        {loading && <p>Loading...</p>}

        <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
    );
};

export default ModalManifest;