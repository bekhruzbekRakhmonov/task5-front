import React, { useState, useEffect } from "react";
import {
	Container,
	TextField,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Autocomplete,
	Typography,
	Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { generateRandomUsers } from "../utils/api";
import HeaderComponent from "./HeaderComponent";
import { SupportedNats, SupportedNatsMap } from "../enums/supportedNats";
import { AxiosResponse } from "axios";

interface UserData {
	randomIdentifier: string;
	name: string;
	address: string;
	phone: string;
}

interface Option {
	key: SupportedNats;
	label: string;
}

const UserGeneretorComponent: React.FC = () => {
	const [userData, setUserData] = useState<UserData[]>([]);
	const [region, setRegion] = useState<string>(SupportedNats.US);
	const [errorAmount, setErrorAmount] = useState<number>(0);
	const [prevErrorAmount, setPrevErrorAmount] = useState<number>(0);
	const [seed, setSeed] = useState<string>("");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [error, setError] = useState<string>();
	const [open, setOpen] = useState<boolean>(false);

	const handleClose = () => {
		setOpen(false);
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1);
		fetchData(1);
	};

	const fetchData = async (page: number) => {
		let response: AxiosResponse = {} as AxiosResponse;
		try {
			if (seed === "") {
				let randomSeed = Math.random().toString(36).substring(7);
				setSeed(randomSeed);
			}

			response = await generateRandomUsers(
				region,
				errorAmount,
				seed,
				page
			);
			if (errorAmount !== prevErrorAmount) {
				setUserData(response.data);
			} else {
				setUserData((prevData) => [...prevData, ...response.data]);
			}

			setRegion(region);
			setPrevErrorAmount(errorAmount);
		} catch (error: any) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				setError(error.response.data.message);
			} else {
				setError(
					"An unexpected error occurred. Please try again later."
				);
			}
			setOpen(true);
			console.error("Error fetching data: ", error);
		}
	};

	const handleExportCSV = () => {
		const csvContent = "data:text/csv;charset=utf-8,";
		const headers = [
			"Index",
			"Random Identifier",
			"Name",
			"Address",
			"Phone",
		];
		const rows = userData.map((user, index) => [
			index + 1,
			user.randomIdentifier,
			user.name,
			user.address,
			user.phone,
		]);
		const formattedRows = [headers, ...rows]
			.map((row) => row.join(","))
			.join("\n");
		const encodedURI = encodeURI(csvContent + formattedRows);
		const link = document.createElement("a");
		link.setAttribute("href", encodedURI);
		link.setAttribute("download", "users_data.csv");
		document.body.appendChild(link);
		link.click();
	};

	useEffect(() => {
		fetchData(currentPage);
	}, [currentPage, region, seed]);

	const handleScroll = () => {
		const scrollHeight = document.documentElement.scrollHeight;
		const scrollTop = document.documentElement.scrollTop;
		const clientHeight = document.documentElement.clientHeight;

		if (scrollTop + clientHeight >= scrollHeight - 200) {
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const options: Option[] = Object.entries(SupportedNatsMap).map(
		([key, value]) => ({
			key: key as SupportedNats,
			label: value,
		})
	);

	return (
		<>
			<HeaderComponent />
			<br />
			<Container className="App">
				<form onSubmit={handleFormSubmit}>
					<Autocomplete
						options={options}
						getOptionLabel={(option) => option.label}
						value={{
							key: region,
							label: SupportedNatsMap[region as SupportedNats],
						}}
						onChange={(_, newValue) => {
							if (newValue) {
								setRegion(newValue.key);
							}
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Region"
								variant="outlined"
							/>
						)}
					/>

					<TextField
						label="Error Amount"
						variant="outlined"
						type="number"
						fullWidth
						value={errorAmount}
						aria-valuemax={10}
						onChange={(e) => setErrorAmount(Number(e.target.value))}
						margin="normal"
					/>
					<TextField
						label="Seed"
						variant="outlined"
						fullWidth
						value={seed}
						onChange={(e) => setSeed(e.target.value)}
						margin="normal"
					/>
					<Button
						variant="contained"
						type="submit"
						color="primary"
						fullWidth
						style={{ marginTop: "1rem" }}
					>
						Generate Data
					</Button>
					<Button
						variant="outlined"
						color="secondary"
						fullWidth
						style={{ marginTop: "1rem" }}
						onClick={handleExportCSV}
					>
						Export to CSV
					</Button>
				</form>
				<TableContainer component={Paper} style={{ marginTop: "2rem" }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Index</TableCell>
								<TableCell>Random Identifier</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Address</TableCell>
								<TableCell>Phone</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{userData.map((user, index) => (
								<TableRow key={index}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>
										{user.randomIdentifier}
									</TableCell>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.address}</TableCell>
									<TableCell>{user.phone}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Container>
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
		</>
	);
};

export default UserGeneretorComponent;
