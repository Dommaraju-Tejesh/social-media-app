import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import CommentSection from "../components/CommentSection";
import ProfileHeader from "../components/ProfileHeader";
import FollowersModal from "../components/FollowersModal";
import FollowingModal from "../components/FollowingModal";
import SearchSection from "../components/SearchSection";
import PostsSection from "../components/PostsSection";

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const fetchProfile = async () => {
    const res = await api.get(`/users/${id}/profile`);
    setProfile(res.data || null);

    const postsRes = await api.get(`/posts/user/${id}`);
    setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleLike = async (postId) => {
    await api.post(`/posts/${postId}/like`);
    fetchProfile();
  };

  const handleDelete = async (postId) => {
    await api.delete(`/posts/${postId}`);
    fetchProfile();
  };

  const handleAddComment = async (postId, commentText) => {
    await api.post(`/posts/${postId}/comments`, { text: commentText });
    fetchProfile();
  };

  const followUser = async (userId) => {
    await api.post(`/users/${userId}/follow`);
    fetchProfile();
  };

  const unfollowUser = async (userId) => {
    await api.post(`/users/${userId}/unfollow`);
    fetchProfile();
  };

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await api.get(`/users/search?query=${value}`);
      setSearchResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    // Use "image" to match your backend's upload.single("image")
    formData.append("image", avatarFile);

    try {
      await api.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Clear the selection and refresh
      setAvatarFile(null);
      fetchProfile();
      alert("Profile picture updated!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please check the console for details.");
    }
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
          <ProfileHeader
            profile={profile}
            isMe={isMe}
            amIFollowing={amIFollowing}
            avatarFile={avatarFile}
            setAvatarFile={setAvatarFile}
            handleAvatarUpload={handleAvatarUpload}
            followUser={followUser}
            unfollowUser={unfollowUser}
            postsCount={posts.length}
            openFollowers={() => {
              console.log("Followers clicked");
              setShowFollowers(true);
            }}
            openFollowing={() => {
              console.log("Following clicked");
              setShowFollowing(true);
            }}
          />
        </div>

        {/* RIGHT */}
        <div className="col-md-8">
          <SearchSection
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            searchResults={searchResults}
            user={user}
            profile={profile}
            followUser={followUser}
            unfollowUser={unfollowUser}
          />

          <PostsSection
            posts={posts}
            currentUserId={user?._id}
            handleLike={handleLike}
            handleDelete={handleDelete}
            selectedPost={selectedPost}
            setSelectedPost={setSelectedPost}
            handleAddComment={handleAddComment}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            friends={profile.following}
          />
        </div>
      </div>
      {showFollowers && (
        <FollowersModal
          followers={profile.followers}
          currentUser={user?._id}
          onClose={() => setShowFollowers(false)}
        />
      )}
      {/* Following Modal */}
      {showFollowing && (
        <FollowingModal
          following={profile.following}
          currentUser={user?._id}
          onClose={() => setShowFollowing(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
