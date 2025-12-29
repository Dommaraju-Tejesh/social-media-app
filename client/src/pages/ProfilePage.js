import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import CommentSection from "../components/CommentSection";

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchProfile = async () => {
    const res = await api.get(`/api/users/${id}/profile`);
    setProfile(res.data || null);

    const postsRes = await api.get(`/api/posts/user/${id}`);
    setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleLike = async (postId) => {
    await api.post(`/api/posts/${postId}/like`);
    fetchProfile();
  };

  const handleDelete = async (postId) => {
    await api.delete(`/api/posts/${postId}`);
    fetchProfile();
  };

  const handleAddComment = async (postId, commentText) => {
    await api.post(`/api/posts/${postId}/comments`, { text: commentText });
    fetchProfile();
  };

  const followUser = async (userId) => {
    await api.post(`/api/users/${userId}/follow`);
    fetchProfile();
  };

  const unfollowUser = async (userId) => {
    await api.post(`/api/users/${userId}/unfollow`);
    fetchProfile();
  };

  const handleSearch = async () => {
    const res = await api.get(`/api/users/search?query=${search}`);
    setSearchResults(Array.isArray(res.data) ? res.data : []);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    await api.post("/api/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchProfile();
  };

  if (!profile) return <div>Loading...</div>;

  const isMe = user?._id === profile?._id;
  const amIFollowing =
    Array.isArray(profile.followers) &&
    profile.followers.some((f) => f._id === user?._id);

  return (
    <div className="container mt-4" style={{ maxWidth: "1100px" }}>
      <div className="row">
        {/* LEFT */}
        <div className="col-md-4">
          <div className="card shadow-sm p-3 mb-4">
            <h3 className="text-center">Welcome</h3>

            <div className="text-center">
              <img
                src={
                  profile.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
                className="rounded-circle mb-3"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            </div>

            {isMe && (
              <>
                <input
                  type="file"
                  className="form-control mb-2"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                />
                <button
                  className="btn btn-primary w-100 mb-3"
                  onClick={handleAvatarUpload}
                >
                  Upload / Edit Profile Picture
                </button>
              </>
            )}

            <p>
              <strong>Username:</strong> {profile.username}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>

            {!isMe &&
              (amIFollowing ? (
                <button
                  className="btn btn-danger w-100"
                  onClick={() => unfollowUser(profile._id)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="btn btn-success w-100"
                  onClick={() => followUser(profile._id)}
                >
                  Follow
                </button>
              ))}

            <h4 className="mt-4">
              Followers ({profile.followers?.length || 0})
            </h4>

            {Array.isArray(profile.followers) &&
              profile.followers.map((f) => (
                <div key={f._id} className="d-flex align-items-center mb-2">
                  <strong>{f.username}</strong>
                </div>
              ))}

            <h4 className="mt-4">
              Following ({profile.following?.length || 0})
            </h4>

            {Array.isArray(profile.following) &&
              profile.following.map((f) => (
                <div key={f._id} className="d-flex align-items-center mb-2">
                  <strong>{f.username}</strong>
                </div>
              ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-md-8">
          <div className="card shadow-sm p-3 mb-4">
            <h3>Search Users</h3>

            <div className="input-group mb-3">
              <input
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-dark" onClick={handleSearch}>
                Search
              </button>
            </div>

            {Array.isArray(searchResults) &&
              searchResults.map((u) => {
                const iFollow =
                  Array.isArray(profile.following) &&
                  profile.following.some((x) => x._id === u._id);

                return (
                  <div key={u._id} className="mb-2">
                    <strong>{u.username}</strong>{" "}
                    {u._id !== user?._id &&
                      (iFollow ? (
                        <button
                          className="btn btn-danger btn-sm ms-2"
                          onClick={() => unfollowUser(u._id)}
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          className="btn btn-success btn-sm ms-2"
                          onClick={() => followUser(u._id)}
                        >
                          Follow
                        </button>
                      ))}
                  </div>
                );
              })}
          </div>

          <h3>Your Posts</h3>

          {Array.isArray(posts) &&
            posts.map((post) => (
              <div key={post._id}>
                <PostCard
                  post={post}
                  currentUserId={user?._id}
                  onLike={() => handleLike(post._id)}
                  onDelete={() => handleDelete(post._id)}
                  onOpenComments={() => setSelectedPost(post)}
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
      </div>
    </div>
  );
};

export default ProfilePage;
