import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { notesAPI, tenantsAPI } from '../services/api';
import NotesList from './NotesList';
import NoteForm from './NoteForm';
import UpgradeModal from './UpgradeModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { success, error: showError, warning, info } = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getAll();
      setNotes(response.data);
      setError('');
    } catch (error) {
      const errorMsg = 'Failed to load notes';
      setError(errorMsg);
      showError(errorMsg + '. Please refresh the page or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const response = await notesAPI.create(noteData);
      setNotes([response.data, ...notes]);
      setShowForm(false);
      setError('');
      success('📝 Note created successfully!');
    } catch (error) {
      if (error.response?.data?.code === 'NOTE_LIMIT_REACHED') {
        setShowUpgradeModal(true);
        warning('⚠️ You have reached your note limit. Upgrade to Pro for unlimited notes!');
      } else {
        const errorMsg = error.response?.data?.error || 'Failed to create note';
        setError(errorMsg);
        showError('❌ ' + errorMsg);
      }
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const response = await notesAPI.update(id, noteData);
      setNotes(notes.map(note => note._id === id ? response.data : note));
      setEditingNote(null);
      setError('');
      success('✏️ Note updated successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to update note';
      setError(errorMsg);
      showError('❌ ' + errorMsg);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await notesAPI.delete(id);
      setNotes(notes.filter(note => note._id !== id));
      setError('');
      // Success toast is shown in NotesList component
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to delete note';
      setError(errorMsg);
      showError('❌ ' + errorMsg);
    }
  };

  const handleUpgrade = async () => {
    try {
      await tenantsAPI.upgrade(user.tenant.slug);
      setShowUpgradeModal(false);
      setError('');
      success('🎉 Successfully upgraded to Pro! You can now create unlimited notes.');
      // Reload notes to refresh any limits
      setTimeout(() => {
        loadNotes();
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to upgrade';
      setError(errorMsg);
      showError('❌ Failed to upgrade: ' + errorMsg);
    }
  };

  const handleLogout = () => {
    info('👋 Logging out... See you soon!');
    setTimeout(() => {
      logout();
    }, 1000);
  };

  const handleNewNoteClick = () => {
    if (user?.tenant?.plan === 'FREE' && notes.length >= 3) {
      warning('⚠️ You have reached the maximum number of notes for the FREE plan!');
      setTimeout(() => {
        setShowUpgradeModal(true);
      }, 1500);
      return;
    }
    setShowForm(true);
  };

  const getTenantColor = (tenantName) => {
    return tenantName === 'Acme' 
      ? 'bg-blue-500 dark:bg-blue-600 text-white' 
      : 'bg-purple-500 dark:bg-purple-600 text-white';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple Header with Dark Mode */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  SaaS Notes
                </h1>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTenantColor(user?.tenant?.name)}`}>
                  {user?.tenant?.name}
                </span>
              </div>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role} • {user?.tenant?.plan} Plan
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Error Message - Keep for fallback */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <svg className="flex-shrink-0 h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                <button 
                  onClick={() => setError('')}
                  className="mt-2 text-xs text-red-600 dark:text-red-300 hover:text-red-500 dark:hover:text-red-200 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats & Action Bar */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your Notes
          </h2>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <span>{notes.length} notes total</span>
            {user?.tenant?.plan === 'FREE' && (
              <>
                <span>•</span>
                <span>{notes.length}/3 notes used</span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      notes.length >= 3 ? 'bg-red-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min((notes.length / 3) * 100, 100)}%` }}
                  ></div>
                </div>
                {notes.length >= 3 && (
                  <span className="text-red-500 dark:text-red-400 font-medium">
                    Limit reached!
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={handleNewNoteClick}
            className={`inline-flex items-center px-6 py-3 font-medium rounded-lg transition-colors ${
              user?.tenant?.plan === 'FREE' && notes.length >= 3
                ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {user?.tenant?.plan === 'FREE' && notes.length >= 3 ? 'Limit Reached' : 'New Note'}
          </button>

          {user?.tenant?.plan === 'FREE' && user?.role === 'ADMIN' && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Upgrade to Pro
            </button>
          )}
        </div>

        {/* Notes Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading notes...</p>
            </div>
          </div>
        ) : (
          <NotesList 
            notes={notes}
            onEdit={setEditingNote}
            onDelete={handleDeleteNote}
          />
        )}

        {/* Modals */}
        {showForm && (
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setShowForm(false)}
          />
        )}

        {editingNote && (
          <NoteForm
            note={editingNote}
            onSubmit={(data) => handleUpdateNote(editingNote._id, data)}
            onCancel={() => setEditingNote(null)}
          />
        )}

        {showUpgradeModal && (
          <UpgradeModal
            user={user}
            onUpgrade={handleUpgrade}
            onCancel={() => setShowUpgradeModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
