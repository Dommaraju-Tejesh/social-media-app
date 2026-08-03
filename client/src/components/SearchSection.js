import React from "react";
import { Link } from "react-router-dom";

const SearchSection = ({
  search,
  setSearch,
  handleSearch,
  searchResults,
  user,
  profile,
  followUser,
  unfollowUser,
}) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "25px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        marginBottom: "30px",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontWeight: "700",
        }}
      >
        🔍 Search Friends
      </h2>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search username..."
          style={{
            flex: 1,
            padding: "14px 18px",
            borderRadius: "30px",
            border: "1px solid #ddd",
            outline: "none",
            fontSize: "15px",
          }}
        />

        <button
          onClick={() => handleSearch(search)}
          style={{
            border: "none",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "30px",
            padding: "0 28px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {searchResults.map((u) => {
        const iFollow =
          profile.following && profile.following.some((x) => x._id === u._id);

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "15px",
              borderRadius: "15px",
              marginBottom: "12px",
              background: "#f8fafc",
            }}
          >
            <Link
              to={`/profile/${u._id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                textDecoration: "none",
                color: "inherit",
                flex: 1,
              }}
            >
              <img
                src={
                  u.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt=""
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "17px",
                  }}
                >
                  {u.username}
                </div>

                <div
                  style={{
                    color: "#777",
                  }}
                >
                  @{u.username.toLowerCase()}
                </div>
              </div>
            </Link>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              {u._id !== user?._id &&
                (iFollow ? (
                  <button
                    onClick={() => unfollowUser(u._id)}
                    style={{
                      border: "none",
                      background: "#ef4444",
                      color: "#fff",
                      borderRadius: "25px",
                      padding: "10px 18px",
                      cursor: "pointer",
                    }}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => followUser(u._id)}
                    style={{
                      border: "none",
                      background: "#2563eb",
                      color: "#fff",
                      borderRadius: "25px",
                      padding: "10px 18px",
                      cursor: "pointer",
                    }}
                  >
                    Follow
                  </button>
                ))}

              <Link to={`/chat/${u._id}`}>
                <button
                  style={{
                    border: "none",
                    background: "#10b981",
                    color: "#fff",
                    borderRadius: "25px",
                    padding: "10px 18px",
                    cursor: "pointer",
                  }}
                >
                  💬 Chat
                </button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchSection;
