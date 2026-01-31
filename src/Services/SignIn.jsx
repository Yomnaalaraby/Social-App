import axios from "axios";

export async function getLoggedUserData() {
    try {
        const { data } = await axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
            headers: {
                token: localStorage.getItem('token')
            }
        });
        console.log(data);
        return data;

    } catch (err) {
        console.log(err.response.data);
        return err.response.data;
    }
}
export async function sendLoginData(values) {
    try {
        const { data } = await axios.post(`https://linked-posts.routemisr.com/users/signin`, values);
        console.log(data);
        return data;

    } catch (err) {
        console.log(err.response.data);
        return err.response.data;
    }
}