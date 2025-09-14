import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const UpgradeModal = ({ user, onUpgrade, onCancel }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      await onUpgrade();
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
      className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header with Gradient Background */}
        <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-yellow-500 dark:via-orange-600 dark:to-red-600 p-6 sm:p-8 text-white">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 sm:w-24 h-16 sm:h-24 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-4 sm:-mb-6 -ml-4 sm:-ml-6 w-20 sm:w-32 h-20 sm:h-32 bg-white bg-opacity-5 rounded-full"></div>
          
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-full z-10"
            disabled={loading}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Icon and Title */}
          <div className="relative text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm mb-3 sm:mb-4 shadow-lg">
              <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
              Upgrade to Pro
            </h3>
            <p className="text-white text-opacity-90 text-sm">
              Unlock unlimited potential for your notes
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Alert Message */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  Note Limit Reached
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  You've reached the 3-note limit on your FREE plan. Upgrade to Pro for unlimited notes and advanced features!
                </p>
              </div>
            </div>
          </div>

          {/* Plan Comparison Cards - Better Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* FREE Plan */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-5 border-2 border-gray-200 dark:border-gray-600 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500">
              <div className="text-center mb-4">
                <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">FREE</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Current Plan</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  3 notes maximum
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic features
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Community support
                </li>
              </ul>
            </div>

            {/* PRO Plan */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 sm:p-5 border-2 border-green-300 dark:border-green-600 relative overflow-hidden transition-all duration-200 hover:border-green-400 dark:hover:border-green-500 hover:shadow-lg">
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              
              <div className="text-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-bold text-green-800 dark:text-green-200 text-lg">PRO</h4>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Recommended</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-green-700 dark:text-green-300">
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited notes
                </li>
                <li className="flex items-center text-green-700 dark:text-green-300">
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced features
                </li>
                <li className="flex items-center text-green-700 dark:text-green-300">
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center text-green-700 dark:text-green-300">
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Export & backup
                </li>
                <li className="flex items-center text-green-700 dark:text-green-300">
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Collaboration tools
                </li>
              </ul>
            </div>
          </div>

          {/* Current User Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {user?.tenant?.name?.charAt(0)?.toUpperCase() || 'T'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-blue-800 dark:text-blue-200 truncate">{user?.tenant?.name}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-30 order-2 sm:order-1"
              disabled={loading}
            >
              Maybe Later
            </button>
            
            {user?.role === 'ADMIN' ? (
              <button
                onClick={handleUpgrade}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                disabled={loading}
              >
                <div className="flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Upgrading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Upgrade Now</span>
                    </>
                  )}
                </div>
              </button>
            ) : (
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-3 text-center order-1 sm:order-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  🔒 Admin Access Required
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Contact your admin to upgrade
                </p>
              </div>
            )}
          </div>

          {/* Footer Note */}
          {user?.role !== 'ADMIN' && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 leading-relaxed">
                💡 Only workspace administrators can upgrade plans. 
                Contact your <strong>{user?.tenant?.name}</strong> workspace admin for upgrade access.
              </p>
            </div>
          )}

          {/* Additional Benefits */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                ✨ What you'll get with Pro:
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
                  ∞ Unlimited Notes
                </span>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                  🚀 Advanced Search
                </span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full">
                  👥 Team Collaboration
                </span>
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full">
                  📊 Analytics Dashboard
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
