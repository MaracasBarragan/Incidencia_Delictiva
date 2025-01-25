import { useEffect, useState } from "react";
import Loading from "./Loading";
import GraficaHistorica from "./GraficaHistorica";

const Dashboard = ({ selectedDelitos, onClose }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const title = "Analizando: " + selectedDelitos.map((delito) => delito).join(", ");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const promises = selectedDelitos.map(async (delito) => {
                    const fileName = `${delito}.json`; // Nombre del archivo directamente
                    const jsonData = await import(`./../assets/delitos/${fileName}`);
                    return { delito, data: jsonData.default };
                });

                const results = await Promise.all(promises);

                const loadedData = results.reduce((acc, { delito, data }) => {
                    acc[delito] = data;
                    return acc;
                }, {});

                setData(loadedData);
            } catch (err) {
                console.error("Error loading JSON files:", err);
                setError("Error al cargar los datos. Verifica que los archivos existan y tengan el formato correcto.");
            } finally {
                setLoading(false);
            }
        };

        if (selectedDelitos.length > 0) {
            loadData();
        } else {
            setLoading(false);
            setData({});
        }
    }, [selectedDelitos]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="p-4 text-red-500 font-semibold">{error}</div>;
    }

    if (Object.keys(data).length === 0) {
        return (
            <div className="flex flex-col w-full h-full p-4">
                <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-4">
                    <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded">
                        Regresar
                    </button>
                    <h1 className="text-2xl font-bold">No hay datos</h1>
                    <div></div>
                </div>
                <div className="text-gray-600">No se encontraron datos para los delitos seleccionados.</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full p-4">
            <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-4">
                <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded">
                    Regresar
                </button>
                <h1 className="text-2xl font-bold">{title}</h1>
                <div></div>
            </div>
            {Object.keys(data).map((delito) => (
                <div key={delito} className="flec flex-col w-full border-b border-gray-300 pb-4 mb-4">
                    <h2 className="text-xl font-semibold mb-2">{delito}</h2>
                    <GraficaHistorica data={data[delito]} />
                </div>
            ))}
        </div>
    );
};

export default Dashboard;
