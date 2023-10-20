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
} from "@mui/material";
import { generateRandomUsers } from "../utils/api";

interface UserData {
	randomIdentifier: string;
	name: string;
	address: string;
	phone: string;
}

const UserGeneretorComponent: React.FC = () => {
	const [userData, setUserData] = useState<UserData[]>([]);
	const [region, setRegion] = useState<string>("Poland");
	const [errorAmount, setErrorAmount] = useState<number>(0);
	const [seed, setSeed] = useState<string>("");
	const [currentPage, setCurrentPage] = useState<number>(1);

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1); // Reset page to 1 when form is submitted
		fetchData(1); // Fetch data for the first page
	};

	const fetchData = async (page: number) => {
		try {
			const response = await generateRandomUsers(region, errorAmount, seed, page)
			setUserData((prevData) => [...response.data, ...prevData]); // Concatenate new data with existing data
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	useEffect(() => {
		fetchData(currentPage);
	}, [currentPage]);

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

	return (
		<Container className="App">
			<form onSubmit={handleFormSubmit}>
				<TextField
					label="Region"
					variant="outlined"
					fullWidth
					value={region}
					onChange={(e) => setRegion(e.target.value)}
					margin="normal"
				/>
				<TextField
					label="Error Amount"
					variant="outlined"
					type="number"
					fullWidth
					value={errorAmount}
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
								<TableCell>{user.randomIdentifier}</TableCell>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.address}</TableCell>
								<TableCell>{user.phone}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
};

export default UserGeneretorComponent;
