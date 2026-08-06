import React from 'react';
import './Awareness.css';

const Awareness = () => {
  return (
    <div className="awareness-page">
      {/* Hero Section */}
      <section className="aw-hero">
        <div className="aw-hero-overlay"></div>
        <img 
          src="/images/challenges/clean-surroundings.jpg" 
          alt="Clean City" 
          className="aw-hero-bg" 
        />
        <div className="aw-hero-content">
          <div className="aw-badge">Transforming Urban Governance</div>
          <h1 className="aw-hero-title">
            <span className="text-highlight">CivicPlay:</span> Gamified Action for Modern Cities
          </h1>
          <p className="aw-hero-subtitle">
            Urban environments flourish when citizens take an active role. CivicPlay bridges the structural disconnect between local government and community involvement by merging mobile technology, computer vision, and game mechanics to turn municipal maintenance into a rewarding collective effort.
          </p>
        </div>
      </section>

      {/* Rebuilding Citizen Engagement */}
      <section className="aw-section aw-engagement-section">
        <div className="aw-container">
          <div className="aw-section-header">
            <h2>Rebuilding Citizen Engagement</h2>
            <p>Moving from civic inertia to tangible, gamified incentives.</p>
          </div>
          
          <div className="aw-split-layout">
            <div className="aw-problem-box">
              <h3><span className="aw-icon">⚠️</span> The Problem: Civic Inertia</h3>
              <p>Traditional municipal reporting mechanisms—outdated hotlines, clunky web forms—are notoriously tedious. Citizens feel reports enter a black hole with no follow-up, breeding cynicism and causing residents to ignore urban decay because reporting feels unrewarding.</p>
              
              <div className="aw-news-context">
                <h4>In The News</h4>
                <div className="aw-news-media">
                  <img src="/images/news/bmc-flooded.jpg" alt="Flooded city street" className="aw-news-thumb" />
                </div>
                <ul className="aw-news-list">
                  <li>City municipalities are poor in fixing problems. People are turning to MLAs, middlemen, NGOS[cite: 1].</li>
                  <li>Citizens Ignore Segregation Rules, Waste Management Still a Challenge[cite: 1].</li>
                </ul>
              </div>
            </div>
            
            <div className="aw-solution-box">
              <h3><span className="aw-icon">💡</span> The CivicPlay Fix</h3>
              <ul className="aw-feature-list">
                <li>
                  <strong>Experience Points (XP) & Leveling:</strong> Verified reports and resolutions grant XP, leveling users from "Local Resident" to "City Guardian."
                </li>
                <li>
                  <strong>Public Leaderboards:</strong> Friendly competition highlights active contributors across neighborhoods and schools.
                </li>
                <li>
                  <strong>The Civic Impact Card:</strong> XP converts to real-world perks like utility rebates, transit passes, or local shop discounts.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="aw-section aw-pillars-section">
        <div className="aw-container">
          <div className="aw-section-header center">
            <h2>Tackling Urban Challenges</h2>
            <p>Empowering citizens to report, map, and secure their neighborhoods.</p>
          </div>

          <div className="aw-grid-3">
            {/* Pillar 1: Roads */}
            <div className="aw-card">
              <div className="aw-card-image-wrapper">
                <img src="/images/news/potholes.jpg" alt="Severely damaged road" className="aw-card-img" />
                <div className="aw-card-news-overlay">
                  <ul>
                    <li>Rain exposes civic woes as potholes, cave-ins emerge across Ahmedabad[cite: 1].</li>
                    <li>Poor Road Maintenance Causes Traffic Chaos Across Major Cities[cite: 1].</li>
                  </ul>
                </div>
              </div>
              <h3>Eliminating Road Hazards</h3>
              <div className="aw-card-content">
                <p className="aw-problem-text"><strong>Problem:</strong> Unseen infrastructure decay like potholes causes severe safety risks and costly damages.</p>
                <div className="aw-divider"></div>
                <p className="aw-solution-text"><strong>CivicPlay Fix:</strong> Real-time geolocation logging.</p>
                <ul>
                  <li>Instant photo tagging with precise GPS.</li>
                  <li>Dynamic prioritization based on hazard density.</li>
                  <li>Direct route optimization for maintenance crews.</li>
                </ul>
              </div>
            </div>

            {/* Pillar 2: Waste */}
            <div className="aw-card">
              <div className="aw-card-image-wrapper">
                <img src="/images/news/mumbai-beach.jpg" alt="Waste cleanup on beach" className="aw-card-img" />
                <div className="aw-card-news-overlay">
                  <ul>
                    <li>Hyderabad's 15 lakh tonne waste pile near IKEA raises alarm[cite: 1].</li>
                    <li>2,500,000 kg of plastic, thermocol, clothes: What Arabian Sea spit post heavy Mumbai rains[cite: 1].</li>
                  </ul>
                </div>
              </div>
              <h3>Combatting Urban Waste</h3>
              <div className="aw-card-content">
                <p className="aw-problem-text"><strong>Problem:</strong> Illegal dumping degrades neighborhoods and creates serious public health hazards.</p>
                <div className="aw-divider"></div>
                <p className="aw-solution-text"><strong>CivicPlay Fix:</strong> Public mapping & missions.</p>
                <ul>
                  <li>Litter "Pings" with visual proof.</li>
                  <li>Local "Cleanup Missions" for groups.</li>
                  <li>Live tracking shifting from "Contested" to "Clean Zone".</li>
                </ul>
              </div>
            </div>

            {/* Pillar 3: Safety */}
            <div className="aw-card">
              <div className="aw-card-image-wrapper">
                <img src="/images/news/broken-footpath.jpg" alt="Broken footpaths and dark streets" className="aw-card-img" />
                <div className="aw-card-news-overlay">
                  <ul>
                    <li>Mumbai: Broken Footpaths Continue to Endanger Pedestrians[cite: 1].</li>
                    <li>Dark Streets Become Crime Hotspots as Streetlights Remain Unrepaired.[cite: 1].</li>
                    <li>Ghaziabad: Most roads lack lights, dark streets trigger crime spike[cite: 1].</li>
                  </ul>
                </div>
              </div>
              <h3>Securing Public Spaces</h3>
              <div className="aw-card-content">
                <p className="aw-problem-text"><strong>Problem:</strong> Broken lighting and damaged emergency infrastructure create dangerous blind spots.</p>
                <div className="aw-divider"></div>
                <p className="aw-solution-text"><strong>CivicPlay Fix:</strong> Rapid infrastructure dispatch.</p>
                <ul>
                  <li>One-tap glitch reporting for quick submission.</li>
                  <li>Automated council routing bypassing slow queues.</li>
                  <li>Safety verification loop confirmed by nearby users.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Verification Section */}
      <section className="aw-section aw-ai-section">
        <div className="aw-container">
          <div className="aw-ai-layout">
            <div className="aw-ai-text">
              <h2>Eliminating Spam with AI</h2>
              <p className="aw-problem-text">
                City departments are overwhelmed by duplicate filings, ambiguous descriptions, and spam, wasting thousands of hours on manual review.
              </p>
              
              <div className="aw-case-study">
                <div className="aw-case-study-img-container">
                  <img src="/images/news/chennai-tea-shop.jpg" alt="Tea shop encroaching footpath" className="aw-case-study-img" />
                </div>
                <div className="aw-case-study-content">
                  <h4>Real-World Bottleneck</h4>
                  <p>Chennai: A Mylapore resident raised a complaint on GCC's app saying a footpath was being encroached by a tea shop. The very next day, GCC officials marked the complaint 'resolved' and attached a photo where the cart wasn't visible in it. The tea shop continued to operate there[cite: 1].</p>
                </div>
              </div>

              <p className="aw-solution-text">
                CivicPlay integrates an AI-driven verification layer to protect city databases from poor-quality data like this.
              </p>
            </div>
            
            <div className="aw-table-container">
              <table className="aw-modern-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Function</th>
                    <th>Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Media Proof Analysis</strong></td>
                    <td>AI vision models analyze imagery to confirm hazards (e.g., distinguishing pothole vs. shadow).</td>
                    <td>Filters out invalid or accidental uploads instantly.</td>
                  </tr>
                  <tr>
                    <td><strong>De-Duplication Engine</strong></td>
                    <td>Cross-references new photos/GPS against active tickets nearby.</td>
                    <td>Consolidates multiple reports into one master ticket.</td>
                  </tr>
                  <tr>
                    <td><strong>Precision Flagging</strong></td>
                    <td>Evaluates structural damage severity based on historical data.</td>
                    <td>Automatically ranks urgency for maintenance teams.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Fostering Neighborhood Action */}
      <section className="aw-section aw-community-section">
        <div className="aw-container">
          <div className="aw-community-banner">
            <img 
              src="/images/news/community-cleanup.jpg" 
              alt="Community Action" 
              className="aw-community-bg" 
            />
            <div className="aw-community-content">
              <h2>Fostering Neighborhood Action</h2>
              <p>Modern urban living isolates neighbors. CivicPlay unifies local blocks through collaborative mechanics, turning community improvement into a collective point of pride.</p>
              
              <div className="aw-news-highlight-box">
                <h4>Citizen Action in the News</h4>
                <ul>
                  <li>Citizens Join Hands to Clean Bengaluru's Lakes[cite: 1].</li>
                  <li>Residents Lead Community Cleanup Drive to Restore Public Spaces[cite: 1].</li>
                </ul>
                <img src="/images/news/bengaluru-lake.jpg" alt="Restored Lake" className="aw-inline-news-img" />
              </div>

              <div className="aw-community-features">
                <div className="aw-cf-item">
                  <div className="aw-cf-icon">🛡️</div>
                  <h4>Civilian Guilds</h4>
                  <p>Form neighborhood teams to tackle projects, track XP, and host events.</p>
                </div>
                <div className="aw-cf-item">
                  <div className="aw-cf-icon">🗺️</div>
                  <h4>Territory Heatmaps</h4>
                  <p>Interactive color-coded maps displaying maintenance status and cleanliness.</p>
                </div>
                <div className="aw-cf-item">
                  <div className="aw-cf-icon">🏆</div>
                  <h4>Friendly Competition</h4>
                  <p>Compete to secure "Cleanest Zone" status and top leaderboard spots.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Footer */}
      <section className="aw-cta-section">
        <div className="aw-container center">
          <h2>Ready to Transform Your City?</h2>
          <p>Join CivicPlay today and start leveling up your civic profile while making a real-world impact.</p>
          <button className="aw-cta-button">Become a City Guardian</button>
        </div>
      </section>
    </div>
  );
};

export default Awareness;