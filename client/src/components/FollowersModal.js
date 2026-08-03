import React from "react";
import { Link } from "react-router-dom";

const FollowersModal = ({
  followers = [],
  currentUser,
  onClose,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "430px",
          maxWidth: "95%",
          maxHeight: "80vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 15px 40px rgba(0,0,0,.20)",
        }}
      >
        {/* Header */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              margin: 0,
            }}
          >
            Followers
          </h3>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {followers.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#888",
              padding: "40px 0",
            }}
          >
            No Followers Yet
          </div>
        )}

        {followers.map((person) => (
          <div
            key={person._id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <img
                src={
                  person.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt=""
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div>
                <div
                  style={{
                    fontWeight: "600",
                  }}
                >
                  {person.username}
                </div>

                <div
                  style={{
                    color: "#888",
                    fontSize: "13px",
                  }}
                >
                  @{person.username.toLowerCase()}
                </div>
              </div>
            </div>

            {person._id !== currentUser && (
              <Link to={`/profile/${person._id}`}>
                <button
                  style={{
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    padding: "8px 18px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                >
                  View
                </button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowersModal;