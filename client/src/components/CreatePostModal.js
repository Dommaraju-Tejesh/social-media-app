import React, { useEffect, useState } from "react";
import UploadProgressModal from "./UploadProgressModal";

const CreatePostModal = ({
  show,
  onClose,
  text,
  setText,
  image,
  setImage,
  onSubmit,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  if (!show) return null;

  const isVideo = image && image.type && image.type.startsWith("video");

  const handleSubmit = async () => {
    if (uploading) return;

    setUploading(true);
    setProgress(0);
    setMessage("🐯 Pulli is preparing your post...");

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 250);

    try {
      await onSubmit();

      clearInterval(interval);

      setProgress(100);
      setMessage("✅ Your post has been shared!");

      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        setMessage("");
      }, 1200);
    } catch (err) {
      clearInterval(interval);

      setUploading(false);
      setProgress(0);
      setMessage("");

      alert("Upload failed.");
    }
  };

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "block",
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{
              borderRadius: "18px",
            }}
          >
            <div className="modal-header">
              <h4 className="modal-title">Create Post</h4>

              <button
                className="btn-close"
                onClick={onClose}
                disabled={uploading}
              ></button>
            </div>

            <div className="modal-body">
              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <input
                type="file"
                disabled={uploading}
                className="form-control"
                accept="image/*,video/*"
                onChange={(e) => setImage(e.target.files[0])}
              />

              {preview && (
                <div className="mt-3">
                  {isVideo ? (
                    <video
                      src={preview}
                      controls
                      style={{
                        width: "100%",
                        borderRadius: "12px",
                        maxHeight: "400px",
                      }}
                    />
                  ) : (
                    <img
                      src={preview}
                      alt="preview"
                      style={{
                        width: "100%",
                        borderRadius: "12px",
                        maxHeight: "400px",
                        objectFit: "contain",
                      }}
                    />
                  )}

                  <button
                    className="btn btn-outline-danger mt-3 w-100"
                    onClick={() => setImage(null)}
                  >
                    Remove Media
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={uploading}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={uploading}
                style={{
                  minWidth: "120px",
                }}
              >
                {uploading ? "🐯 Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <UploadProgressModal
        show={uploading}
        progress={progress}
        message={message}
      />
    </>
  );
};

export default CreatePostModal;
