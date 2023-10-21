import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { TextField, Button, Typography, Box, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

const LoginComponent = () => {
	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState<string>("");
	const [open, setOpen] = useState<boolean>(false);
	
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleClose = () => {
		setOpen(false);
	};

	const handleLogin = async () => {
		try {
			await login(credentials);
			navigate("/generator");
		} catch (err) {
			if (err instanceof AxiosError) {
				if (err.response) {
					setError(err.response.data.message);
				} else if (err.request) {
					setError("Network Error: Please try again later.");
				} else {
					setError(
						"An unexpected error occurred. Please try again later."
					);
				}
			} else {
				setError(
					"An unexpected error occurred. Please try again later."
				);
			}
		}
	};

	return (
		<Box sx={{ maxWidth: 300, margin: "auto", mt: 3 }}>
			<Typography variant="h4" align="center" gutterBottom>
				Login
			</Typography>
			{error && (
				<Typography variant="body2" color="error" align="center" mb={2}>
					{error}
				</Typography>
			)}
			<TextField
				label="Email"
				fullWidth
				margin="normal"
				value={credentials.email}
				onChange={(e) =>
					setCredentials({ ...credentials, email: e.target.value })
				}
			/>
			<TextField
				label="Password"
				fullWidth
				margin="normal"
				type="password"
				value={credentials.password}
				onChange={(e) =>
					setCredentials({ ...credentials, password: e.target.value })
				}
			/>
			<Button variant="contained" onClick={handleLogin} fullWidth>
				Login
			</Button>
			<Typography variant="body2" align="center" mt={2}>
				Not registered yet? <Link to="/register">Register here</Link>
			</Typography>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<MuiAlert
					elevation={6}
					variant="filled"
					onClose={handleClose}
					severity="error"
				>
					{error}
				</MuiAlert>
			</Snackbar>
		</Box>
	);
};

export default LoginComponent;
