import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiCheck, FiRotateCw, FiMapPin, FiLoader } from 'react-icons/fi';
import './Report.css';
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Pick a mimeType the current browser actually supports for MediaRecorder.
// Without this, `new MediaRecorder(stream)` can throw on some browsers
// (notably Safari/iOS) and silently kill the recording — which is why
// "video" looked like it did nothing while "photo" worked fine.
function getSupportedMimeType() {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  for (const type of candidates) {
    if (window.MediaRecorder?.isTypeSupported?.(type)) return type;
  }
  return ''; // let the browser pick its own default
}

export default function Report() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fallbackInputRef = useRef(null);

  const [mode, setMode] = useState('photo'); // 'photo' | 'video'
  const [recording, setRecording] = useState(false);
  const [preview, setPreview] = useState(null); // { url, type, file }
  const [cameraError, setCameraError] = useState(false);
  const [recordError, setRecordError] = useState('');
  const [facingMode, setFacingMode] = useState('environment');

  // ---- Step after capture: report details form ----
  const [step, setStep] = useState('camera'); // 'camera' | 'details'
  const [form, setForm] = useState({
    issueType: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user, profile, reportSubmitted } = useAuth();

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  useEffect(() => {
    let active = true;
    async function startCamera() {
      stopCamera();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: mode === 'video',
        });
        if (!active) return;
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraError(false);
      } catch {
        if (active) setCameraError(true);
      }
    }
    if (!preview) startCamera();
    return () => { active = false; };
  }, [facingMode, mode, preview]);

  useEffect(() => () => stopCamera(), []);

  // Pre-fill today's date and try to grab the user's location as soon as
  // we reach the details step.
  useEffect(() => {
    if (step !== 'details') return;
    // setForm((f) => ({ ...f, date: f.date || new Date().toISOString().slice(0, 10) }));
    if (!form.location && navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setForm((f) => ({
              ...f,
              latitude,
              longitude,
              location:
                data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
            }));
          } catch {
            setForm((f) => ({
              ...f,
              latitude,
              longitude,
              location: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
            }));
          }
          finally {
            setLocating(false);
          }
        },
        () => setLocating(false),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function takePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      setPreview({ url: URL.createObjectURL(blob), type: 'photo', file: blob });
      stopCamera();
    }, 'image/jpeg', 0.92);
  }

  function startRecording() {
    const stream = streamRef.current;
    if (!stream) return;
    setRecordError('');
    chunksRef.current = [];
    const mimeType = getSupportedMimeType();

    let recorder;
    try {
      recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
    } catch {
      setRecordError("This browser can't record video. Try the fallback camera button below.");
      return;
    }

    recorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
    recorder.onerror = () => setRecordError('Recording failed. Please try again.');
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || 'video/webm' });
      setPreview({ url: URL.createObjectURL(blob), type: 'video', file: blob });
      stopCamera();
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  function handleShutter() {
    if (mode === 'photo') takePhoto();
    else recording ? stopRecording() : startRecording();
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validateForm() {
    const errs = {};
    if (!form.issueType)
      errs.issueType = "Please select an issue.";

    if (!form.description.trim())
      errs.description = "Description is required.";

    if (!form.location.trim())
      errs.location = "Location is required.";
    // if (!form.location.trim()) errs.location = 'Location is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleContinueToDetails() {
    setStep('details');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // TODO: replace with your real API call, e.g.:
      // const body = new FormData();
      // body.append('media', preview.file, preview.type === 'photo' ? 'report.jpg' : 'report.webm');
      // body.append('name', form.name);
      // body.append('email', form.email);
      // body.append('date', form.date);
      // body.append('location', form.location);
      // await fetch('/api/reports', { method: 'POST', body });
      const file = preview.file;

      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      const mediaURL = data.secure_url;

      console.log("Cloudinary URL:", mediaURL);
      await addDoc(collection(db, "reports"), {
        userId: user.uid,
        username: profile?.name || user.displayName || "Anonymous",
        email: user.email,
        photoURL: user.photoURL || "",

        issueType: form.issueType,
        description: form.description,

        imageURL: preview.type === "photo" ? mediaURL : "",
        videoURL: preview.type === "video" ? mediaURL : "",

        location: {
          latitude: form.latitude,
          longitude: form.longitude,
          address: form.location,
        },

        status: "Pending",

        createdAt: serverTimestamp(),
      });

      await reportSubmitted();
      alert("🎉 Report submitted successfully!\n\nYou earned +50 Civic Points!");
      navigate("/");
    } finally {
      setSubmitting(false);
      setPreview(null);
    }
  }

  function handleFallbackFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview({ url: URL.createObjectURL(file), type: mode, file });
  }

  return (
    <div className={`report ${step === 'camera' && !preview ? 'report--camera' : ''}`}>
      <button className="report__close" onClick={() => navigate(-1)} aria-label="Close">
        <FiX />
      </button>

      {!preview && !cameraError && (
        <div className="report__camera">
          <video ref={videoRef} className="report__feed" autoPlay playsInline muted />

          <button
            className="report__flip"
            onClick={() => setFacingMode((f) => (f === 'environment' ? 'user' : 'environment'))}
            aria-label="Flip camera"
          >
            <FiRotateCw />
          </button>

          {recordError && <div className="report__error">{recordError}</div>}

          <div className="report__controls">
            <div className="report__modeSwitch">
              <button className={mode === 'photo' ? 'active' : ''} onClick={() => setMode('photo')}>Photo</button>
              <button className={mode === 'video' ? 'active' : ''} onClick={() => setMode('video')}>Video</button>
            </div>

            <button
              className={`report__shutter ${mode === 'video' ? 'report__shutter--video' : ''} ${recording ? 'report__shutter--recording' : ''}`}
              onClick={handleShutter}
              aria-label={mode === 'photo' ? 'Take photo' : recording ? 'Stop recording' : 'Start recording'}
            >
              <span />
            </button>
          </div>
        </div>
      )}

      {!preview && cameraError && (
        <div className="report__fallback">
          <p>We couldn't access your camera. Tap below to use your device camera instead:</p>
          <button className="report__capture" onClick={() => fallbackInputRef.current.click()}>
            Open Camera
          </button>
          <input
            ref={fallbackInputRef}
            type="file"
            accept={mode === 'photo' ? 'image/*' : 'video/*'}
            capture="environment"
            hidden
            onChange={handleFallbackFile}
          />
        </div>
      )}

      {preview && step === 'camera' && (
        <div className="report__preview">
          {preview.type === 'photo' ? (
            <img src={preview.url} alt="Captured preview" />
          ) : (
            <video src={preview.url} controls />
          )}
          <div className="report__previewActions">
            <button className="report__retake" onClick={() => setPreview(null)}>Retake</button>
            <button className="report__submit" onClick={handleContinueToDetails}>
              <FiCheck /> Continue
            </button>
          </div>
        </div>
      )}

      {preview && step === 'details' && (
        <form className="report__details" onSubmit={handleSubmit}>
          {preview.type === 'photo' ? (
            <img className="report__detailsMedia" src={preview.url} alt="Captured preview" />
          ) : (
            <video className="report__detailsMedia" src={preview.url} controls />
          )}

          <div className="report__userInfo">
            <h3>{profile?.name || user?.displayName}</h3>
            <p>{user?.email}</p>
          </div>

          <div className="report__field">
            <label htmlFor="location">Location</label>
            <div className="report__field">
              <label htmlFor="issueType">Issue Type</label>

              <select
                id="issueType"
                name="issueType"
                value={form.issueType}
                onChange={handleFormChange}
              >
                <option value="">Select Issue</option>
                <option value="Garbage Spotting">Garbage Spotting</option>
                <option value="Water Filled Road">Water Filled Road</option>
                <option value="Footpath Occupied by Vendors">
                  Footpath Occupied by Vendors
                </option>
                <option value="Illegal Parking">Illegal Parking</option>
                <option value="Damaged Road">Damaged Road</option>
                <option value="Street Light Problem">Street Light Problem</option>
                <option value="Drainage Problem">Drainage Problem</option>
                <option value="Other">Other</option>
              </select>

              {formErrors.issueType && (
                <span className="report__fieldError">
                  {formErrors.issueType}
                </span>
              )}
            </div>

            <div className="report__field">
              <label htmlFor="issueType">Issue Type</label>

              <select
                id="issueType"
                name="issueType"
                value={form.issueType}
                onChange={handleFormChange}
              >
                <option value="">Select Issue</option>
                <option value="Garbage Spotting">Garbage Spotting</option>
                <option value="Water Filled Road">Water Filled Road</option>
                <option value="Illegal Parking">Illegal Parking</option>
                <option value="Damaged Road">Damaged Road</option>
                <option value="Street Light Problem">Street Light Problem</option>
                <option value="Drainage Problem">Drainage Problem</option>
                <option value="Other">Other</option>
              </select>
            </div>


            <div className="report__field">
              <label htmlFor="description">Description</label>

              <textarea
                id="description"
                name="description"
                rows="4"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Describe the issue..."
              />
            </div>

            <div className="report__locationInput">
              <FiMapPin />
              <input
                id="location"
                value={form.location}
                readOnly
                placeholder={locating ? "Detecting location..." : "Location detected automatically"}
              />
              {locating && <FiLoader className="report__spin" />}
            </div>
            {formErrors.location && <span className="report__fieldError">{formErrors.location}</span>}
          </div>

          <div className="report__previewActions">
            <button type="button" className="report__retake" onClick={() => setStep('camera')}>Back</button>
            <button type="submit" className="report__submit" disabled={submitting}>
              <FiCheck /> {submitting ? 'Submitting…' : 'Submit Report'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}