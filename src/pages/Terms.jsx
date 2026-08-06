import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeading from '../components/ui/SectionHeading';
import './Legal.css';

const sections = [
  {
    title: '1. Description of Service',
    body: (
      <>
        <p>
          CivicPlay is a gamified civic engagement platform that enables users
          to report municipal issues, participate in community challenges, and
          earn digital rewards known as <strong>CivicPoints</strong> for
          completing verified civic activities.
        </p>

        <p>
          The Platform connects citizens, municipalities, and local businesses
          to encourage cleaner, safer, and more sustainable communities.
        </p>
      </>
    ),
  },

  {
    title: '2. Eligibility',
    body: (
      <>
        <p>
          You must be at least <strong>13 years old</strong> to use CivicPlay.
          By using the Platform, you confirm that you meet this requirement and
          have the legal authority to accept these Terms.
        </p>
      </>
    ),
  },

  {
    title: '3. Account Registration and Security',
    body: (
      <>
        <h4>Account Creation</h4>
        <p>
          Some features, including rewards, Civic Wallet, and community guilds,
          require you to create an account using accurate and up-to-date
          information.
        </p>

        <h4>Account Security</h4>
        <p>
          You are responsible for maintaining the confidentiality of your login
          credentials and for all activities performed using your account.
          Notify CivicPlay immediately if you suspect unauthorized access.
        </p>

        <h4>One Account Rule</h4>
        <p>
          Each individual may maintain only one CivicPlay account to preserve
          fairness within the rewards system and leaderboards.
        </p>
      </>
    ),
  },

  {
    title: '4. CivicPoints and Rewards Ecosystem',
    body: (
      <>
        <h4>Earning Points</h4>
        <p>
          CivicPoints are awarded after successful verification of civic
          missions through our AI Verification Engine.
        </p>

        <h4>No Cash Value</h4>
        <p>
          CivicPoints are digital platform rewards only. They cannot be
          exchanged directly for cash or legal currency.
        </p>

        <h4>Reward Redemption</h4>
        <p>
          CivicPoints may be redeemed for available discounts, coupons,
          municipal benefits, or partner rewards through the Civic Wallet.
        </p>

        <h4>Expiration & Forfeiture</h4>
        <p>
          We reserve the right to expire inactive CivicPoints after 12 months
          of account inactivity and immediately revoke points obtained through
          fraud or abuse.
        </p>
      </>
    ),
  },

  {
    title: '5. User Conduct and Content',
    body: (
      <>
        <p>By using CivicPlay, you agree that you will not:</p>

        <ul>
          <li>Submit false or manipulated reports or AI verification media.</li>
          <li>Harass, threaten, or abuse other users or staff.</li>
          <li>
            Upload illegal, offensive, defamatory, or copyrighted material.
          </li>
          <li>Attempt to hack, reverse engineer, or disrupt the Platform.</li>
        </ul>

        <h4>User-Generated Content</h4>

        <p>
          By uploading photos, videos, or written reports, you grant CivicPlay
          a non-exclusive, worldwide, royalty-free license to display,
          process, and share such content where appropriate, including
          anonymized sharing with municipal partners and public impact maps.
        </p>
      </>
    ),
  },

  {
    title: '6. Municipal and B2B Partner Interactions',
    body: (
      <>
        <p>
          CivicPlay works alongside municipalities and partner businesses to
          provide civic incentives and reward opportunities.
        </p>

        <p>
          We are not responsible for the execution of municipal services such
          as repairing reported infrastructure, nor for the fulfillment of
          third-party merchant offers, which remain subject to each partner's
          individual terms.
        </p>
      </>
    ),
  },

  {
    title: '7. Termination and Suspension',
    body: (
      <>
        <p>
          CivicPlay may suspend or permanently terminate accounts that violate
          these Terms, engage in fraudulent activity, abuse CivicPoints, or
          negatively impact the community. Such actions may occur without prior
          notice where necessary.
        </p>
      </>
    ),
  },

  {
    title: '8. Disclaimer of Warranties',
    body: (
      <>
        <p>
          CivicPlay is provided on an <strong>"AS IS"</strong> and{" "}
          <strong>"AS AVAILABLE"</strong> basis.
        </p>

        <p>
          We do not guarantee uninterrupted service, complete accuracy of AI
          verification, or the continuous availability of specific rewards or
          partner services.
        </p>
      </>
    ),
  },

  {
    title: '9. Limitation of Liability',
    body: (
      <>
        <p>
          To the maximum extent permitted by law, CivicPlay shall not be liable
          for indirect, incidental, consequential, special, or punitive
          damages, including loss of data, profits, goodwill, or business
          opportunities resulting from your use of the Platform.
        </p>
      </>
    ),
  },

  {
    title: '10. Governing Law and Jurisdiction',
    body: (
      <>
        <p>
          These Terms shall be governed by the laws of India. Any disputes
          arising from these Terms shall fall under the jurisdiction of the
          courts located in <strong>[Insert City/State]</strong>.
        </p>
      </>
    ),
  },

  {
    title: '11. Changes to Terms',
    body: (
      <>
        <p>
          We may modify these Terms at any time. Material changes will be
          communicated through email or a notice on the Platform.
        </p>

        <p>
          Continued use of CivicPlay after changes become effective constitutes
          your acceptance of the updated Terms.
        </p>
      </>
    ),
  },

  {
    title: '12. Contact Information',
    body: (
      <>
        <p>
          If you have any questions regarding these Terms, please contact us:
        </p>

        <p>
          <strong>CivicPlay Legal Team</strong>
          <br />
          eco.civicplay@gmail.com
        </p>
      </>
    ),
  },
];

export default function Terms() {
  const scope = useRef(null);
  useScrollReveal(scope);

  return (
    <div ref={scope} className="legal-page">
      <section className="section">
        <div className="container legal__container">
          <SectionHeading
            eyebrow="Legal"
            title="Terms of"
            highlight="Service"
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