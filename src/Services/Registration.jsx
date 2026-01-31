import axios from "axios";

export async function sendRegisterData(values) {
    try {
        const { data } = await axios.post(`https://linked-posts.routemisr.com/users/signup`, values);
        console.log(data);
        return data;

    } catch (err) {
        console.log(err.response.data);
        return err.response.data;
    }
}