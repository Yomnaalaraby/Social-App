import { useContext } from 'react';
import SinglePost from './SinglePost';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import PostCardSkeleton from '../Components/Skeleton/PostCardSkeleton';
import PostUpload from '../Components/PostUpload';
import { useQuery } from '@tanstack/react-query';

export default function Feedpage() {
    const { token } = useContext(AuthContext)


    async function getAllPosts() {
        const options = {
            url: 'https://linked-posts.routemisr.com/posts?limit=50',
            method: "GET",
            headers: {
                token
            },
            params: {
                sort: '-createdAt'
            }
        }
        return await axios.request(options);
    }


    const { data: posts, iserror, error, isFetching } = useQuery({
        queryKey: ['posts'],
        queryFn: getAllPosts,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: 30000,
        staleTime: 10000,

        select: (response) => response.data.posts
    })

    console.log(posts);

    return <>
        <section className='py-10'>
            <div className="container mx-auto max-w-2xl">
                <PostUpload getAllPosts={getAllPosts} />
                <div className="my-6 border-b border-gray-300"></div>
                <h1 className='text-xl font-semibold text-gray-500 mb-3'>Latest Posts</h1>
                {posts ? (

                    <div className='all-posts space-y-4'>
                        {
                            posts.map((post) => <SinglePost key={post.id} postInfo={post} />)
                        }
                    </div>
                ) : <div className="loading space-y-3">
                    {[...Array(5)].map((_, index) => <PostCardSkeleton key={index} />)}
                </div>

                }
            </div>
        </section>
    </>

}
