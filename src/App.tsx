import React from "react";
import { useAuth } from "./auth/AuthContext";
import LoginComponent from "./components/auth/LoginComponent";
import UserGeneratorComponent from "./components/UserGeneretorComponent";
import RegisterComponent from "./components/auth/RegisterComponent";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

const App: React.FC = () => {
	const { isAuthenticated } = useAuth();

	return (
		<div>
			<Router>
				<Routes>
					<Route path="/login" element={<LoginComponent />} />
					<Route path="/register" element={<RegisterComponent />} />
					<Route
						path="/generator"
						element={
							isAuthenticated ? (
								<UserGeneratorComponent />
							) : (
								<Navigate to="/login" />
							)
						}
					/>
					<Route path="/*" element={<Navigate to="/login" />} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;
