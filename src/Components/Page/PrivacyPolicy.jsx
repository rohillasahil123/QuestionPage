import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      {/* <p className="mb-4 text-sm text-gray-600">Effective Date: [Insert Effective Date]</p> */}

      <section className="mb-6">
        <p>
          Welcome to our Quiz Game! At GoQuizzy, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data while you enjoy our quiz game and related monetary services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email address, and payment details when you register for an account, add funds, or withdraw money. In addition, we collect non-personal data including IP address, browser type, and device information to improve our service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
        <p>
          Your information is used to:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Operate and improve our quiz game</li>
          <li>Process transactions securely (adding money, withdrawing money, and processing winnings)</li>
          <li>Send account updates, promotions, and service notifications</li>
          <li>Personalize your experience and enhance game security</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Money-Related Transactions</h2>
        <p>
          Since our game involves monetary transactions such as adding funds, withdrawing money, and winning cash prizes, we employ industry-standard security measures and trusted payment gateways to process these transactions. We do not store your full payment details and adhere to applicable financial and data protection regulations.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Data Security</h2>
        <p>
          We implement security measures to protect your personal information. However, please be aware that no online method of data transmission or storage is 100% secure. We continually review and update our security practices to help protect your information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Third-Party Services</h2>
        <p>
          We may share your information with third-party service providers that help us operate our website, process payments, or improve our service. These providers are required to protect your data and use it solely for the purposes for which it was disclosed.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of our services after any changes constitutes your acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at{" "}
          <a href="mailto:goquizzytechnology.com" className="text-blue-600 underline">
            goquizzytechnology.com
          </a>.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
