import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiPhone,
  FiCalendar,
  FiSave,
  FiMapPin,
  FiFileText,
  FiMail
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function EditProfile() {
  const { user, profile, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: profile?.name || user?.displayName || '',
    city: profile?.city || '',
    gender: profile?.gender || '',
    dob: profile?.dob || '',
    bio: profile?.bio || ''
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="profilePage profilePage--empty">
        <p>You need to login first.</p>
      </div>
    );
  }

  const update = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await updateUserProfile(form);
      navigate('/profile');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editProfilePage">
      <div className="editProfileContainer">

        <div className="editHeader">
          <h1>Edit Profile</h1>
          <p>Manage your CivicPlay account information</p>
        </div>

        <form className="editGrid" onSubmit={submit}>

          <div className="editBox">
            <h2>Personal Information</h2>

            <div className="inputGroup">
              <label><FiUser /> Full Name</label>
              <input
                value={form.name}
                onChange={update('name')}
                placeholder="Enter your name"
              />
            </div>
            <div className="inputGroup">
              <label><FiUser /> Username</label>
              <input
                value={form.username}
                onChange={update('username')}
                placeholder="Enter your username"
              />
            </div>

            <div className="inputGroup">
              <label><FiMapPin /> City</label>
              <input
                value={form.city}
                onChange={update('city')}
                placeholder="Enter city"
              />
            </div>

            <div className="inputGroup">
              <label>Gender</label>
              <select value={form.gender} onChange={update('gender')}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            {/* <div className="inputGroup">
              <label><FiCalendar /> Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={update('dob')}
              />
            </div> */}
          </div>

          <div className="editBox">
            <h2>Account Information</h2>

            <div className="inputGroup">
              <label><FiMail /> Email</label>
              <input value={user.email} disabled />
              <span>Email cannot be changed</span>
            </div>

            <div className="inputGroup">
              <label><FiPhone /> Mobile Number</label>
              <input value={profile?.mobile || ''} disabled />
              <span>Mobile number cannot be changed</span>
            </div>

            <div className="inputGroup">
              <label><FiFileText /> About You</label>
              <textarea
                value={form.bio}
                onChange={update('bio')}
                placeholder="Write something about yourself"
              />
            </div>

            {error && <p className="editError">{error}</p>}

            <button className="saveBtn" disabled={saving}>
              <FiSave />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}