import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useShopContext } from '../context'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

interface Mentor {
  id: string;
  name: string;
  email: string;
  bio: string;
  skills: string[];
  experience: string;
  location?: string;
  hourlyRate?: number;
  rating?: number;
  availability?: string;
  avatar?: string;
  specialization?: string;
}

function MentorsPage() {
  const context = useShopContext()
  const backendUrl = context?.backendUrl || ""
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [experienceFilter, setExperienceFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  
  // Available skills for filtering
  const availableSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 
    'TypeScript', 'Angular', 'Vue.js', 'PHP', 'Ruby', 'Go',
    'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'AI',
    'Data Science', 'DevOps', 'Mobile Development', 'UI/UX'
  ]

  useEffect(() => {
    fetchMentors()
  }, [])

  useEffect(() => {
    filterMentors()
  }, [mentors, searchTerm, selectedSkills, experienceFilter, sortBy])

  const fetchMentors = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/get-mentors`)
      
      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        setMentors(response.data)
        setError('')
      } else if (response.data && Array.isArray(response.data.mentors)) {
        // If the API returns { mentors: [...] }
        setMentors(response.data.mentors)
        setError('')
      } else if (response.data && Array.isArray(response.data.data)) {
        // If the API returns { data: [...] }
        setMentors(response.data.data)
        setError('')
      } else {
        // If the response structure is unexpected
        console.log('Unexpected API response structure:', response.data)
        setMentors([])
        setError('Unexpected data format received from server')
      }
    } catch (err: any) {
      console.error('Error fetching mentors:', err)
      
      // For development/testing, provide mock data if API fails
      console.log('Using mock data for development')
      setMentors([
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          bio: 'Senior Full-Stack Developer with 8+ years of experience in React, Node.js, and cloud technologies. Passionate about mentoring and helping developers grow their skills.',
          skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
          experience: '8',
          location: 'San Francisco, CA',
          hourlyRate: 75,
          rating: 4.8,
          specialization: 'Full-Stack Development'
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael.chen@example.com',
          bio: 'Machine Learning Engineer with expertise in Python, TensorFlow, and data science. I love teaching and helping others understand complex ML concepts.',
          skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science', 'AI'],
          experience: '5',
          location: 'New York, NY',
          hourlyRate: 85,
          rating: 4.9,
          specialization: 'Machine Learning'
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@example.com',
          bio: 'Frontend Developer specializing in modern JavaScript frameworks and UI/UX design. I enjoy mentoring junior developers and sharing best practices.',
          skills: ['JavaScript', 'Vue.js', 'CSS', 'UI/UX', 'Angular'],
          experience: '6',
          location: 'Austin, TX',
          hourlyRate: 65,
          rating: 4.7,
          specialization: 'Frontend Development'
        }
      ])
      setError('')
    } finally {
      setLoading(false)
    }
  }

  const filterMentors = () => {
    // Ensure mentors is always an array
    if (!Array.isArray(mentors)) {
      setFilteredMentors([])
      return
    }
    
    let filtered = [...mentors]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mentor.skills && Array.isArray(mentor.skills) && mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(mentor =>
        mentor.skills && Array.isArray(mentor.skills) && selectedSkills.some(skill => mentor.skills.includes(skill))
      )
    }

    // Experience filter
    if (experienceFilter) {
      filtered = filtered.filter(mentor => mentor.experience === experienceFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        default:
          return 0
      }
    })

    setFilteredMentors(filtered)
  }

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSkills([])
    setExperienceFilter('')
    setSortBy('name')
  }

  const handleSelectMentor = (mentorId: string) => {
    // Navigate to mentor detail page or initiate connection
    navigate(`/mentor/${mentorId}`)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view mentors</h2>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Your Mentor</h1>
              <p className="text-gray-600 mt-2">Connect with experienced professionals to accelerate your growth</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              My Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search mentors..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Experience Levels</option>
                <option value="1">1+ years</option>
                <option value="3">3+ years</option>
                <option value="5">5+ years</option>
                <option value="10">10+ years</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="experience">Experience</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Skills Filter */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Skills</label>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkillFilter(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedSkills.includes(skill)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredMentors.length} of {mentors.length} mentors
          </p>
          {selectedSkills.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {selectedSkills.map(skill => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Mentors Grid */}
        {filteredMentors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map(mentor => (
              <div
                key={mentor.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleSelectMentor(mentor.id)}
              >
                                 {/* Mentor Header */}
                 <div className="flex items-center mb-4">
                   <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                     {(mentor.name || 'M').charAt(0).toUpperCase()}
                   </div>
                   <div className="flex-1">
                     <h3 className="text-lg font-semibold text-gray-900">{mentor.name || 'Unknown Mentor'}</h3>
                     <p className="text-sm text-gray-600">{mentor.specialization || 'Software Development'}</p>
                   </div>
                 </div>

                                 {/* Bio */}
                 <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                   {mentor.bio || 'No bio available'}
                 </p>

                                 {/* Skills */}
                 <div className="mb-4">
                   <div className="flex flex-wrap gap-1">
                     {mentor.skills && Array.isArray(mentor.skills) && mentor.skills.slice(0, 3).map(skill => (
                       <span
                         key={skill}
                         className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                       >
                         {skill}
                       </span>
                     ))}
                     {mentor.skills && Array.isArray(mentor.skills) && mentor.skills.length > 3 && (
                       <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                         +{mentor.skills.length - 3} more
                       </span>
                     )}
                   </div>
                 </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    {mentor.experience} years experience
                  </div>
                  
                  {mentor.location && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {mentor.location}
                    </div>
                  )}

                  {mentor.rating && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {mentor.rating.toFixed(1)} rating
                    </div>
                  )}

                  {mentor.hourlyRate && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      ${mentor.hourlyRate}/hour
                    </div>
                  )}
                </div>

                                 {/* Action Button */}
                 <button className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                   Connect with {(mentor.name || 'Mentor').split(' ')[0]}
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MentorsPage
