import { useEffect, useState } from "react";
import Loading from "./Loading";
import delitos from "./../assets/delitos.json";

const DelitoCard = ({ delito, selectedDelitos, onClick }) => {
    return (
        <div
            onClick={() => onClick(delito)}
            className={`p-2 rounded-lg text-sm text-center cursor-pointer transition-colors 
                ${
                    selectedDelitos.includes(delito)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }`}
        >
            {delito}
        </div>
    );
};

const DelitoSelection = ({ onClick }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDelitos, setSelectedDelitos] = useState([]);

    const handleDelitoSelect = (delito) => {
        setSelectedDelitos((prev) =>
            prev.includes(delito) ? prev.filter((d) => d !== delito) : [...prev, delito]
        );
    };

    useEffect(() => {
        if (delitos.length > 0) {
            setIsLoading(false);
        }
    }, [delitos]);

    if (isLoading) {
        return <Loading />;
    };

    return (
        <div className="flex flex-col w-full h-full p-4 gap-4 bg-gray-100 items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-blue-600">Incidencia Delictiva Estado de México</h1>
                <p className="text-gray-600">
                    Selecciona los delitos que deseas analizar:
                </p>
            </div>

            <div className="border border-gray-600 bg-white shadow-md rounded-lg p-4 w-3/4 h-3/4 overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Delitos Disponibles:</h2>
                <div className="grid grid-cols-4 gap-4">
                    {delitos.map((delito, index) => (
                        <DelitoCard 
                            key={index} 
                            delito={delito} 
                            selectedDelitos={selectedDelitos}
                            onClick={handleDelitoSelect} 
                        />
                    ))}
                </div>
            </div>

            <button
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${selectedDelitos.length === 0 && "cursor-not-allowed"}`}
                disabled={selectedDelitos.length === 0}
                onClick={() => onClick(selectedDelitos)}
            >
                Analizar Delitos
            </button>
        </div>
    );
};

export default DelitoSelection;
