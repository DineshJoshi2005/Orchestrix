import api from "../../utils/axios"

const getMessages = async (id) => {
    try {
        const { data } = await api.get(`/chat/get-messages/${id}`);
        return data;

    } catch (error) {
        console.log(error);
        return [];
    }
}

export default getMessages