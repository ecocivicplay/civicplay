import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiUsers, FiSend, FiImage, FiUserPlus, FiSettings, FiLogOut, FiArrowLeft, FiX, FiLoader } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCommunityMessages } from '../hooks/useCommunityMessages';
import { getCommunity, getMembership, removeMember } from '../services/communityService';
import { uploadToCloudinary } from '../utils/cloudinary';
import InviteMembersModal from '../components/community/InviteMembersModal';
import AdminPanel from '../components/community/AdminPanel';
import './CommunityChat.css';

export default function CommunityChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { messages, loading: messagesLoading, sendMessage } = useCommunityMessages(id);

  const [community, setCommunity] = useState(null);
  const [membership, setMembership] = useState(undefined); // undefined = checking, null = not a member
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [sending, setSending] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoadingCommunity(true);
    getCommunity(id)
      .then((c) => active && setCommunity(c))
      .catch(() => active && setCommunity(null))
      .finally(() => active && setLoadingCommunity(false));
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (!user) {
      setMembership(null);
      return;
    }
    let active = true;
    getMembership(id, user.uid)
      .then((m) => active && setMembership(m))
      .catch(() => active && setMembership(null));
    return () => { active = false; };
  }, [id, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleImagePick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;
    setSending(true);
    try {
      let imageUrl = '';
      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);
      await sendMessage({
        communityId: id,
        senderId: user.uid,
        username: profile?.username || profile?.name || 'User',
        message: text,
        image: imageUrl,
      });
      setText('');
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  }

  async function handleLeave() {
    if (!user) return;
    await removeMember(id, user.uid, user.uid);
    navigate('/community');
  }

  if (loadingCommunity) return <div className="commChat__status">Loading community…</div>;
  if (!community) return <div className="commChat__status">Community not found.</div>;

  if (!user) {
    return (
      <div className="commChat__status">
        <p>Log in to view this community's chat.</p>
        <Link to="/login" className="commChat__loginBtn">Go to Login</Link>
      </div>
    );
  }

  if (membership === undefined) return <div className="commChat__status">Checking membership…</div>;

  if (!membership || membership.status !== 'approved') {
    return (
      <div className="commChat__status">
        <img src={community.image} alt="" className="commChat__lockedImg" />
        <h2>{community.name}</h2>
        <p>You need to be an approved member to view this chat. Head back to Community to request to join.</p>
        <Link to="/community" className="commChat__loginBtn"><FiArrowLeft /> Back to Community</Link>
      </div>
    );
  }

  const isAdmin = membership.role === 'admin';

  return (
    <div className="commChat">
      <header className="commChat__header">
        <button className="commChat__back" onClick={() => navigate('/community')}><FiArrowLeft /></button>
        <img src={community.image} alt={community.name} className="commChat__headerImg" />
        <div className="commChat__headerInfo">
          <h1>{community.name}</h1>
          <span><FiUsers /> {community.membersCount || 0} members</span>
        </div>
        <div className="commChat__headerActions">
          {isAdmin && (
            <>
              <button onClick={() => setShowInvite(true)} title="Invite Members"><FiUserPlus /></button>
              <button onClick={() => setShowAdmin(true)} title="Manage Community"><FiSettings /></button>
            </>
          )}
          <button onClick={handleLeave} title="Leave Community" className="commChat__leaveBtn"><FiLogOut /></button>
        </div>
      </header>

      <div className="commChat__messages">
        {messagesLoading ? (
          <p className="commChat__msgLoading">Loading messages…</p>
        ) : messages.length === 0 ? (
          <p className="commChat__msgLoading">No messages yet. Say hello 👋</p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === user.uid;
            return (
              <div key={m.id} className={`commChat__bubbleRow ${mine ? 'commChat__bubbleRow--mine' : ''}`}>
                <div className={`commChat__bubble ${mine ? 'commChat__bubble--mine' : ''}`}>
                  {!mine && <span className="commChat__bubbleUser">{m.username}</span>}
                  {m.image && <img src={m.image} alt="attachment" className="commChat__bubbleImg" />}
                  {m.message && <p>{m.message}</p>}
                  <span className="commChat__bubbleTime">
                    {m.timestamp?.toDate ? m.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form className="commChat__inputBar" onSubmit={handleSend}>
        {imagePreview && (
          <div className="commChat__imgPreview">
            <img src={imagePreview} alt="preview" />
            <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }}><FiX /></button>
          </div>
        )}
        <div className="commChat__inputRow">
          <button type="button" className="commChat__imgBtn" onClick={() => fileInputRef.current?.click()}>
            <FiImage />
          </button>
          <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImagePick} />
          <input
            className="commChat__textInput"
            placeholder="Type message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="commChat__sendBtn" disabled={sending || (!text.trim() && !imageFile)}>
            {sending ? <FiLoader className="spin" /> : <FiSend />}
          </button>
        </div>
      </form>

      {showInvite && <InviteMembersModal community={community} onClose={() => setShowInvite(false)} />}
      {showAdmin && (
        <AdminPanel
          community={community}
          adminUid={user.uid}
          onClose={() => setShowAdmin(false)}
          onDeleted={() => navigate('/community')}
        />
      )}
    </div>
  );
}
