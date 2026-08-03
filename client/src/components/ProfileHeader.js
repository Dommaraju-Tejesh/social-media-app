import React from "react";

const ProfileHeader = ({
  profile,
  isMe,
  amIFollowing,
  avatarFile,
  setAvatarFile,
  handleAvatarUpload,
  followUser,
  unfollowUser,
  postsCount,

  openFollowers,
  openFollowing,
}) => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto 30px",
        borderRadius: "26px",
        overflow: "hidden",
        background: "rgba(255,255,255,.82)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 12px 35px rgba(0,0,0,.10)",
        border: "1px solid rgba(255,255,255,.45)",
      }}
    >
      {/* Cover */}
      <div
        style={{
          height: "220px",
          background: "linear-gradient(135deg,#2563eb,#4f8dfd,#7cb7ff)",
          position: "relative",
        }}
      />

      <div
        style={{
          textAlign: "center",
          padding: "0 30px 35px",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            marginTop: "-85px",
            position: "relative",
            display: "inline-block",
          }}
        >
          <img
            src={
              profile.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="avatar"
            style={{
              width: "170px",
              height: "170px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "6px solid white",
              boxShadow: "0 8px 20px rgba(0,0,0,.18)",
            }}
          />

          {isMe && (
            <>
              <input
                id="avatarUpload"
                type="file"
                hidden
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />

              <button
                onClick={() => document.getElementById("avatarUpload").click()}
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontSize: "20px",
                  cursor: "pointer",
                  boxShadow: "0 5px 15px rgba(37,99,235,.35)",
                }}
              >
                📷
              </button>
            </>
          )}
        </div>

        {/* Username */}
        <h2
          style={{
            marginTop: "20px",
            marginBottom: "5px",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          {profile.username}
        </h2>

        <div
          style={{
            color: "#6b7280",
            marginBottom: "25px",
          }}
        >
          @{profile.username.toLowerCase()}
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "70px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <div style={{ cursor: "pointer" }}>
            <h3 style={{ margin: 0 }}>{postsCount}</h3>
            <small>Posts</small>
          </div>

          <div style={{ cursor: "pointer" }} onClick={openFollowers}>
            <h3 style={{ margin: 0 }}>{profile.followers?.length || 0}</h3>

            <small>Followers</small>
          </div>

          <div style={{ cursor: "pointer" }} onClick={openFollowing}>
            <h3 style={{ margin: 0 }}>{profile.following?.length || 0}</h3>

            <small>Following</small>
          </div>
        </div>

        {/* Buttons */}
        {isMe ? (
          <button
            onClick={handleAvatarUpload}
            disabled={!avatarFile}
            style={{
              border: "none",
              padding: "14px 34px",
              borderRadius: "35px",
              background: "#2563eb",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Save Profile Picture
          </button>
        ) : amIFollowing ? (
          <button
            onClick={() => unfollowUser(profile._id)}
            style={{
              border: "none",
              padding: "14px 40px",
              borderRadius: "35px",
              background: "#ef4444",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={() => followUser(profile._id)}
            style={{
              border: "none",
              padding: "14px 40px",
              borderRadius: "35px",
              background: "#2563eb",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Follow
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
