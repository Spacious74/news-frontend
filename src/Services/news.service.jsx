import BASE_URL from "../baseUrl"
import axios from "axios";

export const fetchTopArticles = async ()=>{
    const url = BASE_URL + 'news/all';
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}


