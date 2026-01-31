import { useContext } from 'react'
import UserPhoto from '../assets/images/avatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../Context/AuthContext';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { deleteCommentApi } from '../Services/CommentServices';

export default function CommentCard({ commentInfo, postOwnerId, setComments, setFormForUpdate, isUpdatingComment }) {
    const commentCreatorPhoto = commentInfo.commentCreator.photo.includes('undefined') ? UserPhoto : commentInfo.commentCreator.photo;
    const { userData, token } = useContext(AuthContext);
    const isCommentOwner = userData?._id === commentInfo?.commentCreator?._id;
    const isPostOwner = userData?._id === postOwnerId;

    async function deleteComment() {
        const response = await deleteCommentApi(commentInfo._id, token)
        if (response?.message === 'success') {
            if (setComments) {
                setComments((oldComments) => {
                    return oldComments.filter((com) => com._id !== commentInfo._id);
                });
            }
        }
    }



    return <>
        <div className="commentCard group relative">
            <div className="flex gap-3 mt-4 items-start">
                <div>
                    <img className='size-10 rounded-full object-cover' src={commentCreatorPhoto} alt="" />
                </div>

                <div className='flex-1'>
                    <div className='bg-gray-100 text-gray-700 p-3 px-4 rounded-2xl inline-block min-w-[150px] relative'>
                        <div className="flex justify-between items-center gap-2">
                            <span className="name text-sm font-bold">{commentInfo.commentCreator.name}</span>

                            {(isCommentOwner && isPostOwner) && (
                                <Dropdown>
                                    <DropdownTrigger>
                                        <div className='cursor-pointer px-1'>
                                            <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-400 text-xs" />
                                        </div>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Comment Actions" >
                                        {isCommentOwner && (
                                            <DropdownItem onClick={() => setFormForUpdate(commentInfo.content, commentInfo._id)} key="edit">Edit</DropdownItem>
                                        )}

                                        <DropdownItem key="delete" onClick={deleteComment} className="text-danger" color="danger">
                                            Delete
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            )}
                        </div>

                        <p className='mt-1 text-sm'>{commentInfo.content}</p>
                    </div>

                    <div className='flex gap-4 ml-2 mt-1 text-gray-500 text-xs font-semibold'>
                        <span>{new Date(commentInfo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className='cursor-pointer hover:underline'>Like</span>
                        <span className='cursor-pointer hover:underline'>Reply</span>
                    </div>
                </div>
            </div>
        </div>
    </>
}
