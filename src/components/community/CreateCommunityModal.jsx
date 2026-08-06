import { useState } from 'react';
import { FiX, FiImage, FiLoader } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { createCommunity } from '../../services/communityService';
import { uploadToCloudinary } from '../../utils/cloudinary';
import './CreateCommunityModal.css';


const CATEGORIES = ['Environment', 'Cleanliness', 'Water', 'Road Safety', 'Waste Management', 'Public Spaces', 'Other'];

export default function CreateCommunityModal({ onClose, onCreated }) {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ name: '', description: '', category: CATEGORIES[0], location: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleImagePick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;
    if (!form.name.trim()) {
      setError('Community name is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      let imageUrl = '';
      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

      const community = await createCommunity({
        ...form,
        image: imageUrl,
        createdBy: user.uid,
        createdByUsername: profile?.username || profile?.name || 'User',
      });
      onCreated(community);
    } catch (err) {
      setError(err.message || 'Failed to create community');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ccModal__overlay" onClick={onClose}>
      <div className="ccModal glass" onClick={(e) => e.stopPropagation()}>
        <div className="ccModal__header">
          <h2>Create Community</h2>
          <button className="ccModal__close" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="ccModal__form">
          <label className="ccModal__imageUpload">
            {imagePreview ? <img src={imagePreview} alt="preview" /> : <FiImage size={26} />}
            <input type="file" accept="image/*" onChange={handleImagePick} hidden />
            <span>{imagePreview ? 'Change image' : 'Upload community image'}</span>
          </label>

          <div className="ccModal__field">
            <label>Community name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ahmedabad Clean Drive" required />
          </div>

          <div className="ccModal__field">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="What is this community about?" />
          </div>

          <div className="ccModal__row">
            <div className="ccModal__field">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="ccModal__field">
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Ahmedabad, Gujarat" />
            </div>
          </div>

          {error && <p className="ccModal__error">{error}</p>}

          <button type="submit" className="ccModal__submit" disabled={submitting}>
            {submitting ? <><FiLoader className="spin" /> Creating…</> : 'Create Community'}
          </button>
        </form>
      </div>
    </div>
  );
}
