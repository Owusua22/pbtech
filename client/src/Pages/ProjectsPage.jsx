import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages } from "../Redux/Slice/imageSlice";
import { Image, Spin, Modal, Empty } from "antd";
import { EyeOutlined, CloseOutlined } from "@ant-design/icons";

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { images, loading, error } = useSelector((state) => state.images);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  const handleImageLoad = (id) => {
    setImageLoading(prev => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id) => {
    setImageLoading(prev => ({ ...prev, [id]: false }));
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Spin size="large" />
        <p className="mt-4 text-gray-600 animate-pulse">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Failed to load projects</p>
          <button 
            onClick={() => dispatch(fetchImages())}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-block mb-4">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
            Portfolio
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 mb-6">
          Our Recent Projects
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Explore our portfolio of completed and ongoing construction projects that showcase our commitment to excellence, innovation, and quality craftsmanship.
        </p>
      </div>

      {/* Gallery Grid */}
      {images?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {images.map((img, index) => (
              <div
                key={img._id}
                className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white transform hover:-translate-y-2"
                onClick={() => setSelectedImage(img)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Container */}
                <div className="relative w-full h-72 overflow-hidden bg-gray-200">
                  {imageLoading[img._id] !== false && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Spin />
                    </div>
                  )}
                  <img
                    src={img.imageUrl}
                    alt={img.title || "Project Image"}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    onLoad={() => handleImageLoad(img._id)}
                    onError={() => handleImageError(img._id)}
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white text-xl font-bold mb-2">
                        {img.title || "Project"}
                      </h3>
                      <div className="flex items-center text-white/90 text-sm">
                        <EyeOutlined className="mr-2" />
                        <span>Click to view details</span>
                      </div>
                    </div>
                  </div>

                  {/* Corner Badge */}
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <Empty
            description={
              <span className="text-gray-500 text-lg">
                No projects available at the moment
              </span>
            }
            className="py-20"
          />
        </div>
      )}

      {/* Enhanced Modal */}
      <Modal
        open={!!selectedImage}
        footer={null}
        onCancel={() => setSelectedImage(null)}
        centered
        width="90vw"
        style={{ maxWidth: '1200px' }}
        closeIcon={<CloseOutlined className="text-white text-xl" />}
        className="project-modal"
        styles={{
          body: { padding: 0 },
          content: { background: 'transparent', boxShadow: 'none' }
        }}
      >
        {selectedImage && (
          <div className="relative bg-white rounded-2xl overflow-hidden">
            {/* Image Section */}
            <div className="relative bg-black">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title || "Project"}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
            
            {/* Info Section */}
            {selectedImage.title && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-slate-50">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">
                  {selectedImage.title}
                </h2>
                {selectedImage.description && (
                  <p className="text-gray-600">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      <style jsx>{`
        .project-modal .ant-modal-content {
          background: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </section>
  );
};

export default ProjectsPage;