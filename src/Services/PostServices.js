import axios from "axios";

export async function createPostApi(formData, token) {
    try {
        const { data } = await axios.post('https://linked-posts.routemisr.com/posts', formData, {
            headers: {
                token: token
            }
        });
        return data;
    } catch (errors) {
        console.log(errors);
        return { error: errors };
    }
}
export async function deletePostApi(postId, token) {
    try {
        const { data } = await axios.delete(`https://linked-posts.routemisr.com/posts/${postId}`, {
            headers: {
                token: token
            }
        });
        return data;
    } catch (errors) {
        console.log(errors);
        return { error: errors };
    }
}

export async function getUserPostsApi(userId, token) {
    try {
        const { data } = await axios.get(`https://linked-posts.routemisr.com/users/${userId}/posts`, {
            headers: {
                token: token
            }
        });
        return data;
    } catch (errors) {
        return { error: errors };
    }
}

export async function updateProfilePicApi(formData, token) {

    return await axios.put(`https://linked-posts.routemisr.com/users/upload-photo`, formData, {
        headers: {
            token: token
        }
    });

}
export async function updatePostApi(id, formData, token) {
    const { data } = await axios.put(`https://linked-posts.routemisr.com/posts/${id}`, formData, {
        headers: { token }
    });
    return { data };
}

