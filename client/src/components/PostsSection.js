import React from "react";
import PostCard from "./PostCard";
import CommentSection from "./CommentSection";

const PostsSection = ({
  posts,
  currentUserId,
  handleLike,
  handleDelete,
  selectedPost,
  setSelectedPost,
  handleAddComment,
  isMuted,
  setIsMuted,
  friends,
}) => {
  return (
    <>
      <h3
        style={{
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        My Posts ({posts.length})
      </h3>

      {posts.length === 0 ? (
        <div
          className="card p-5 text-center"
          style={{
            borderRadius: "20px",
          }}
        >
          <h5>No Posts Yet</h5>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post._id}>
            <PostCard
              post={post}
              currentUserId={currentUserId}
              onLike={() => handleLike(post._id)}
              onDelete={() => handleDelete(post._id)}
              onOpenComments={() => setSelectedPost(post)}
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
    </>
  );
};

export default PostsSection;