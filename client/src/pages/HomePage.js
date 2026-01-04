import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import CommentSection from "../components/CommentSection";

const HomePage = () => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = async () => {
    const res = await api.get("/posts"); // ✅ FIXED
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    await api.post("/posts", formData, { // ✅ FIXED
      headers: { "Content-Type": "multipart/form-data" },
    });

    setText("");
    setImage(null);
    fetchPosts();
  };

  const handleLike = async (postId) => {
    await api.post(`/posts/${postId}/like`); // ✅ FIXED
    fetchPosts();
  };

  const handleDelete = async (postId) => {
    await api.delete(`/posts/${postId}`); // ✅ FIXED
    fetchPosts();
  };

  const handleAddComment = async (postId, commentText) => {
    await api.post(`/posts/${postId}/comments`, { text: commentText }); // ✅ FIXED
    fetchPosts();
  };

  return (
    <div>
      <div className="card p-3 mb-4 shadow-sm">
        <h4>Upload Post</h4>

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Say something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="file"
          className="form-control mb-2"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button className="btn btn-primary" onClick={handleCreatePost}>
          Post
        </button>
      </div>

      {Array.isArray(posts) &&
        posts.map((post) => (
          <div key={post._id}>
            <PostCard
              post={post}
              onLike={() => handleLike(post._id)}
              onDelete={() => handleDelete(post._id)}
              onOpenComments={() => setSelectedPost(post)}
              currentUserId={user?._id}
            />

            {selectedPost?._id === post._id && (
              <CommentSection
                post={selectedPost}
                onAddComment={handleAddComment}
                onClose={() => setSelectedPost(null)}
              />
            )}
          </div>
        ))}
    </div>
  );
};

export default HomePage;

