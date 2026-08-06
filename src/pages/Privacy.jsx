import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeading from '../components/ui/SectionHeading';
import './Legal.css';

const sections = [
  {
    title: '1. Information We Collect',
    body: (
      <>
        <p>
          We may collect information about you in a variety of ways. The
          information we collect through CivicPlay includes:
        </p>

        <h4>A. Personal Data</h4>
        <p>
          We collect personal information that you voluntarily provide when
          creating an account or participating in platform activities. This may
          include your name, email address, profile information, and other
          details required to use CivicPlay features such as community
          challenges, reporting civic issues, and reward redemption.
        </p>

        <h4>B. Geolocation Information</h4>
        <p>
          With your permission, we collect location information from your device
          to verify civic reports, eco-missions, and location-based activities.
          You can disable location access at any time through your device
          settings, although some features may not function properly.
        </p>

        <h4>C. User-Generated Content</h4>
        <p>
          We collect the photos, videos, descriptions, and other content you
          upload while using CivicPlay. Submitted media may be analyzed by our
          AI Verification Engine to verify completed civic tasks and prevent
          fraudulent submissions.
        </p>

        <h4>D. Derivative Data</h4>
        <p>
          Our servers automatically collect technical and usage information such
          as interactions with posts, comments, likes, community participation,
          guild activities, device information, and platform usage statistics to
          improve our services.
        </p>
      </>
    ),
  },
  {
    title: '2. Use of Your Information',
    body: (
      <>
        <p>Your information is used to provide and improve CivicPlay.</p>

        <ul>
          <li>Create and manage your CivicPlay account.</li>
          <li>Track CivicPoints, achievements, badges, and progression levels.</li>
          <li>Provide location-based services including civic issue verification.</li>
          <li>Verify uploaded photos and videos using our AI Verification Engine.</li>
          <li>
            Process reward redemptions such as municipal benefits, coupons, or
            partner rewards.
          </li>
          <li>
            Manage Civilian Guilds, community challenges, and Neighborhood
            Territory Wars.
          </li>
          <li>
            Deliver optional location-based notifications and eco-mission
            reminders.
          </li>
          <li>
            Generate anonymous analytics for municipal governments through our
            B2G Dashboard.
          </li>
          <li>
            Monitor usage patterns and improve platform performance, security,
            and user experience.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: '3. Disclosure of Your Information',
    body: (
      <>
        <p>
          We may share your information only when necessary to provide our
          services or comply with legal obligations.
        </p>

        <h4>A. Municipal & Government Partners</h4>
        <p>
          Where applicable, verified civic activity may be shared with partner
          municipalities to support government initiatives, tax rebate
          programs, utility incentives, and city improvement dashboards.
          Personally identifiable information is shared only when required.
        </p>

        <h4>B. Third-Party Service Providers</h4>
        <p>
          We work with trusted third-party providers for services including
          cloud hosting, authentication, analytics, email delivery, customer
          support, payment processing, and platform maintenance.
        </p>

        <h4>C. Partner Merchants</h4>
        <p>
          If you redeem CivicPoints for rewards, coupons, or vouchers, limited
          information required to complete that transaction may be shared with
          participating merchants.
        </p>

        <h4>D. Legal Requirements</h4>
        <p>
          We may disclose information if required by law, legal process, court
          order, or when necessary to protect the rights, safety, security, or
          property of CivicPlay, our users, or others.
        </p>
      </>
    ),
  },
  {
    title: '4. Security of Your Information',
    body: (
      <>
        <p>
          We implement administrative, technical, and physical safeguards to
          help protect your personal information.
        </p>

        <p>
          Security measures include encrypted storage, secure authentication,
          controlled access to sensitive data, AI-based verification systems,
          and continuous monitoring for unauthorized access or misuse.
        </p>

        <p>
          Although we strive to protect your information, no method of internet
          transmission or electronic storage is completely secure. Therefore,
          absolute security cannot be guaranteed.
        </p>
      </>
    ),
  },
  {
    title: '5. Policy for Children',
    body: (
      <>
        <p>
          CivicPlay is not intended for children under the age of 13. We do not
          knowingly collect personal information from children under 13 years of
          age.
        </p>

        <p>
          If we discover that such information has been collected, we will take
          reasonable steps to delete it as quickly as possible.
        </p>
      </>
    ),
  },
  {
    title: '6. Your Privacy Rights',
    body: (
      <>
        <p>
          Depending on your location and applicable laws, you may have the
          right to:
        </p>

        <ul>
          <li>Access the personal information we store about you.</li>
          <li>Correct inaccurate or incomplete information.</li>
          <li>Request deletion of your personal information.</li>
          <li>Withdraw permissions such as location access.</li>
        </ul>

        <p>
          To exercise any of these rights, please contact the CivicPlay support
          team.
        </p>
      </>
    ),
  },
  {
    title: '7. Changes to This Privacy Policy',
    body: (
      <>
        <p>
          We may update this Privacy Policy periodically to reflect changes in
          our services, legal requirements, or business practices.
        </p>

        <p>
          Any updates will be reflected by revising the "Last Updated" date at
          the top of this page. We encourage you to review this Privacy Policy
          regularly.
        </p>
      </>
    ),
  },
  {
    title: '8. Contact Us',
    body: (
      <>
        <p>
          If you have any questions or concerns regarding this Privacy Policy,
          please contact us:
        </p>

        <p>
          <strong>CivicPlay</strong>
          <br />
          Ahmedabad, Gujarat, India
          <br />
          380061
          <br />
          Email: eco.civicplay@gmail.com
        </p>
      </>
    ),
  },
];

export default function Privacy() {
  const scope = useRef(null);
  useScrollReveal(scope);

  return (
    <div ref={scope} className="legal-page">
      <section className="section">
        <div className="container legal__container">
          <SectionHeading
            eyebrow="Legal"
            title="Privacy"
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