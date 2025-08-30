import axiosInstance from "../../api/axiosInstance";

const login = async (credentials) => {
    const { data } = await axiosInstance.post("/auth/login", credentials);
    return data;
};

const authService = { login };
export default authService;
