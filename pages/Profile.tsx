
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateUser } from '../features/user/userSlice';
import { logout } from '../features/auth/authSlice';
import { Modal } from '../components/Modal';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile, status } = useAppSelector((state) => state.user);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    location: '',
    bio: '',
    avatar: ''
  });

  // UI States
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync local state with Redux state when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        avatar: profile.avatar || ''
      });
    }
  }, [profile]);

  // Auto-hide success message
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    return errors;
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await dispatch(updateUser(formData)).unwrap();
      setSuccessMsg('Profile updated successfully');
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handleReset = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        avatar: profile.avatar || ''
      });
      setValidationErrors({});
    }
  };

  const handleShare = () => {
      const shareText = `Contact ${formData.name} (${formData.role}) at ${formData.email}`;
      navigator.clipboard.writeText(shareText).then(() => {
          setSuccessMsg('Profile details copied to clipboard!');
      });
  };

  const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
  };

  if (status === 'loading' && !profile) {
     return <div className="p-8 flex justify-center"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>;
  }

  return (
    <div className="p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto relative">
      
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-24 right-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
           <span className="material-symbols-outlined text-green-400 dark:text-green-600">check_circle</span>
           <span className="font-medium text-sm">{successMsg}</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and update your personal information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm overflow-hidden p-6 flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <div 
                className="w-32 h-32 rounded-full bg-cover bg-center border-4 border-white dark:border-gray-700 shadow-md cursor-pointer transition-transform group-hover:scale-105"
                style={{ backgroundImage: `url(${formData.avatar || 'https://via.placeholder.com/150'})` }}
                onClick={handleAvatarClick}
              ></div>
              <div 
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleAvatarClick}
              >
                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formData.name || 'Your Name'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{formData.role || 'Role / Title'}</p>
            
            <div className="mt-6 w-full flex gap-3 relative">
               <button 
                 onClick={handleShare}
                 className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600 transition-colors shadow-sm flex items-center justify-center gap-2"
               >
                 <span className="material-symbols-outlined text-lg">ios_share</span>
                 Share
               </button>
               
               <button 
                 onClick={() => setIsSettingsModalOpen(true)}
                 className="px-3 py-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                 title="Settings"
               >
                 <span className="material-symbols-outlined">settings</span>
               </button>
            </div>
          </div>

          <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm overflow-hidden p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={formData.email}>{formData.email || 'Not set'}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.phone || 'Not set'}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.location || 'Not set'}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm overflow-hidden h-full flex flex-col">
             <div className="px-6 py-4 border-b border-gray-200 dark:border-border-dark">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
             </div>
             
             <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Eleanor Pena"
                        className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-background-dark border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-colors ${
                          validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                        }`}
                      />
                      {validationErrors.name && <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>}
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role / Title</label>
                      <input 
                        type="text" 
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        placeholder="e.g. Global Manager"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. eleanor@example.com"
                        className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-background-dark border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-colors ${
                          validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                        }`}
                      />
                      {validationErrors.email && <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>}
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                      />
                   </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between">
                       <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    </div>
                    <input 
                        type="text" 
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. New York, USA"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                    />
                </div>

                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                   <textarea 
                     name="bio"
                     rows={4}
                     value={formData.bio}
                     onChange={handleInputChange}
                     placeholder="Tell us a little about yourself..."
                     className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white resize-none"
                   ></textarea>
                   <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                       {formData.bio.length} / 300 characters
                   </p>
                </div>

                <div className="pt-6 mt-auto flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                   <button 
                     type="button" 
                     onClick={handleReset}
                     disabled={status === 'loading'}
                     className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit" 
                     disabled={status === 'loading'}
                     className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600 shadow-sm shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                     {status === 'loading' ? (
                        <>
                           <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                           Saving...
                        </>
                     ) : (
                        'Save Changes'
                     )}
                   </button>
                </div>
             </form>
          </div>
        </div>

        {/* Profile Settings Modal */}
        <Modal 
          isOpen={isSettingsModalOpen} 
          onClose={() => setIsSettingsModalOpen(false)} 
          title="Account Settings"
          size="sm"
        >
          <div className="p-4">
            <div className="space-y-2">
              <button 
                onClick={() => { navigate('/settings'); setIsSettingsModalOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl flex items-center gap-3 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <span className="material-symbols-outlined text-lg">lock_reset</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Change Password</h4>
                  <p className="text-xs text-gray-500">Update your security credentials</p>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
              </button>
              
              <button 
                onClick={() => { navigate('/settings'); setIsSettingsModalOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl flex items-center gap-3 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                  <span className="material-symbols-outlined text-lg">notifications</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Notifications</h4>
                  <p className="text-xs text-gray-500">Manage email and push alerts</p>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
              </button>
              
              <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl flex items-center gap-3 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
              >
                <div className="p-2 bg-white dark:bg-red-900/20 rounded-lg">
                  <span className="material-symbols-outlined text-lg">logout</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">Log Out</h4>
                  <p className="text-xs opacity-80">Sign out of your account</p>
                </div>
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
};
