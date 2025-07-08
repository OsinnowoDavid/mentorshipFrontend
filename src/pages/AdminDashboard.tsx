import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useShopContext } from '../context';

const sections = [
  { key: 'createMentor', label: 'Create Mentor' },
  { key: 'assignRoles', label: 'Assign Roles' },
  { key: 'bookSessions', label: 'Book Sessions' },
  { key: 'viewMentors', label: 'View All Mentors' },
];

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { backendUrl } = useShopContext() || {};
  const [activeSection, setActiveSection] = useState('createMentor');

  // State for Create Mentor form
  const [mentorForm, setMentorForm] = useState({
    name: '',
    email: '',
    availability: '',
    bio: '',
    topic: '',
    password: '',
    experience: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [mentors, setMentors] = useState<any[]>([]);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [mentorsError, setMentorsError] = useState('');

  React.useEffect(() => {
    if (activeSection === 'viewMentors') {
      setMentorsLoading(true);
      setMentorsError('');
      axios.get(`${backendUrl}/api/get-mentors`)
        .then(res => {
          setMentors(res.data.mentors || res.data || []);
        })
        .catch(err => {
          setMentorsError(err.response?.data?.message || 'Failed to fetch mentors.');
        })
        .finally(() => setMentorsLoading(false));
    }
  }, [activeSection, backendUrl]);

  const handleMentorInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setMentorForm({ ...mentorForm, [e.target.name]: e.target.value });
  };

  const handleCreateMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    // Basic validation
    if (!mentorForm.name || !mentorForm.email || !mentorForm.availability || !mentorForm.bio || !mentorForm.topic || !mentorForm.password || !mentorForm.experience) {
      setFormError('All fields are required.');
      return;
    }
    setFormLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/addMentor`, mentorForm);
      if (response.status === 201 || response.status === 200) {
        setFormSuccess('Mentor created successfully!');
        setMentorForm({ name: '', email: '', availability: '', bio: '', topic: '', password: '', experience: '' });
      } else {
        setFormError('Failed to create mentor.');
      }
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Failed to create mentor.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMentor = async (id: string) => {
    
    if (!window.confirm('Are you sure you want to delete this mentor?')) return;
    setMentorsLoading(true);
    setMentorsError('');
    try {
      await axios.delete(`${backendUrl}/api/deleteMentor/${id}`);
      setMentors((prev) => prev.filter((mentor) => mentor.id !== id && mentor._id !== id));
    } catch (err: any) {
      setMentorsError(err.response?.data?.message || 'Failed to delete mentor.');
    } finally {
      setMentorsLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h2>
          <p className="mb-4">You do not have permission to access this page.</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-8">Admin Dashboard</h1>
        <nav className="flex-1 space-y-4">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === section.key ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50 text-gray-700'}`}
            >
              {section.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="mt-8 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {activeSection === 'createMentor' && (
          <section>
            <h2 className="text-xl font-bold mb-6">Create Mentor</h2>
            <div className="bg-white p-8 rounded-xl shadow-md max-w-xl">
              <form onSubmit={handleCreateMentor} className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Name</label>
                  <input type="text" name="name" value={mentorForm.name} onChange={handleMentorInput} className="w-full border px-3 py-2 rounded-lg" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">Email</label>
                  <input type="email" name="email" value={mentorForm.email} onChange={handleMentorInput} className="w-full border px-3 py-2 rounded-lg" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">Availability</label>
                  <select name="availability" value={mentorForm.availability} onChange={handleMentorInput} className="w-full border px-3 py-2 rounded-lg" required>
                    <option value="">Select availability</option>
                    <option value="NOT-AVAILABLE">NOT-AVAILABLE</option>
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Bio</label>
                  <textarea name="bio" value={mentorForm.bio} onChange={handleMentorInput} className="w-full border px-3 py-2 rounded-lg" rows={3} required />
                </div>
                <div>
                  <label className="block font-medium mb-1">Topic</label>
                  <input type="text" name="topic" value={mentorForm.topic} onChange={handleMentorInput} className="w-full border px-3 py-2 rounded-lg" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">Password</label>
                  <input type="password" name="password" value={mentorForm.password} onChange={handleMentorInput} className="w-full border px-3 py-2 rounded-lg" required />
                </div>
                <div>
                  <label className="block font-medium mb-1">Experience</label>
                  <input type="text" name="experience" value={mentorForm.experience} onChange={handleMentorInput} className="w-full border px-3 py-2 rounded-lg" required />
                </div>
                {formError && <div className="text-red-600 bg-red-50 border border-red-200 rounded p-2">{formError}</div>}
                {formSuccess && <div className="text-green-700 bg-green-50 border border-green-200 rounded p-2">{formSuccess}</div>}
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors" disabled={formLoading}>
                  {formLoading ? 'Creating...' : 'Create Mentor'}
                </button>
              </form>
            </div>
          </section>
        )}
        {activeSection === 'assignRoles' && (
          <section>
            <h2 className="text-xl font-bold mb-6">Assign Roles</h2>
            <div className="bg-white p-8 rounded-xl shadow-md">
              {/* TODO: Role assignment UI will go here */}
              <p className="text-gray-500">Role assignment functionality coming soon...</p>
            </div>
          </section>
        )}
        {activeSection === 'bookSessions' && (
          <section>
            <h2 className="text-xl font-bold mb-6">Book Sessions</h2>
            <div className="bg-white p-8 rounded-xl shadow-md">
              {/* TODO: Book session UI will go here */}
              <p className="text-gray-500">Session booking coming soon...</p>
            </div>
          </section>
        )}
        {activeSection === 'viewMentors' && (
          <section>
            <h2 className="text-xl font-bold mb-6">All Mentors</h2>
            <div className="bg-white p-8 rounded-xl shadow-md">
              {mentorsLoading ? (
                <div className="text-blue-600">Loading mentors...</div>
              ) : mentorsError ? (
                <div className="text-red-600">{mentorsError}</div>
              ) : mentors.length === 0 ? (
                <div className="text-gray-500">No mentors found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">Name</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">Availability</th>
                        <th className="px-4 py-2 border">Topic</th>
                        <th className="px-4 py-2 border">Experience</th>
                        <th className="px-4 py-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mentors.map((mentor, idx) => (
                        <tr key={mentor.id || mentor._id || idx} className="hover:bg-blue-50">
                          <td className="px-4 py-2 border">{mentor.name}</td>
                          <td className="px-4 py-2 border">{mentor.email}</td>
                          <td className="px-4 py-2 border">{mentor.availability}</td>
                          <td className="px-4 py-2 border">{mentor.topic}</td>
                          <td className="px-4 py-2 border">{mentor.experience}</td>
                          <td className="px-4 py-2 border text-center">
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-red-300 transition-colors"
                              onClick={() => handleDeleteMentor(mentor.id || mentor._id)}
                              disabled={mentorsLoading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
