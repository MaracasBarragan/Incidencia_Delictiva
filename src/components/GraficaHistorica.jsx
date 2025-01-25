import { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Loading from "./Loading";

const GraficaHistorica = ({ data }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [dataEdoMex, setDataEdoMex] = useState([]);
    const [dataTendencia, setDataTendencia] = useState([]);

    const aplicarSuavizado = (datos) => {
        const windowSize = 3; 
        const suavizado = [...datos];

        for (let i = windowSize; i < datos.length - windowSize; i++) {
            const suma = datos
                .slice(i - windowSize, i + windowSize + 1)
                .reduce((acc, item) => acc + item.Cantidad, 0);
            suavizado[i].Tendencia = suma / (windowSize * 2 + 1); 
        }

        return suavizado;
    };

    useEffect(() => {
        if (data.length > 0) {
            const edoMexData = data.filter((item) => item.Entidad === "México");

            const groupedData = edoMexData
                .map((item) => {
                    const [numeroMes, mesNombre] = item.Mes.split("-");
                    const fechaOrdenada = new Date(item.Año, numeroMes - 1);

                    return {
                        ...item,
                        Fecha: `${item.Año}-${numeroMes}`,
                        FechaOrdenada: fechaOrdenada,
                    };
                })
                .sort((a, b) => a.FechaOrdenada - b.FechaOrdenada);

            const grouped = [];
            groupedData.forEach((item) => {
                const existing = grouped.find(
                    (group) => group.Fecha === item.Fecha
                );
                if (existing) {
                    existing.Cantidad += item.Cantidad;
                } else {
                    grouped.push({ ...item });
                }
            });

            const dataSuavizada = aplicarSuavizado(grouped);

            setDataEdoMex(grouped);
            setDataTendencia(dataSuavizada);
        }
        setIsLoading(false);
    }, [data]);

    if (isLoading) {
        return <Loading />;
    }

    if (dataEdoMex.length === 0) {
        return (
            <div className="p-4 text-gray-600">
                <h2 className="text-xl font-semibold">No se encontraron datos para el Estado de México.</h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full px-4">
            <h2 className="text-lg font-semibold mb-2">Incidencia en el Estado de México entre 2015 y 2024</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dataEdoMex}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="1 1" />

                    <XAxis
                        dataKey="FechaOrdenada"
                        tickFormatter={(date) => `${date.getMonth() + 1}-${date.getFullYear()}`}
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        height={40}
                        textAnchor="end"
                        interval={1}
                    />

                    <YAxis
                        tick={{ fontSize: 12 }}
                        label={{ value: "Cantidad", angle: -90, position: "insideLeft" }}
                    />

                    <Tooltip
                        content={({ payload, label }) => {
                            if (!payload || payload.length === 0) return null;

                            const date = new Date(label);
                            const year = date.getFullYear();
                            const month = date.getMonth() + 1;
                            const tendencia = payload[1]?.value ? payload[1].value.toFixed(4) : 'N/A';

                            return (
                                <div className="bg-gray-600 text-sm p-2 border shadow-md">
                                    <p><strong>Año:</strong> {year}</p>
                                    <p><strong>Mes:</strong> {month}</p>
                                    <p><strong>Cantidad:</strong> {payload[0].value}</p>
                                    <p><strong>Tendencia:</strong> {tendencia}</p>
                                </div>
                            );
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="Cantidad"
                        stroke="#ADD8E6"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 4 }}
                    />

                    <Line
                        type="monotone"
                        dataKey="Tendencia"
                        stroke="#FF0000"
                        strokeWidth={3}
                        dot={false}
                        strokeDasharray="5 5"
                        data={dataTendencia}  
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraficaHistorica;
