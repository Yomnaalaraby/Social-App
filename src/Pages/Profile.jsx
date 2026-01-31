import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import UserPhoto from '../assets/images/avatar.png';
import SinglePost from './SinglePost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getUserPostsApi, updateProfilePicApi } from '../Services/PostServices';
import PostUpload from '../Components/PostUpload';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function ProfilePage() {
    const { userData, token, setUserData } = useContext(AuthContext);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const queryClient = useQueryClient();

    const { data: userPosts, isLoading: isLoadingPosts } = useQuery({
        queryKey: ['userPosts', userData?._id],
        queryFn: () => getUserPostsApi(userData._id, token),
        enabled: !!userData?._id,
        select: (response) => response.posts ? [...response.posts].reverse() : []
    });

    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploadingImage(true);
            const formData = new FormData();
            formData.append('photo', file);

            try {
                const response = await updateProfilePicApi(formData, token);
                if (response?.message === 'success' && response.user?.photo) {
                    setUserData(prev => ({ ...prev, photo: response.user.photo }));
                    queryClient.invalidateQueries({ queryKey: ['userPosts'] });
                }
            } catch (error) {
                console.error("Error uploading profile picture:", error);
            }
            setIsUploadingImage(false);
        }
    };

    return <>
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="max-w-2xl mx-auto px-4">

                <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-6">
                    <div className="relative inline-block group">
                        <img
                            className={`w-32 h-32 rounded-full object-cover border-4 border-blue-50 shadow-sm mx-auto transition-opacity ${isUploadingImage ? 'opacity-50' : 'opacity-100'}`}
                            src={userData?.photo || UserPhoto}
                            alt="Profile"
                        />
                        <label className="absolute bottom-0 right-0 bg-blue-600 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-2 border-white text-white hover:bg-blue-700 transition shadow-md">
                            <FontAwesomeIcon icon={faCamera} size="sm" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                            />
                        </label>
                        {isUploadingImage && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-2xl" />
                            </div>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mt-4">
                        {userData?.name || "User Name"}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {userData?.email || "user@example.com"}
                    </p>

                    <div className="flex justify-center gap-8 mt-6 border-t border-gray-50 pt-6">
                        <div>
                            <p className="font-bold text-gray-900">{userPosts?.length}</p>
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Posts</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">0</p>
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Followers</p>
                        </div>
                    </div>
                </div>

                <PostUpload getAllPosts={() => queryClient.invalidateQueries({ queryKey: ['userPosts'] })} />
                <div className="my-6 border-b border-gray-300"></div>

                <div className="space-y-5">
                    <h2 className="text-lg font-bold text-gray-800 px-1 mb-2">My Posts</h2>

                    {isLoadingPosts ? (
                        <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500 text-3xl mb-3" />
                            <p className="text-gray-400">Loading your posts...</p>
                        </div>
                    ) : userPosts?.length > 0 ? (
                        userPosts?.map(post => (
                            <SinglePost
                                key={post._id}
                                postInfo={post}
                            />
                        ))
                    ) : (
                        <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                            <p className="text-gray-400">You haven't posted anything yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>;
}