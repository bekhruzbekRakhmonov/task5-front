import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

const HeaderComponent = () => {
	const { isAuthenticated, logout } = useAuth();

	const handleLogout = async () => {
		await logout();
	};

	return (
		<AppBar position="static" color="inherit">
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Random User Generator App
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default HeaderComponent;
