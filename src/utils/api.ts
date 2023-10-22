import axios, { AxiosResponse } from "axios";

const API_BASE_URL = "https://bekhruzbek.uz/api";

const api = axios.create({
	baseURL: API_BASE_URL,
});

export const generateRandomUsers = async (
	region: string,
	errorAmount: number,
	seed: number,
	page: number
): Promise<AxiosResponse> => {
	const response = await api.get(
		`/generate-data?region=${region}&errors=${errorAmount}&seed=${seed}&page=${page}`
	);
	return response;
};