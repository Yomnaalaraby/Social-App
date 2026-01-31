import { faCamera, faCircleXmark, faComment, faHeart, faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons'
import { faEllipsisVertical, faShare, faSpinner, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useState } from 'react'
import CommentCard from '../Components/CommentCard'
import { Link, useNavigate } from 'react-router-dom'
import { createCommentApi, updateCommentApi } from '../Services/CommentServices'
import { AuthContext } from '../Context/AuthContext'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import { deletePostApi, updatePostApi } from '../Services/PostServices'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../main'

export default function SinglePost({ postInfo, commentsLimit = 3, setPosts }) {
    const [commentContent, setCommentContent] = useState('');
    const navigate = useNavigate();
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editBody, setEditBody] = useState(postInfo.body);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editImage, setEditImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(postInfo.image);


    async function handleUpdatePost() {
        setIsUpdating(true);
        const formData = new FormData();
        formData.append('body', editBody);

        if (editImage) {
            formData.append('image', editImage);
        }

        try {
            const response = await updatePostApi(postInfo._id, formData, token);
            if (response.data.message === 'success') {
                setIsEditingPost(false);
                setEditImage(null);
                queryClient.invalidateQueries(['posts']);
                queryClient.invalidateQueries(['userPosts']);
            }
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    }

    const [comments, setComments] = useState(() => {
        const initialComments = postInfo.comments || [];
        return [...initialComments].reverse();
    });

    const [isLoading, setIsLoading] = useState(false);
    const { token, userData } = useContext(AuthContext);
    const [isUpdatingComment, setIsUpdatingComment] = useState(null);



    async function createComment(e) {
        e.preventDefault();
        setIsLoading(true);

        const response = await createCommentApi(commentContent, postInfo.id, token);

        if (response?.message === 'success') {
            let newCommentsFromApi = [...response.comments];

            setComments(newCommentsFromApi);
            setCommentContent('');
        }
        setIsLoading(false);
    }



    const { mutate: deletePost, isPending } = useMutation({
        mutationKey: ['deletePost', postInfo._id],
        mutationFn: () => deletePostApi(postInfo._id, token),
        onSuccess: async (response) => {
            if (response?.message === 'success') {
                await queryClient.invalidateQueries(['posts']);
            }
        }
    })


    function setFormForUpdate(content, id) {
        setCommentContent(content);
        setIsUpdatingComment(id);
    }

    async function updateComment(e) {
        e.preventDefault();
        setIsLoading(true);

        const response = await updateCommentApi(commentContent, isUpdatingComment, token);

        if (response?.message === 'success') {
            setComments(prevComments => prevComments.map((item) => {
                if (item._id === isUpdatingComment) {
                    return { ...item, content: commentContent };
                }
                return item;
            }));

            setCommentContent('');
            setIsUpdatingComment(null);
        }

        setIsLoading(false);
    }


    return <>
        <div className="card p-6 bg-white rounded-2xl shadow mb-5">
            {isEditingPost ? (

                <div className="edit-mode space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <img className='size-10 rounded-full object-cover' src={postInfo.user.photo} alt="" />
                        <span className="font-bold">Edit Your Post</span>
                    </div>

                    <textarea
                        className="w-full p-4 border-none bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-gray-700"
                        rows="4"
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        placeholder="What's on your mind?"
                    />
                    {imagePreview && (
                        <div className="relative mt-2 rounded-lg overflow-hidden border">
                            <img src={imagePreview} className="w-full h-48 object-cover" alt="Preview" />
                            <FontAwesomeIcon icon={faCircleXmark} className="text-lg top-4 end-4 absolute text-red-700 cursor-pointer"
                                onClick={() => { setEditImage(null); setImagePreview(null); }}
                            />

                        </div>
                    )}

                    <label className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-700 transition mt-2 w-fit">
                        <FontAwesomeIcon icon={faCamera} />
                        <span className="text-sm font-medium">Change Photo</span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setEditImage(file);
                                    setImagePreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                    </label>
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            onClick={() => setIsEditingPost(false)}
                            className="px-6 py-2 rounded-full text-gray-500 hover:bg-gray-100 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdatePost}
                            disabled={isUpdating}
                            className="bg-blue-600 text-white px-8 py-2 rounded-full font-medium hover:bg-blue-700 transition disabled:bg-gray-300 shadow-md"
                        >
                            {isUpdating ? <FontAwesomeIcon icon={faSpinner} spin /> : "Save Changes"}
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <header className='flex justify-between space-y-5'>
                        <div className='flex gap-2'>
                            <img className='size-11 rounded-full object-cover' src={postInfo.user.photo} alt="" />
                            <div>
                                <p className="font-bold">{postInfo.user.name}</p>
                                <time className='text-sm text-gray-400 block -mt-1.5'>
                                    <Link to={`/post/${postInfo.id}`}>{new Date(postInfo.createdAt).toLocaleString()}</Link>
                                </time>
                            </div>
                        </div>

                        {userData?._id === postInfo?.user?._id &&
                            <Dropdown>
                                <DropdownTrigger>
                                    <FontAwesomeIcon icon={faEllipsisVertical} className="cursor-pointer text-gray-500 outline-0" />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions" >

                                    <DropdownItem
                                        key="edit"
                                        onClick={() => setIsEditingPost(true)}
                                    >
                                        Edit Post
                                    </DropdownItem>
                                    <DropdownItem key="delete" className="text-danger" color="danger" onClick={deletePost}>
                                        Delete Post
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        }
                    </header>

                    <Link to={`/post/${postInfo.id}`}>
                        <div className="post-info mt-3">
                            <p className='pb-2 text-gray-700 whitespace-pre-wrap'>
                                {postInfo.body}
                            </p>
                            {postInfo.image && (
                                <div className='rounded-lg overflow-hidden mt-2'>
                                    <img className='w-full object-cover' src={postInfo.image} alt="" />
                                </div>
                            )}
                        </div>
                    </Link>

                    <div className="reactions flex justify-between mt-4">
                        <div className="likes flex items-center gap-1">
                            <div className="flex -space-x-2 overflow-hidden">
                                <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center border border-white">
                                    <FontAwesomeIcon className='text-white text-xs' icon={faThumbsUp} />
                                </div>
                                <div className="bg-red-500 rounded-full w-5 h-5 flex items-center justify-center border border-white">
                                    <FontAwesomeIcon className='text-white text-xs' icon={faHeart} />
                                </div>
                            </div>
                            <span className="text-gray-500 text-sm ml-1">10 likes</span>
                        </div>
                        <Link to={`/post/${postInfo.id}`} className="text-gray-500 text-sm">
                            {comments.length} Comments
                        </Link>
                    </div>

                    <div className="action-buttons flex justify-between border-y border-gray-200 py-2 mt-3">
                        <button className="flex-1 flex justify-center items-center gap-2 text-gray-600 hover:bg-gray-100 py-2 rounded-lg transition">
                            <FontAwesomeIcon icon={faThumbsUpRegular} />
                            <span>Like</span>
                        </button>
                        <button className="flex-1 flex justify-center items-center gap-2 text-gray-600 hover:bg-gray-100 py-2 rounded-lg transition">
                            <FontAwesomeIcon icon={faComment} />
                            <span>Comment</span>
                        </button>
                        <button className="flex-1 flex justify-center items-center gap-2 text-gray-600 hover:bg-gray-100 py-2 rounded-lg transition">
                            <FontAwesomeIcon icon={faShare} />
                            <span>Share</span>
                        </button>
                    </div>

                    <div className='my-4'>
                        <form onSubmit={isUpdatingComment ? updateComment : createComment} className="flex gap-2 items-center w-full">
                            <img
                                src={userData?.photo || postInfo.user.photo}
                                className="w-8 h-8 rounded-full object-cover hidden sm:block"
                                alt="User"
                            />
                            <input
                                type="text"
                                placeholder='Write a comment...'
                                className='bg-gray-100 border border-transparent focus:border-blue-400 focus:bg-white px-4 py-2 rounded-full w-full outline-none transition-all'
                                value={commentContent || ''}
                                onChange={(e) => setCommentContent(e.target.value)}
                            />
                            <button
                                type='submit'
                                className='bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition disabled:bg-gray-300'
                                disabled={commentContent?.trim()?.length < 1 || isLoading}
                            >
                                {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Send"}
                            </button>
                        </form>
                    </div>

                    <div className="border-b border-gray-200 mb-4"></div>

                    {/* 5. عرض قائمة الكومنتات */}
                    {comments.length > 0 ? (
                        <div className="comments space-y-4">
                            {comments.slice(0, commentsLimit).map((comment) => (
                                <CommentCard
                                    key={comment._id}
                                    commentInfo={comment}
                                    postOwnerId={postInfo.user._id}
                                    setComments={setComments}
                                    setFormForUpdate={setFormForUpdate}
                                    isUpdatingComment={isUpdatingComment}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className='text-gray-400 text-center py-3 text-sm'>
                            No comments yet. Be the first to comment!
                        </p>
                    )} {/* دي قفلة الـ comments.length */}
                </>
            )}
        </div>
    </>
}