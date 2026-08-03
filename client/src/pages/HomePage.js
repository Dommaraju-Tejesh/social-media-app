import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import CommentSection from "../components/CommentSection";
import CreatePostModal from "../components/CreatePostModal";

const HomePage = () => {
  const { user } = useAuth();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePost, setSharePost] = useState(null);
  const [friends, setFriends] = useState([]);

  const fetchPosts = async () => {
    const res = await api.get("/posts");

    setPosts(res.data);

    if (selectedPost) {
      const updatedPost = res.data.find((p) => p._id === selectedPost._id);

      if (updatedPost) {
        setSelectedPost(updatedPost);
      }
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchPosts();
    }
  }, [user]);

  const handleCreatePost = async (e) => {
    if (e) e.preventDefault();

    const formData = new FormData();
    formData.append("text", text);

    if (image) {
      formData.append("image", image);
    }

    await api.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setText("");
    setImage(null);
    setShowModal(false);

    fetchPosts();
  };

  const handleLike = async (postId) => {
    await api.post(`/posts/${postId}/like`);
    fetchPosts();
  };

  const handleDelete = async (postId) => {
    await api.delete(`/posts/${postId}`);
    fetchPosts();
  };

  const handleAddComment = async () => {
    fetchPosts();
  };

  return (
    <>
      {/* Create Post Button */}
      <button
        className="btn btn-primary rounded-circle shadow"
        onClick={() => setShowModal(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "65px",
          height: "65px",
          fontSize: "30px",
          zIndex: 1050,
        }}
      >
        +
      </button>

      <CreatePostModal
        show={showModal}
        onClose={() => setShowModal(false)}
        text={text}
        setText={setText}
        image={image}
        setImage={setImage}
        onSubmit={handleCreatePost}
      />

      {/* Main Feed */}
      <div className="container py-4">
        {/* Welcome Section */}
        <div
          className="text-center mb-5"
          style={{
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          <h2 className="fw-bold">
            Welcome{user ? `, ${user.username}` : ""} 👋
          </h2>

          <p className="text-muted mb-0">
            Share your moments, photos and videos with Pulli Media.
          </p>
        </div>

        {/* Feed */}
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          {posts.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <h5>No posts yet</h5>
              <p>Be the first person to create a post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id}>
                <PostCard
                  post={post}
                  onLike={() => handleLike(post._id)}
                  onDelete={() => handleDelete(post._id)}
                  onOpenComments={() => setSelectedPost(post)}
                  currentUserId={user?._id}
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  friends={friends}
                />

                {selectedPost?._id === post._id && (
                  <CommentSection
                    post={selectedPost}
                    onAddComment={handleAddComment}
                    onClose={() => setSelectedPost(null)}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
