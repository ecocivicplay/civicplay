import { Link } from "react-router-dom";
import "./AwarenessPreview.css";

export default function AwarenessPreview() {
  return (
    <section className="awareness-preview">
      <div className="awareness-header">
        <span className="awareness-badge">🌱 Awareness</span>

        <h2>
          Together for a <span>Greener Future</span>
        </h2>

        <p>
          Discover simple ways to protect our environment and inspire positive
          change in your community.
        </p>
      </div>

      <div className="awareness-cards">
        <div className="awareness-card">
          <div className="awareness-icon">♻️</div>
          <h3>Recycle</h3>
          <p>Reduce waste by recycling paper, plastic, glass, and metal.</p>
        </div>

        <div className="awareness-card">
          <div className="awareness-icon">🌳</div>
          <h3>Plant Trees</h3>
          <p>Plant more trees to improve air quality and biodiversity.</p>
        </div>

        <div className="awareness-card">
          <div className="awareness-icon">💧</div>
          <h3>Save Water</h3>
          <p>Every drop matters. Use water wisely and avoid unnecessary waste.</p>
        </div>
      </div>

      <div className="awareness-footer">
        <Link to="/Awareness" className="awareness-btn">
          View More →
        </Link>
      </div>
    </section>
  );
}