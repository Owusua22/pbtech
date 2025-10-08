import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages } from "../Redux/Slice/imageSlice";
import { Eye, X, ArrowRight, Award, Users, ThumbsUp, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { images, loading } = useSelector((state) => state.images);

  const [previewImage, setPreviewImage] = useState(null);
  const [imageLoadStates, setImageLoadStates] = useState({});

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  const recentImages = images ? [...images].reverse().slice(0, 6) : [];

  const handleViewMore = () => {
    navigate("/projects");
  };

  const handleImageLoad = (id) => {
    setImageLoadStates(prev => ({ ...prev, [id]: true }));
  };


  return (
    <section className="relative bg-gradient-to-b from-white via-blue-50/30 to-white py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl opacity-20 -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">
              Our Work
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-blue-900 mb-4">
            Our Special Projects
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our portfolio of exceptional construction projects that showcase innovation, quality, and dedication
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {recentImages && recentImages.length > 0 ? (
              recentImages.map((img, index) => (
                <div
                  key={img._id || index}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-white"
                  style={{ 
                    height: index === 0 || index === 3 ? '400px' : '300px',
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Loading Skeleton */}
                  {!imageLoadStates[img._id] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                  )}

                  {/* Project Image */}
                  <img
                    src={img.imageUrl}
                    alt={img.name || "Project"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onLoad={() => handleImageLoad(img._id)}
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Hover Eye Icon */}
                  <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div 
                      className="bg-white/20 backdrop-blur-sm p-4 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300 hover:bg-white/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(img);
                      }}
                    >
                      <Eye size={32} className="text-white" />
                    </div>
                  </div>

                  {/* Image Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-12 h-1 bg-orange-500 rounded-full" />
                    </div>
                    <h3 className="text-white text-xl font-bold">
                      {img.name || "Untitled Project"}
                    </h3>
                    <p className="text-white/80 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to view details
                    </p>
                  </div>

                  {/* Corner Number Badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {index + 1}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20">
                <div className="inline-block p-6 bg-gray-50 rounded-2xl">
                  <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No projects available yet</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mb-20">
          <button
            onClick={handleViewMore}
            className="group relative inline-flex items-center gap-3 bg-blue-900 hover:from-blue-800 hover:to-blue-600 text-white font-semibold px-10 py-5 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 overflow-hidden"
          >
            <span className="relative z-10">View More Projects</span>
            <ArrowRight size={20} className="relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        
      </div>

      {/* Enhanced Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex justify-center items-center z-50 cursor-pointer p-4 animate-fadeIn"
        >
          <button
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 z-10"
            onClick={() => setPreviewImage(null)}
          >
            <X size={24} className="text-white" />
          </button>
          
          <div className="relative max-w-6xl w-full">
            <img
              src={previewImage.imageUrl}
              alt={previewImage.name || "Preview"}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            {previewImage.name && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 rounded-b-2xl">
                <h3 className="text-white text-2xl font-bold">
                  {previewImage.name}
                </h3>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ProjectsSection;