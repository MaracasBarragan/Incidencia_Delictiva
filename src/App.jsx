import { useState } from "react";
import DelitoSelection from "./components/DelitoSelection";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

function App() {
	const [dashVisible, setDashVisible] = useState(false);
	const [selectedDelitos, setSelectedDelitos] = useState([]);
	const [headerSize, setHeaderSize] = useState(80);

	const handleCloseDash = () => {
		setHeaderSize(80);
		setDashVisible(false);
	};

	const handleSelectionClick = (delitos) => {
		setSelectedDelitos(delitos);
		setHeaderSize(0);
		setDashVisible(true);
	};

    return (
        <div className="flex flex-col w-full h-screen">
            <Header height={headerSize} />
            <div className={`flex flex-col w-full h-full items-center justify-center pt-[${headerSize}px]`}>
				{!dashVisible && (
					<DelitoSelection 
						onClick={handleSelectionClick}
					/>
				)}
				{dashVisible && (
					<Dashboard 
						selectedDelitos={selectedDelitos}
						onClose={handleCloseDash}
					/>
				)}
            </div>
        </div>
    )
}

export default App;
