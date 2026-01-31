import axios from "axios";

export async function createCommentApi(content, postId, token) {

    try {
        const { data } = await axios.post('https://linked-posts.routemisr.com/comments', {
            content: content,
            post: postId
        }, {
            headers: {
                token: token
            }
        })

        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}
export async function deleteCommentApi(commentId, token) {

    try {
        const { data } = await axios.delete(`https://linked-posts.routemisr.com/comments/${commentId}`, {
            headers: {
                token: token
            }
        })

        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}
export async function updateCommentApi(content, commentId, token) {

    try {
        const { data } = await axios.put(`https://linked-posts.routemisr.com/comments/${commentId}`, {
            content
        }, {
            headers: {
                token: token
            }
        })

        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}
