import { faCircleXmark, faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { createPostApi } from '../Services/PostServices';
import { AuthContext } from "../Context/AuthContext";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import UserPhoto from '../assets/images/avatar.png'


export default function PostUpload({ getAllPosts }) {
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const { token, userData } = useContext(AuthContext);

    function handelImage(e) {
        setImage(e?.target.files[0])
        setImageURL(e && URL.createObjectURL(e.target.files[0]));

        if (e) {
            e.target.value = ('')
        }
    }

    async function createPost(e) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        if (body) formData.append('body', body);
        if (image) formData.append('image', image);

        const response = await createPostApi(formData, token);

        if (response.message === 'success') {
            setBody("");
            setImage(null);
            setImageURL('')
            await getAllPosts();
        }
        setIsLoading(false);
    }

    return (
        <section className="pt-8">
            <div className="container max-w-2xl mx-auto shadow-lg bg-white rounded-2xl p-5">
                <header className="flex gap-3">
                    <div className="avatar">
                        <img
                            src={userData?.photo || "https://linked-posts.routemisr.com/uploads/default-profile.png"}
                            alt="User Profile"
                            className="size-12 rounded-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-gray-700 font-semibold">Create Post</h3>
                        <p className="text-gray-500 text-sm">Share your thoughts with the world</p>
                    </div>
                </header>
                <form className="input mt-4" onSubmit={createPost}>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full bg-gray-100 rounded p-2 outline-0"
                        rows={4}
                        placeholder="What's in your mind?">
                    </textarea>

                    {imageURL && <div className="mt-3 relative">
                        <FontAwesomeIcon icon={faCircleXmark} className="text-lg top-4 end-4 absolute text-red-700 cursor-pointer "
                            onClick={() => handelImage(null)} />
                        <img src={imageURL} className="w-full rounded-md" alt="" />
                    </div>}

                    {image && <p className="text-xs text-green-600 mt-2">Selected: {image.name}</p>}

                    <div className="flex justify-between items-center mt-4 border-t pt-3">
                        <label className="text-lg hover:text-blue-400 cursor-pointer text-gray-700 flex items-center gap-2">
                            <FontAwesomeIcon icon={faImage} />
                            <span>Photo</span>
                            <input type="file" onChange={handelImage} className="hidden" />
                        </label>
                        <button
                            type="Submit"
                            disabled={(!body && !image) || isLoading}
                            className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
                            {isLoading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                    <span>Posting...</span>
                                </>
                            ) : (
                                "Post"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
