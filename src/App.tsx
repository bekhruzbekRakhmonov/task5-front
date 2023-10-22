import React from "react";
import UserGeneratorComponent from "./components/UserGeneretorComponent";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

const App: React.FC = () => {

	return (
		<div>
			<Router>
				<Routes>
					<Route
						path="/generator"
						element={
								<UserGeneratorComponent />
						}
					/>
					<Route path="/*" element={<Navigate to="/generator" />} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;
