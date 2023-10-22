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
	Snackbar,
	Slider,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { generateRandomUsers } from "../utils/api";
import HeaderComponent from "./HeaderComponent";
import { SupportedNats, SupportedNatsMap } from "../enums/supportedNats";

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
	const [seed, setSeed] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [error, setError] = useState<string>();
	const [open, setOpen] = useState<boolean>(false);

	const [prevRegion, setPrevRegion] = useState<string>(SupportedNats.US);
	const [prevSeed, setPrevSeed] = useState<number>(0);
	const [prevErrorAmount, setPrevErrorAmount] = useState<number>(0);

	const handleClose = () => {
		setOpen(false);
	};

	const fetchData = async (page: number) => {
		try {
			if (
				region !== prevRegion ||
				seed !== prevSeed ||
				errorAmount !== prevErrorAmount
			) {
				const response = await generateRandomUsers(
					region,
					errorAmount,
					seed,
					page
				);
				setUserData(response.data);
			} else {
				const response = await generateRandomUsers(
					region,
					errorAmount,
					seed,
					page
				);
				setUserData((prevData) => [...prevData, ...response.data]);
			}

			setPrevRegion(region);
			setPrevSeed(seed);
			setPrevErrorAmount(errorAmount); 
		} catch (error: any) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				setError(error.response.data.message);
				setOpen(true);
			} else {
				console.error(
					"An unexpected error occurred. Please try again later."
				);
			}
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
	}, [currentPage, region, seed, errorAmount]);

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
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginBottom: "1rem",
						justifyContent: "space-between",
					}}
				>
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
								style={{ width: 200 }}
							/>
						)}
					/>
					<div style={{ display: "flex", alignItems: "center" }}>
						<span style={{ marginRight: "1rem" }}>
							Error Amount:
						</span>
						<Slider
							value={errorAmount}
							step={1}
							min={0}
							max={1000}
							valueLabelDisplay="auto"
							onChange={(_, value) =>
								setErrorAmount(value as number)
							}
							style={{ width: "200px" }}
						/>
					</div>

					<TextField
						label="Seed"
						variant="outlined"
						value={seed.toString()}
						onChange={(e) => {
							const input = parseInt(e.target.value);
							setSeed(isNaN(input) ? 0 : input);
						}}
						style={{ marginLeft: "1rem", width: "100px" }}
					/>
					<Button
						variant="outlined"
						color="secondary"
						style={{ marginTop: "1rem" }}
						onClick={handleExportCSV}
					>
						Export to CSV
					</Button>
				</div>
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
