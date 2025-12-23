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
  const [selectedPost, setSelectedPost] = useState(null); // ADDED

  const fetchProfile = async () => {
    const res = await api.get(`/users/${id}/profile`);
    setProfile(res.data);

    const postsRes = await api.get(`/posts/user/${id}`);
    setPosts(postsRes.data);
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  // ---------------------- LIKE ---------------------------

  const handleLike = async (postId) => {
    await api.post(`/posts/${postId}/like`);
    fetchProfile();
  };

  // ---------------------- DELETE ---------------------------

  const handleDelete = async (postId) => {
    await api.delete(`/posts/${postId}`);
    fetchProfile();
  };

  // ---------------------- ADD COMMENT ---------------------------

  const handleAddComment = async (postId, commentText) => {
    await api.post(`/posts/${postId}/comments`, { text: commentText });
    fetchProfile();
  };

  // ---------------------- FOLLOW / UNFOLLOW ---------------------------

  const followUser = async (userId) => {
    await api.post(`/users/${userId}/follow`);
    fetchProfile();
  };

  const unfollowUser = async (userId) => {
    await api.post(`/users/${userId}/unfollow`);
    fetchProfile();
  };

  // ---------------------- SEARCH USERS ---------------------------

  const handleSearch = async () => {
    const res = await api.get(`/users/search?query=${search}`);
    setSearchResults(res.data);
  };

  // ---------------------- AVATAR UPLOAD ---------------------------

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    await api.post("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchProfile();
  };

  if (!profile) return <div>Loading...</div>;

  const isMe = user._id === profile._id;
  const amIFollowing = profile.followers.some((f) => f._id === user._id);

  return (
    <div className="container mt-4" style={{ maxWidth: "1100px" }}>
      <div className="row">
        {/* ================= LEFT COLUMN ================= */}
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

            <p className="mb-1">
              <strong>Username:</strong> {profile.username}
            </p>
            <p className="mb-3">
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

            {/* -------- Followers ---------- */}
            <h4 className="mt-4">Followers ({profile.followers.length})</h4>
            {profile.followers.map((f) => (
              <div
                key={f._id}
                className="d-flex align-items-center shadow-sm p-2 mb-2 bg-white rounded"
              >
                <img
                  src={
                    f.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="rounded-circle me-3"
                  style={{ width: "40px", height: "40px" }}
                  alt=""
                />
                <strong>{f.username}</strong>
              </div>
            ))}

            {/* -------- Following ---------- */}
            <h4 className="mt-4">Following ({profile.following.length})</h4>
            {profile.following.map((f) => (
              <div
                key={f._id}
                className="d-flex align-items-center shadow-sm p-2 mb-2 bg-white rounded"
              >
                <img
                  src={
                    f.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="rounded-circle me-3"
                  style={{ width: "40px", height: "40px" }}
                  alt=""
                />
                <strong className="flex-grow-1">{f.username}</strong>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => unfollowUser(f._id)}
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="col-md-8">
          {/* ------------ Search Users ------------- */}
          <div className="card shadow-sm p-3 mb-4">
            <h3>Search Users</h3>

            <div className="input-group mb-3" style={{ maxWidth: "450px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-dark" onClick={handleSearch}>
                Search
              </button>
            </div>

            <div className="mt-3">
              {searchResults.length === 0 && (
                <p className="text-muted">No users found</p>
              )}

              {searchResults.map((u) => {
                const iFollow = profile.following.some((x) => x._id === u._id);

                return (
                  <div
                    key={u._id}
                    className="d-flex align-items-center shadow-sm p-3 mb-3 bg-white rounded"
                  >
                    <img
                      src={
                        u.avatar ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      className="rounded-circle me-3"
                      style={{ width: "50px", height: "50px" }}
                      alt=""
                    />

                    <div className="flex-grow-1">
                      <strong>{u.username}</strong>
                      <p
                        className="text-muted m-0"
                        style={{ fontSize: "14px" }}
                      >
                        {u.email}
                      </p>
                    </div>

                    {u._id !== user._id &&
                      (iFollow ? (
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => unfollowUser(u._id)}
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => followUser(u._id)}
                        >
                          Follow
                        </button>
                      ))}

                    {u._id !== user._id && (
                      <a
                        href={`/chat/${u._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Chat
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ------------ User Posts ------------- */}
          <h3>Your Posts</h3>

          {posts.map((post) => (
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
