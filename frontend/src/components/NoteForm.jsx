import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const NoteForm = ({ note, onSubmit, onCancel }) => {
  const { isDarkMode } = useTheme();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(note);

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length > 5000) {
      newErrors.content = 'Content must be less than 5000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        content: content.trim()
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-t-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {isEditing ? 'Edit Note' : 'Create New Note'}
              </h2>
              <p className="text-blue-100 dark:text-blue-200 text-sm">
                {isEditing ? 'Update your note content' : 'Add a new note to your collection'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
              disabled={loading}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex-1 p-8 space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="title" className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
                  </svg>
                  Note Title
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 dark:text-white ${
                      errors.title 
                        ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                    }`}
                    placeholder="Enter a compelling title for your note..."
                    maxLength={100}
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className={`text-xs font-medium ${
                      title.length > 80 ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {title.length}/100
                    </span>
                  </div>
                </div>
                {errors.title && (
                  <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.title}
                  </div>
                )}
              </div>

              {/* Content Field */}
              <div className="space-y-2">
                <label htmlFor="content" className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Note Content
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`w-full h-48 px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 rounded-xl resize-none transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-20 dark:text-white leading-relaxed ${
                      errors.content 
                        ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400'
                    }`}
                    placeholder="Write your note content here... Be creative and detailed!"
                    maxLength={5000}
                    disabled={loading}
                  />
                  <div className="absolute bottom-3 right-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      content.length > 4500 
                        ? 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30' 
                        : 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-600'
                    }`}>
                      {content.length}/5000
                    </span>
                  </div>
                </div>
                {errors.content && (
                  <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.content}
                  </div>
                )}
              </div>
            </div>

            {/* FIXED FOOTER WITH CLEAR BUTTONS */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-b-2xl p-6 border-t-2 border-gray-200 dark:border-gray-600">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Info Text */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {isEditing ? 'Changes will be saved immediately' : 'Note will be added to your collection'}
                </div>

                {/* Action Buttons - CLEARLY VISIBLE */}
                <div className="flex space-x-4">
                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 hover:border-gray-400 dark:hover:border-gray-400 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-30 shadow-md hover:shadow-lg"
                    disabled={loading}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Cancel</span>
                    </div>
                  </button>

                  {/* Save/Update Button */}
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    <div className="flex items-center space-x-2">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditing ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                          </svg>
                          <span>{isEditing ? 'Update Note' : 'Create Note'}</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
