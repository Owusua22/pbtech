import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImages,
  uploadNewImage,
  removeImage,
  editImage, // ✅ Added
} from "../../Redux/Slice/imageSlice";

const Media = () => {
  const dispatch = useDispatch();
  const { images, loading } = useSelector((state) => state.images);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editingImage, setEditingImage] = useState(null);
  const [newName, setNewName] = useState("");
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  // ✅ Upload handler
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setProgress(0);
      await dispatch(uploadNewImage(file, setProgress));
      setUploading(false);
      e.target.value = "";
    }
  };

  // ✅ Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      dispatch(removeImage(id));
    }
  };

  // ✅ Start editing an image
  const startEditing = (img) => {
    setEditingImage(img);
    setNewName(img.name || "");
    setNewFile(null);
  };

  // ✅ Handle file change when updating image
  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  // ✅ Save updated image (rename or replace)
  const handleUpdate = async () => {
    if (!editingImage) return;

    await dispatch(
      editImage({
        id: editingImage._id,
        file: newFile,
        name: newName,
      })
    );

    // Reset states
    setEditingImage(null);
    setNewName("");
    setNewFile(null);
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#1f2937",
        }}
      >
        📸 Media Gallery
      </h2>

      {/* Upload Button */}
      <label
        htmlFor="file-upload"
        style={{
          display: "inline-block",
          backgroundColor: "#2563eb",
          color: "white",
          padding: "10px 18px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "500",
          marginBottom: "20px",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
      >
        Upload Image
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        style={{ display: "none" }}
      />

      {/* Upload Progress Bar */}
      {uploading && (
        <div style={{ margin: "10px 0", color: "#2563eb" }}>
          Uploading... {progress}%
          <div
            style={{
              height: "6px",
              background: "#e5e7eb",
              borderRadius: "4px",
              overflow: "hidden",
              marginTop: "5px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#2563eb",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* Image Grid */}
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "20px",
          }}
        >
          {images && images.length > 0 ? (
            images.map((img) => (
              <div
                key={img._id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                  padding: "10px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0,0,0,0.05)";
                }}
              >
                <img
                  src={img.imageUrl}
                  alt={img.name || "Uploaded"}
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => setPreview(img.imageUrl)}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/150?text=No+Image")
                  }
                />
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginTop: "10px",
                    color: "#374151",
                    textAlign: "center",
                    wordBreak: "break-word",
                  }}
                >
                  {img.name || "Untitled"}
                </p>

                {/* Update & Delete buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    marginTop: "8px",
                  }}
                >
                  <button
                    onClick={() => startEditing(img)}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      cursor: "pointer",
                      width: "50%",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(img._id)}
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      cursor: "pointer",
                      width: "50%",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
              No images uploaded yet.
            </p>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "12px",
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      )}

      {/* ✏️ Edit Modal */}
      {editingImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: "12px" }}>Edit Image</h3>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Image name"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                marginBottom: "10px",
              }}
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginBottom: "10px" }}
            />

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setEditingImage(null)}
                style={{
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
