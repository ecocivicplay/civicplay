import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  MapContainer,
  TileLayer,
  // Circle,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './GarbageMap.css';

/* ------------------------------------------------------------------ */
/* Issue-type config: single source of truth for colour, icon, label  */
/* ------------------------------------------------------------------ */
const ISSUE_TYPES = {
  'Garbage Spotting': { tone: 'green', color: '#3ddc84', emoji: '🗑️' },
  'Water Filled Road': { tone: 'blue', color: '#3b82f6', emoji: '💧' },
  'Illegal Parking': { tone: 'orange', color: '#f59e0b', emoji: '🚗' },
  'Damaged Road': { tone: 'red', color: '#ef4444', emoji: '🛣️' },
  'Street Light Problem': { tone: 'yellow', color: '#eab308', emoji: '💡' },
  'Drainage Problem': { tone: 'purple', color: '#8b5cf6', emoji: '🌊' },
  Other: { tone: 'grey', color: '#94a3b8', emoji: '📍' },
};

const STATUS_OPTIONS = ['All', 'Pending', 'In Progress', 'Resolved'];

function issueConfig(type) {
  return ISSUE_TYPES[type] || ISSUE_TYPES.Other;
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
function youAreHereIcon() {
  return L.divIcon({
    className: 'gmap__you',
    html: '<span class="gmap__youDot"></span><span class="gmap__youPulse"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function pinIcon(emoji, tone) {
  return L.divIcon({
    className: `gmap__pin gmap__pin--${tone}`,
    html: `
      <div class="gmap__pinInner">
        <span>${emoji}</span>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 46],
    popupAnchor: [0, -42],
  });
}

/* ------------------------------------------------------------------ */
/* Distance helper (Haversine, metres)                                 */
/* ------------------------------------------------------------------ */
function distanceMeters([lat1, lng1], [lat2, lng2]) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function prettyDistance(m) {
  if (m == null) return '—';
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ------------------------------------------------------------------ */
/* Map helper components                                               */
/* ------------------------------------------------------------------ */
function RecenterOnLocate({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 16);
  }, [position, map]);
  return null;
}

// Fixed: proper event binding via useMapEvents (auto-cleans up)
function ClickToReport({ onAdd }) {
  useMapEvents({
    click(e) {
      const desc = window.prompt('Describe the issue (e.g. "Overflowing bin"):');
      if (desc) onAdd({ pos: [e.latlng.lat, e.latlng.lng], title: desc });
    },
  });
  return null;
}

// Exposes a couple of imperative controls (locate / fly-to) to the parent
function MapController({ registerControls, userPos }) {
  const map = useMap();
  useEffect(() => {
    registerControls({
      locate: () => userPos && map.flyTo(userPos, 16, { duration: 0.8 }),
      flyTo: (pos) => pos && map.flyTo(pos, 17, { duration: 0.8 }),
    });
  }, [map, registerControls, userPos]);
  return null;
}

function boundaryRadius() {
  return 400;
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */
function StatCard({ icon, value, title, tone }) {
  return (
    <div className={`gmap__stat gmap__stat--${tone}`}>
      <div className="gmap__statIcon" aria-hidden="true">{icon}</div>
      <div className="gmap__statBody">
        <span className="gmap__statValue">{value}</span>
        <span className="gmap__statTitle">{title}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Resolved: 'resolved',
    'In Progress': 'progress',
    Pending: 'pending',
    Reported: 'pending',
  };
  const tone = map[status] || 'pending';
  return <span className={`gmap__badge gmap__badge--${tone}`}>{status || 'Pending'}</span>;
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
export default function GarbageMap() {
  const navigate = useNavigate();

  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | denied | unsupported
  const [rawReports, setRawReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  // filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // imperative map controls
  const [mapCtl, setMapCtl] = useState(null);

  const reportsRef = collection(db, 'reports');

  /* --- Geolocation (unchanged behaviour) --- */
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('unsupported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setStatus('ready');
      },
      (error) => {
        console.log(error);
        setStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  /* --- Live Firestore subscription (this was missing before) --- */
  useEffect(() => {
    let q;
    try {
      q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    } catch {
      q = collection(db, 'reports');
    }
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        console.log(data);   // <-- ADD THIS

        setRawReports(data);
        setLoadingReports(false);
      },
      (err) => {
        console.error(err);
        setLoadingReports(false);
      }
    );
    return () => unsub();
  }, []);

  /* --- Normalize raw docs into what the map/cards expect --- */
  const reports = useMemo(() => {
    return rawReports
      .map((r) => {
        const lat = Number(
          r.location?.latitude ??
          r.latitude ??
          r.lat ??
          (Array.isArray(r.pos) ? r.pos[0] : null)
        );

        const lng = Number(
          r.location?.longitude ??
          r.longitude ??
          r.lng ??
          (Array.isArray(r.pos) ? r.pos[1] : null)
        );

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
          return null;
        }
        if (typeof lat !== 'number' || typeof lng !== 'number') return null;

        const type = r.issueType || r.type || r.title || 'Other';
        const cfg = issueConfig(ISSUE_TYPES[type] ? type : 'Other');

        return {
          id: r.id,

          pos: [lat, lng],

          type: r.issueType || "Other",

          title: r.issueType || "Issue",

          description: r.description || "",

          address: r.location?.address || "",

          image: r.imageURL || "",

          video: r.videoURL || "",

          reporter: r.username || "Anonymous",

          status: r.status || "Pending",

          createdAt: r.createdAt,

          lat,
          lng,

          ...issueConfig(r.issueType),
        };
      })
      .filter(Boolean);
  }, [rawReports]);

  /* --- Apply search + filters --- */
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reports.filter((r) => {
      if (r.status === "Resolved") return false;
      if (typeFilter !== 'All' && r.type !== typeFilter) return false;
      if (statusFilter !== 'All' && (r.status || 'Pending') !== statusFilter) return false;
      if (term) {
        const hay = `${r.address} ${r.type} ${r.title} ${r.description}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [reports, search, typeFilter, statusFilter]);

  /* --- Nearby list (sorted by distance from user) --- */
  const nearby = useMemo(() => {
    if (!position) return filtered;
    return [...filtered]
      .map((r) => ({ ...r, distance: distanceMeters(position, r.pos) }))
      .sort((a, b) => a.distance - b.distance);
  }, [filtered, position]);

  /* --- Stats --- */
  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) =>
      ['Pending', 'Reported'].includes(r.status)
    ).length;
    const resolved = reports.filter((r) => r.status === 'Resolved').length;
    const critical = reports.filter((r) =>
      ['Damaged Road', 'Drainage Problem'].includes(r.type)
    ).length;
    return { total, pending, resolved, critical };
  }, [reports]);

  async function handleAddReport({ pos, title }) {
    try {
      await addDoc(reportsRef, {
        title,
        issueType: 'Other',
        latitude: pos[0],
        longitude: pos[1],
        status: 'Pending',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
      alert('Could not save report');
    }
  }

  function resetFilters() {
    setSearch('');
    setTypeFilter('All');
    setStatusFilter('All');
  }

  function toggleFullscreen() {
    const el = document.querySelector('.gmap__mapWrap');
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }

  /* --- Non-ready states (kept, restyled) --- */
  if (status === 'denied') {
    return (
      <div className="gmap">
        <div className="gmap__card gmap__stateCard">
          <p>Location access was denied, so the map can't center on you.</p>
          <p className="gmap__stateSub">
            Enable location permission for this site in your browser settings, then reload the page.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unsupported') {
    return (
      <div className="gmap">
        <div className="gmap__card gmap__stateCard">
          <p>Your browser doesn't support geolocation, so we can't show your live position.</p>
        </div>
      </div>
    );
  }

  if (status === 'loading' || !position) {
    return (
      <div className="gmap">
        <div className="gmap__card gmap__stateCard">
          <div className="gmap__spinner" aria-hidden="true" />
          <p>Finding your location…</p>
        </div>
      </div>
    );
  }

  /* --- Ready --- */
  return (
    <div className="gmap">
      <div className="gmap__shell">

        {/* Header */}
        <header className="gmap__header">
          <div className="gmap__headText">
            <h2>🗺️ Garbage Map <span className="gmap__live">● Live Civic Reports</span></h2>
            <p className="gmap__subtitle">View issues reported by citizens in real time.</p>
          </div>
          <div className="gmap__legendPill">
            <span className="gmap__legendSwatch" /> Interactive
          </div>
        </header>

        {/* Statistics */}
        <section className="gmap__stats" aria-label="Report statistics">
          <StatCard icon="📊" value={stats.total} title="Total Reports" tone="blue" />
          <StatCard icon="⏳" value={stats.pending} title="Pending Reports" tone="yellow" />
          <StatCard icon="✅" value={stats.resolved} title="Resolved Reports" tone="green" />
          <StatCard icon="🚨" value={stats.critical} title="Critical Reports" tone="red" />
        </section>

        {/* Search & filters */}
        <section className="gmap__controls" aria-label="Search and filters">
          <div className="gmap__searchBox">
            <span aria-hidden="true">🔍</span>
            <input
              type="search"
              placeholder="Search by address or issue type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search reports"
            />
          </div>

          <label className="gmap__field">
            <span className="gmap__fieldLabel">Issue Type</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by issue type"
            >
              <option value="All">All Types</option>
              {Object.keys(ISSUE_TYPES).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label className="gmap__field">
            <span className="gmap__fieldLabel">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <button type="button" className="gmap__reset" onClick={resetFilters}>
            Reset Filters
          </button>
        </section>

        {/* Main grid: map + legend sidebar */}
        <div className="gmap__grid">
          {/* Map card */}
          <div className="gmap__mapWrap">
            <div className="gmap__mapTools">
              <button type="button" onClick={() => mapCtl?.locate()} aria-label="Locate me" title="Locate me">📍</button>
              <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen" title="Fullscreen">⛶</button>
            </div>

            <MapContainer
              center={position}
              zoom={16}
              scrollWheelZoom
              attributionControl={false}
              className="gmap__map"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <RecenterOnLocate position={position} />
              <ClickToReport onAdd={handleAddReport} />
              <MapController registerControls={setMapCtl} userPos={position} />

              {/* <Circle
                center={position}
                radius={boundaryRadius()}
                pathOptions={{ color: '#1fae6b', weight: 3, fillColor: '#33cc85', fillOpacity: 0.15 }}
              /> */}

              <Marker position={position} icon={youAreHereIcon()}>
                {/* <Tooltip permanent direction="top" offset={[0, -10]} className="gmap__zoneLabel">
                  You are here
                </Tooltip> */}
              </Marker>

              {filtered.map((r) => (
                <Marker key={r.id} position={r.pos} icon={pinIcon(r.emoji, r.tone)}>
                  <Popup className="gmap__popup">
                    <div className="gmap__popupCard">
                      <div
                        className="gmap__popupHead"
                        style={{ background: r.color }}
                      >
                        <span>{r.emoji} {r.type}</span>
                        <StatusBadge status={r.status} />
                      </div>

                      {r.image ? (
                        <img
                          className="gmap__popupImg"
                          src={r.image}
                          alt={r.type}
                          loading="lazy"
                        />
                      ) : r.video ? (
                        <video
                          className="gmap__popupVideo"
                          controls
                          preload="metadata"
                        >
                          <source src={r.video} />
                        </video>
                      ) : (
                        <div className="gmap__popupNoMedia">
                          📷 No proof uploaded
                        </div>
                      )}

                      <div className="gmap__popupBody">
                        {r.description && <p className="gmap__popupDesc">{r.description}</p>}
                        {r.address && <p><strong>Address:</strong> {r.address}</p>}
                        <p className="gmap__coords">
                          Lat: {r.lat.toFixed(5)} · Lng: {r.lng.toFixed(5)}
                        </p>
                        <p><strong>Reporter:</strong> {r.reporter}</p>
                        <p><strong>Date:</strong> {formatDate(r.createdAt)}</p>
                      </div>

                      <p>Issue Type: {r.type}</p>

                      <div className="gmap__popupActions">
                        {r.image && (
                          <a href={r.image} target="_blank" rel="noreferrer" className="gmap__popupBtn">
                            View Full Image
                          </a>
                        )}
                        <a
                          className="gmap__popupBtn gmap__popupBtn--primary"
                          href={`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Directions
                        </a>

                        <button
                          type="button"
                          className="gmap__popupBtn gmap__popupBtn--success"
                          onClick={() =>
                            navigate("/proof-upload", {
                              state: {
                                report: {
                                  id: r.id,
                                  issueType: r.type,
                                  latitude: r.lat,
                                  longitude: r.lng,
                                  description: r.description,
                                  status: r.status,
                                  imageURL: r.image,
                                  username: r.reporter,
                                },
                              },
                            })
                          }
                        >
                          🧹 Clean & Upload Proof
                        </button>

                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <p className="gmap__hint">Tap anywhere on the map to drop a report pin.</p>
          </div>

          {/* Legend sidebar */}
          <aside className="gmap__legendCard" aria-label="Map legend">
            <h3>Legend</h3>
            <ul>
              {Object.entries(ISSUE_TYPES).map(([label, cfg]) => (
                <li key={label}>
                  <span className="gmap__legendDot" style={{ background: cfg.color }} />
                  <span className="gmap__legendEmoji">{cfg.emoji}</span>
                  {label}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* Nearby reports */}
        <section className="gmap__nearby" aria-label="Nearby reports">
          <h3>Nearby Reports {loadingReports && <span className="gmap__muted">loading…</span>}</h3>

          {loadingReports ? (
            <div className="gmap__nearbyGrid">
              {[0, 1, 2].map((i) => <div key={i} className="gmap__skeleton" />)}
            </div>
          ) : nearby.length === 0 ? (
            <p className="gmap__muted">No reports match your filters.</p>
          ) : (
            <div className="gmap__nearbyGrid">
              {nearby.slice(0, 12).map((r) => (
                <article key={r.id} className="gmap__nearbyCard">
                  <div
                    className="gmap__nearbyImg"
                    style={{
                      backgroundImage: r.image ? `url(${r.image})` : 'none',
                      background: r.image ? undefined : r.color,
                    }}
                  >
                    {!r.image && <span className="gmap__nearbyEmoji">{r.emoji}</span>}
                  </div>
                  <div className="gmap__nearbyBody">
                    <div className="gmap__nearbyTop">
                      <span className="gmap__nearbyType">{r.emoji} {r.type}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="gmap__nearbyAddr">{r.address || 'No address'}</p>
                    <div className="gmap__nearbyMeta">
                      <span>{formatDate(r.createdAt)}</span>
                      <span>{prettyDistance(r.distance)}</span>
                    </div>
                    <button
                      type="button"
                      className="gmap__nearbyBtn"
                      onClick={() => mapCtl?.flyTo(r.pos)}
                    >
                      View on Map
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Floating action button -> existing Report page */}
      <button
        type="button"
        className="gmap__fab"
        onClick={() => navigate('/report')}
        aria-label="Report a new issue"
      >
        <span className="gmap__fabPlus">＋</span> Report Issue
      </button>
    </div>
  );
}