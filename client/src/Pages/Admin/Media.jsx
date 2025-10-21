import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImages,
  uploadNewImage,
  removeImage,
  editImage,
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
  
  // Upload modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadName, setUploadName] = useState("");
  const [uploadPreview, setUploadPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  // Handle file selection for upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadName(file.name.split('.').slice(0, -1).join('.'));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => setUploadPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Upload handler
  const handleUpload = async () => {
    if (!uploadFile) return;
    
    setUploading(true);
    setProgress(0);
    await dispatch(uploadNewImage(uploadFile, setProgress));
    setUploading(false);
    
    // Reset upload modal
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadName("");
    setUploadPreview(null);
  };

  // Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      dispatch(removeImage(id));
    }
  };

  // Start editing an image
  const startEditing = (img) => {
    setEditingImage(img);
    setNewName(img.name || "");
    setNewFile(null);
  };

  // Handle file change when updating image
  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  // Save updated image
  const handleUpdate = async () => {
    if (!editingImage) return;

    await dispatch(
      editImage({
        id: editingImage._id,
        file: newFile,
        name: newName,
      })
    );

    setEditingImage(null);
    setNewName("");
    setNewFile(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Media Gallery</h2>
          <p style={styles.subtitle}>
            {images?.length || 0} {images?.length === 1 ? 'image' : 'images'} uploaded
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          style={styles.uploadButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#1d4ed8"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#2563eb"}
        >
          <span style={styles.uploadIcon}>+</span> Upload Image
        </button>
      </div>

      {/* Upload Progress Bar */}
      {uploading && (
        <div style={styles.progressContainer}>
          <div style={styles.progressHeader}>
            <span>Uploading...</span>
            <span style={styles.progressText}>{progress}%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progress}%`}} />
          </div>
        </div>
      )}

      {/* Image Grid */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading images...</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {images && images.length > 0 ? (
            images.map((img) => (
              <div key={img._id} style={styles.card}>
                <div style={styles.imageWrapper}>
                  <img
                    src={img.imageUrl}
                    alt={img.name || "Uploaded"}
                    style={styles.image}
                    onClick={() => setPreview(img.imageUrl)}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300x200?text=Image+Not+Found")
                    }
                  />
                  <div style={styles.imageOverlay}>
                    <button
                      onClick={() => setPreview(img.imageUrl)}
                      style={styles.viewButton}
                    >
                      👁️ View
                    </button>
                  </div>
                </div>
                
                <div style={styles.cardContent}>
                  <p style={styles.imageName}>
                    {img.name || "Untitled"}
                  </p>
                  
                  <div style={styles.buttonGroup}>
                    <button
                      onClick={() => startEditing(img)}
                      style={{...styles.actionButton, ...styles.editButton}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#10b981"}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(img._id)}
                      style={{...styles.actionButton, ...styles.deleteButton}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📸</div>
              <h3 style={styles.emptyTitle}>No images yet</h3>
              <p style={styles.emptyText}>Upload your first image to get started</p>
              <button
                onClick={() => setShowUploadModal(true)}
                style={styles.emptyButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#2563eb"}
              >
                Upload Image
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={styles.modalOverlay} onClick={() => !uploading && setShowUploadModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Upload New Image</h3>
            
            <div style={styles.uploadArea}>
              {uploadPreview ? (
                <div style={styles.previewContainer}>
                  <img src={uploadPreview} alt="Preview" style={styles.previewImage} />
                  <button
                    onClick={() => {
                      setUploadFile(null);
                      setUploadPreview(null);
                      setUploadName("");
                    }}
                    style={styles.removePreview}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label htmlFor="upload-file" style={styles.uploadLabel}>
                  <div style={styles.uploadPlaceholder}>
                    <span style={styles.uploadPlaceholderIcon}>📁</span>
                    <p style={styles.uploadPlaceholderText}>Click to select image</p>
                    <p style={styles.uploadPlaceholderSubtext}>PNG, JPG, GIF up to 10MB</p>
                  </div>
                </label>
              )}
              <input
                id="upload-file"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={styles.hiddenInput}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Image Name</label>
              <input
                type="text"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="Enter image name"
                style={styles.input}
              />
            </div>

            <div style={styles.modalActions}>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setUploadName("");
                  setUploadPreview(null);
                }}
                disabled={uploading}
                style={{...styles.modalButton, ...styles.cancelButton}}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploading}
                style={{
                  ...styles.modalButton,
                  ...styles.saveButton,
                  opacity: !uploadFile || uploading ? 0.5 : 1,
                  cursor: !uploadFile || uploading ? "not-allowed" : "pointer"
                }}
                onMouseEnter={(e) => uploadFile && !uploading && (e.target.style.backgroundColor = "#1d4ed8")}
                onMouseLeave={(e) => uploadFile && !uploading && (e.target.style.backgroundColor = "#2563eb")}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {preview && (
        <div onClick={() => setPreview(null)} style={styles.previewModal}>
          <button onClick={() => setPreview(null)} style={styles.closePreview}>
            ✕
          </button>
          <img src={preview} alt="Preview" style={styles.previewModalImage} />
        </div>
      )}

      {/* Edit Modal */}
      {editingImage && (
        <div style={styles.modalOverlay} onClick={() => setEditingImage(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Edit Image</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Image Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter image name"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Replace Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={styles.fileInput}
              />
              {newFile && (
                <p style={styles.fileSelected}>✓ {newFile.name}</p>
              )}
            </div>

            <div style={styles.modalActions}>
              <button
                onClick={() => setEditingImage(null)}
                style={{...styles.modalButton, ...styles.cancelButton}}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                style={{...styles.modalButton, ...styles.saveButton}}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#2563eb"}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 4px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 6px rgba(37, 99, 235, 0.2)",
  },
  uploadIcon: {
    fontSize: "20px",
    fontWeight: "300",
  },
  progressContainer: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#475569",
    fontWeight: "500",
  },
  progressText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  progressBar: {
    height: "8px",
    backgroundColor: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2563eb",
    transition: "width 0.3s ease",
    borderRadius: "999px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "16px",
    color: "#64748b",
    fontSize: "15px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease",
  },
  imageWrapper: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  viewButton: {
    backgroundColor: "white",
    color: "#0f172a",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  cardContent: {
    padding: "16px",
  },
  imageName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "12px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",
  },
  actionButton: {
    flex: 1,
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "white",
  },
  editButton: {
    backgroundColor: "#10b981",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "80px 20px",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  emptyText: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "24px",
  },
  emptyButton: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    backgroundColor: "white",
    padding: "32px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "24px",
    marginTop: 0,
  },
  uploadArea: {
    marginBottom: "24px",
  },
  uploadLabel: {
    display: "block",
    cursor: "pointer",
  },
  uploadPlaceholder: {
    border: "2px dashed #cbd5e1",
    borderRadius: "12px",
    padding: "48px 24px",
    textAlign: "center",
    transition: "all 0.2s ease",
    backgroundColor: "#f8fafc",
  },
  uploadPlaceholderIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "12px",
  },
  uploadPlaceholderText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#475569",
    margin: "0 0 4px 0",
  },
  uploadPlaceholderSubtext: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: 0,
  },
  previewContainer: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "240px",
    objectFit: "cover",
    borderRadius: "12px",
  },
  removePreview: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenInput: {
    display: "none",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  },
  fileInput: {
    width: "100%",
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  fileSelected: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#10b981",
    fontWeight: "500",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "32px",
  },
  modalButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  cancelButton: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    color: "white",
  },
  previewModal: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1100,
    cursor: "pointer",
    padding: "20px",
  },
  closePreview: {
    position: "absolute",
    top: "24px",
    right: "24px",
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s ease",
  },
  previewModalImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "12px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.4)",
  },
};

// Add CSS animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .media-card:hover .image-overlay {
    opacity: 1 !important;
  }
  
  .media-card:hover img {
    transform: scale(1.05);
  }
  
  .upload-placeholder:hover {
    border-color: #2563eb !important;
    background-color: #eff6ff !important;
  }
  
  input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

if (!document.head.querySelector('style[data-media-gallery]')) {
  styleSheet.setAttribute('data-media-gallery', 'true');
  document.head.appendChild(styleSheet);
}

// Add hover classes
const CardWrapper = ({ children, ...props }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div
      {...props}
      className="media-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...props.style,
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 12px 24px rgba(0,0,0,0.12)'
          : '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {children}
    </div>
  );
};

export default Media;