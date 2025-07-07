import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

interface FormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  
  // Professional Information
  currentRole: string
  company: string
  yearsOfExperience: string
  industry: string
  specialization: string
  
  // Skills & Expertise
  skills: string[]
  certifications: string[]
  languages: string[]
  
  // Mentorship Details
  mentorshipAreas: string[]
  availability: string
  hourlyRate: string
  maxMentees: string
  
  // Bio & Motivation
  bio: string
  motivation: string
  successStories: string
  
  // Terms & Conditions
  agreeToTerms: boolean
  agreeToPrivacy: boolean
  agreeToCodeOfConduct: boolean
}

interface Errors {
  [key: string]: string
}

function BecomeMentor() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    
    // Professional Information
    currentRole: '',
    company: '',
    yearsOfExperience: '',
    industry: '',
    specialization: '',
    
    // Skills & Expertise
    skills: [],
    certifications: [],
    languages: [],
    
    // Mentorship Details
    mentorshipAreas: [],
    availability: '',
    hourlyRate: '',
    maxMentees: '',
    
    // Bio & Motivation
    bio: '',
    motivation: '',
    successStories: '',
    
    // Terms & Conditions
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToCodeOfConduct: false
  })

  const [errors, setErrors] = useState<Errors>({})

  // Available options
  const industries = [
    'Software Development', 'Data Science', 'Machine Learning', 'Web Development',
    'Mobile Development', 'DevOps', 'Cloud Computing', 'Cybersecurity',
    'Product Management', 'UI/UX Design', 'Digital Marketing', 'Business',
    'Finance', 'Healthcare', 'Education', 'Other'
  ]

  const skillOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'TypeScript',
    'Angular', 'Vue.js', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins',
    'Git', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Tableau',
    'Power BI', 'Figma', 'Adobe XD', 'Sketch', 'Agile', 'Scrum', 'Kanban'
  ]

  const mentorshipAreas = [
    'Career Guidance', 'Technical Skills', 'Interview Preparation', 'Project Management',
    'Leadership Development', 'Communication Skills', 'Problem Solving', 'Code Review',
    'System Design', 'Architecture', 'Testing', 'Performance Optimization',
    'Security Best Practices', 'DevOps Practices', 'Cloud Migration', 'Startup Advice'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleArrayChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {}

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
        if (!formData.location.trim()) newErrors.location = 'Location is required'
        break

      case 2:
        if (!formData.currentRole.trim()) newErrors.currentRole = 'Current role is required'
        if (!formData.company.trim()) newErrors.company = 'Company is required'
        if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required'
        if (!formData.industry) newErrors.industry = 'Industry is required'
        if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required'
        break

      case 3:
        if (formData.skills.length === 0) newErrors.skills = 'Please select at least one skill'
        if (formData.mentorshipAreas.length === 0) newErrors.mentorshipAreas = 'Please select at least one mentorship area'
        break

      case 4:
        if (!formData.bio.trim()) newErrors.bio = 'Bio is required'
        if (!formData.motivation.trim()) newErrors.motivation = 'Motivation is required'
        if (!formData.availability) newErrors.availability = 'Availability is required'
        if (!formData.hourlyRate) newErrors.hourlyRate = 'Hourly rate is required'
        break

      case 5:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions'
        if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'You must agree to the privacy policy'
        if (!formData.agreeToCodeOfConduct) newErrors.agreeToCodeOfConduct = 'You must agree to the code of conduct'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(currentStep)) {
      try {
        // Here you would submit the form data to your backend
        console.log('Form submitted:', formData)
        alert('Application submitted successfully! We will review your application and get back to you within 3-5 business days.')
        navigate('/profile')
      } catch (error) {
        console.error('Error submitting application:', error)
        alert('There was an error submitting your application. Please try again.')
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to become a mentor</h2>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Become a Mentor</h1>
              <p className="text-gray-600 mt-2">Share your expertise and help others grow</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {currentStep} of 5: {
              currentStep === 1 ? 'Personal Information' :
              currentStep === 2 ? 'Professional Background' :
              currentStep === 3 ? 'Skills & Expertise' :
              currentStep === 4 ? 'Mentorship Details' :
              'Terms & Conditions'
            }
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Background */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Background</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Role *</label>
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.currentRole ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Senior Software Engineer"
                  />
                  {errors.currentRole && <p className="text-red-500 text-sm mt-1">{errors.currentRole}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.company ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                  <select
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select experience level</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-15">11-15 years</option>
                    <option value="15+">15+ years</option>
                  </select>
                  {errors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.industry ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.specialization ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Full-stack development, Machine Learning, DevOps"
                  />
                  {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Skills & Expertise */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Expertise</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4">
                  {skillOptions.map(skill => (
                    <label key={skill} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleArrayChange('skills', skill)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
                {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mentorship Areas *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4">
                  {mentorshipAreas.map(area => (
                    <label key={area} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.mentorshipAreas.includes(area)}
                        onChange={() => handleArrayChange('mentorshipAreas', area)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
                {errors.mentorshipAreas && <p className="text-red-500 text-sm mt-1">{errors.mentorshipAreas}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certifications (Optional)</label>
                <textarea
                  name="certifications"
                  value={formData.certifications.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    certifications: e.target.value.split(',').map(cert => cert.trim()).filter(cert => cert)
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="e.g., AWS Certified Solutions Architect, Google Cloud Professional, etc."
                />
              </div>
            </div>
          )}

          {/* Step 4: Mentorship Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mentorship Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.availability ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select availability</option>
                    <option value="1-5">1-5 hours/week</option>
                    <option value="5-10">5-10 hours/week</option>
                    <option value="10-15">10-15 hours/week</option>
                    <option value="15+">15+ hours/week</option>
                  </select>
                  {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (USD) *</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.hourlyRate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 50"
                    min="0"
                  />
                  {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Mentees</label>
                  <select
                    name="maxMentees"
                    value={formData.maxMentees}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select maximum mentees</option>
                    <option value="1-2">1-2 mentees</option>
                    <option value="3-5">3-5 mentees</option>
                    <option value="6-10">6-10 mentees</option>
                    <option value="10+">10+ mentees</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.bio ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={4}
                  placeholder="Tell us about your background, experience, and what makes you a great mentor..."
                />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to become a mentor? *</label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.motivation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={4}
                  placeholder="Share your motivation for becoming a mentor and how you plan to help others..."
                />
                {errors.motivation && <p className="text-red-500 text-sm mt-1">{errors.motivation}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Success Stories (Optional)</label>
                <textarea
                  name="successStories"
                  value={formData.successStories}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Share any success stories from your career or previous mentoring experiences..."
                />
              </div>
            </div>
          )}

          {/* Step 5: Terms & Conditions */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms & Conditions</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mentor Requirements</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Minimum 2 years of professional experience in your field</li>
                    <li>Strong communication and teaching skills</li>
                    <li>Commitment to helping others grow and succeed</li>
                    <li>Availability for regular mentoring sessions</li>
                    <li>Professional conduct and ethical behavior</li>
                    <li>Up-to-date knowledge in your area of expertise</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Code of Conduct</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Treat all mentees with respect and professionalism</li>
                    <li>Maintain confidentiality of mentee information</li>
                    <li>Provide honest, constructive feedback</li>
                    <li>Respect mentee boundaries and time commitments</li>
                    <li>Report any inappropriate behavior or concerns</li>
                    <li>Follow platform guidelines and policies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Policies</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Platform takes a 15% commission on all paid sessions</li>
                    <li>Payment processing fees may apply</li>
                    <li>Mentors are responsible for their own tax obligations</li>
                    <li>Platform reserves the right to review and approve mentor applications</li>
                    <li>Mentors can be removed for violations of platform policies</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">I agree to the Terms and Conditions *</span>
                    {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToPrivacy"
                    checked={formData.agreeToPrivacy}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">I agree to the Privacy Policy *</span>
                    {errors.agreeToPrivacy && <p className="text-red-500 text-sm mt-1">{errors.agreeToPrivacy}</p>}
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToCodeOfConduct"
                    checked={formData.agreeToCodeOfConduct}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">I agree to follow the Code of Conduct *</span>
                    {errors.agreeToCodeOfConduct && <p className="text-red-500 text-sm mt-1">{errors.agreeToCodeOfConduct}</p>}
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default BecomeMentor 