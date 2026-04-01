export const ListJenisIdentitas = [
            {
                "tableKey": "2",
                "tableValue": "PASPOR"
            },
            {
                "tableKey": "3",
                "tableValue": "KTP"
            },
            {
                "tableKey": "4",
                "tableValue": "LAINNYA"
            },
            {
                "tableKey": "5",
                "tableValue": "NPWP 15 DIGIT"
            },
            {
                "tableKey": "6",
                "tableValue": "NPWP 16 DIGIT"
            }
].map(item => ({ label: `${item.tableKey} - ${item.tableValue}`, value: item.tableKey }));