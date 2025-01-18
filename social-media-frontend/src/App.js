import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    socialHandle: '',
    images: []
  });
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const fetchSubmissions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/submissions`);
      setSubmissions(response.data);
    } catch (err) {
      setError('Failed to fetch submissions');
      console.error('Error:', err);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('socialHandle', formData.socialHandle);
    
    Array.from(formData.images).forEach(image => {
      submitData.append('images', image);
    });

    try {
      await axios.post(`${API_URL}/api/submit`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess('Submission successful!');
      setFormData({ name: '', socialHandle: '', images: [] });
      fetchSubmissions();
    } catch (err) {
      setError('Submission failed. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Submission Form */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-4 bg-primary-600">
              <h2 className="text-xl font-bold text-white">Submit Your Social Media Profile</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Social Handle</label>
                <input
                  type="text"
                  value={formData.socialHandle}
                  onChange={(e) => setFormData({...formData, socialHandle: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
                <input
                  type="file"
                  onChange={(e) => setFormData({...formData, images: e.target.files})}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  multiple
                  accept="image/*"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-200"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                  {success}
                </div>
              )}
            </form>
          </div>

          {/* Submissions List */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-primary-600">
              <h3 className="text-xl font-bold text-white">Recent Submissions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {submissions.map((submission, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{submission.name}</h4>
                        <p className="text-primary-600">{submission.social_handle}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {submission.images && submission.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="aspect-w-1 aspect-h-1">
                          <img
                            src={image}
                            alt={`Upload ${imgIndex + 1}`}
                            className="object-cover rounded-lg shadow-sm hover:opacity-75 transition-opacity duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;