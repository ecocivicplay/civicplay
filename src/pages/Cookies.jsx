import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeading from '../components/ui/SectionHeading';
import './Legal.css';

const sections = [
  {
    title: '1. What Are Cookies?',
    body: (
      <>
        <p>
          This Cookie Policy explains how CivicPlay ("we", "us", or "our")
          uses cookies and similar technologies when you visit our website
          (<strong>https://civicplay.netlify.app/</strong>) or use our mobile
          application.
        </p>

        <p>
          Cookies are small data files stored on your computer or mobile device
          that help websites and applications function efficiently while
          remembering your preferences.
        </p>

        <h4>First-Party Cookies</h4>
        <p>
          These cookies are created directly by CivicPlay and are required for
          the Platform to function properly.
        </p>

        <h4>Third-Party Cookies</h4>
        <p>
          These cookies are created by trusted third-party services used for
          analytics, interactive features, authentication, and reward
          verification.
        </p>
      </>
    ),
  },

  {
    title: '2. Why Do We Use Cookies?',
    body: (
      <>
        <p>We use cookies for several important purposes, including:</p>

        <ul>
          <li>Keeping you securely signed in.</li>
          <li>Tracking CivicPoints and leaderboard progress.</li>
          <li>Supporting location verification for civic reports.</li>
          <li>Improving platform performance and user experience.</li>
          <li>Providing personalized features and settings.</li>
        </ul>
      </>
    ),
  },

  {
    title: '3. Types of Cookies We Use',
    body: (
      <>
        <h4>A. Essential Website Cookies</h4>
        <p>
          These cookies are required for authentication, account security,
          access to your Civic Wallet, and other core platform features.
        </p>

        <h4>B. Performance & Functionality Cookies</h4>
        <p>
          These cookies improve platform performance and enable features such
          as location verification, personalized preferences, and community
          participation.
        </p>

        <h4>C. Analytics & Customization Cookies</h4>
        <p>
          Analytics cookies help us understand how users interact with
          CivicPlay so we can improve missions, rewards, and overall user
          experience.
        </p>

        <h4>D. Third-Party & Partner Cookies</h4>
        <p>
          Certain partner services may use cookies to verify successful reward
          redemptions, merchant transactions, and municipal integrations.
        </p>
      </>
    ),
  },

  {
    title: '4. Other Tracking Technologies',
    body: (
      <>
        <p>
          In addition to cookies, CivicPlay may use technologies such as web
          beacons, tracking pixels, and similar tools to understand website
          traffic, email engagement, campaign effectiveness, and user activity.
        </p>

        <p>
          These technologies help improve platform performance and deliver a
          better user experience.
        </p>
      </>
    ),
  },

  {
    title: '5. How Can I Control Cookies?',
    body: (
      <>
        <h4>Browser Controls</h4>
        <p>
          Most web browsers allow you to accept, reject, or delete cookies
          through browser settings. Disabling cookies may limit certain
          CivicPlay features such as authentication, location verification, or
          CivicPoints tracking.
        </p>

        <h4>Mobile Device Settings</h4>
        <p>
          You can manage tracking permissions and location access directly from
          your Android or iOS device settings.
        </p>
      </>
    ),
  },

  {
    title: '6. Updates to This Cookie Policy',
    body: (
      <>
        <p>
          We may update this Cookie Policy periodically to reflect operational,
          legal, or technical changes.
        </p>

        <p>
          Any changes will be indicated by updating the <strong>Last Updated</strong> date at the top of this page.
        </p>
      </>
    ),
  },

  {
    title: '7. Contact Us',
    body: (
      <>
        <p>
          If you have any questions regarding our use of cookies or tracking
          technologies, please contact us:
        </p>

        <p>
          <strong>CivicPlay</strong>
          <br />
          eco.civicplay@gmail.com
        </p>
      </>
    ),
  },
];

export default function Cookies() {
  const scope = useRef(null);
  useScrollReveal(scope);

  return (
    <div ref={scope} className="legal-page">
      <section className="section">
        <div className="container legal__container">
          <SectionHeading
            eyebrow="Legal"
            title="Cookie"
            highlight="Policy"
            subtitle="Last Updated: August 4, 2026"
            center={false}
          />

          <div className="legal__body" data-stagger>
            {sections.map((section) => (
              <div className="legal-block" key={section.title}>
                <h3>{section.title}</h3>
                {typeof section.body === 'string' ? (
                  <p>{section.body}</p>
                ) : (
                  section.body
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}