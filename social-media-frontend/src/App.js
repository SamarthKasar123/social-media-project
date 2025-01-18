import React, { useState, useEffect } from 'react';
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

  // API URL - change this to your deployed backend URL when deploying
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/submissions`);
      setSubmissions(response.data);
    } catch (err) {
      setError('Failed to fetch submissions');
      console.error('Error:', err);
    }
  };

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
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8">Social Media Submission</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Social Handle</label>
                    <input
                      type="text"
                      value={formData.socialHandle}
                      onChange={(e) => setFormData({...formData, socialHandle: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <input
                      type="file"
                      onChange={(e) => setFormData({...formData, images: e.target.files})}
                      className="mt-1 block w-full"
                      multiple
                      accept="image/*"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </button>
                </form>

                {error && <div className="text-red-500 mt-2">{error}</div>}
                {success && <div className="text-green-500 mt-2">{success}</div>}
              </div>

              <div className="pt-6">
                <h3 className="text-xl font-bold mb-4">Submissions</h3>
                <div className="space-y-4">
                  {submissions.map((submission, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <h4 className="font-bold">{submission.name}</h4>
                      <p className="text-gray-600">{submission.social_handle}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {submission.images && submission.images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`Upload ${imgIndex + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
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
    </div>
  );
}

export default App;