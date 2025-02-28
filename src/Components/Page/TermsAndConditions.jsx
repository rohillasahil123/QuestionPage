import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      {/* <p className="mb-4 text-sm text-gray-600">Effective Date: [Insert Effective Date]</p> */}

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
        <p>
          Welcome to GoQuizzyTechnology’s Quiz Game! By accessing and using our services – including our quiz game, money transactions (adding funds, withdrawing money, and awarding winnings) – you agree to be bound by these Terms and Conditions. If you do not agree with any of these terms, please refrain from using our service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Eligibility</h2>
        <p>
          Our quiz game and related monetary services are available only to users who are at least 18 years old or who have obtained the consent of a parent or guardian. By using our services, you represent that you meet these requirements.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Account Registration</h2>
        <p>
          To participate in our quiz game and conduct transactions, you may be required to create an account. You agree to provide accurate and up-to-date information during registration and keep it current at all times.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Monetary Transactions</h2>
        <p>
          Our platform facilitates monetary transactions such as adding funds, withdrawing money, and awarding winnings. All transactions are processed through secure payment gateways. While we implement industry-standard security measures, you acknowledge that no online system is completely secure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Game Rules and Conduct</h2>
        <p>
          By participating in our quiz game, you agree to abide by our rules and guidelines. Any attempts to cheat, manipulate the game, or engage in fraudulent activities may result in account suspension and forfeiture of winnings.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Intellectual Property</h2>
        <p>
          All content, including text, graphics, logos, and software on our platform, is the property of GoQuizzy or its licensors and is protected by intellectual property laws. You agree not to reproduce, distribute, or create derivative works without our explicit permission.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Limitation of Liability</h2>
        <p>
          In no event shall GoQuizzy, its affiliates, or licensors be liable for any indirect, incidental, special, or consequential damages arising from your use of our service. Use of our service is entirely at your own risk.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Governing Law</h2>
        <p>
          These Terms and Conditions are governed by the laws of the jurisdiction in which GoQuizzy operates. Any disputes arising from these terms shall be resolved in the courts of the appropriate jurisdiction.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Changes to These Terms</h2>
        <p>
          We reserve the right to update or modify these Terms and Conditions at any time. Any changes will be posted on this page with an updated effective date. Your continued use of our services after changes have been made constitutes your acceptance of the new terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
        <p>
          If you have any questions or concerns regarding these Terms and Conditions, please contact us at{" "}
          <a href="mailto:goquizzytechnology.com" className="text-blue-600 underline">
            goquizzytechnology.com
          </a>.
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;
