import { useEffect, useState } from "react";
import "./InstallPrompt.css";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("hide-install-prompt") === "true") return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShow(false);
    }

    setDeferredPrompt(null);
  };

  const later = () => {
    localStorage.setItem("hide-install-prompt", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="install-overlay">
      <div className="install-card">

        <img
          src="/icon-192.png"
          alt="CivicPlay"
          className="install-logo"
        />

        <h2>Install CivicPlay</h2>

        <p>
          Add CivicPlay to your home screen for a faster,
          full-screen app experience.
        </p>

        <div className="install-buttons">
          <button className="later-btn" onClick={later}>
            Maybe Later
          </button>

          <button className="install-btn" onClick={install}>
            Install
          </button>
        </div>

      </div>
    </div>
  );
}