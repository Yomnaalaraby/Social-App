import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import axios from 'axios'
import SinglePost from './SinglePost'
import PostCardSkeleton from '../Components/Skeleton/PostCardSkeleton'

export default function PostDetails() {
    const { id } = useParams()
    const { token } = useContext(AuthContext)
    const [PostDetails, setPostDetails] = useState(null)

    async function getPostDetails() {

        try {
            const options = {
                url: `https://linked-posts.routemisr.com/posts/${id}`,
                method: "GET",
                headers: {
                    token,
                },
            };
            const { data } = await axios.request(options)
            if (data.message === "success") {
                setPostDetails(data.post)
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPostDetails()
    }, []);
    return <>
        <section>
            <div className="container max-w-2xl mx-auto">
                {PostDetails ? <SinglePost postInfo={PostDetails} commentsLimit={10} /> : <PostCardSkeleton />}

            </div>
        </section>
    </>
}
