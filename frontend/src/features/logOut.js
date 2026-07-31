import api from "../../utils/axios"

const logOut = async () => {
    try {
        const { data } = await api.get("/auth/logout");
        console.log(data);
    } catch (error) {
        console.log(error)
    }
}

export default logOut