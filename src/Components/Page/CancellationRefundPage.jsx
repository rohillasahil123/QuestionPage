import React from 'react';

const CancellationRefundPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Cancellation & Refund Policy</h1>
      {/* <p className="mb-4 text-sm text-gray-600">Effective Date: [Insert Effective Date]</p> */}
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Order Cancellation</h2>
        <p>
          You may cancel your order within a specified timeframe after purchase. Please review our cancellation terms carefully. Once an order is cancelled, no further action will be taken and any pending fees will be refunded according to our policy.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Refund Policy</h2>
        <p>
          Refunds will be processed based on our refund policy guidelines. If you are eligible, the refund will be issued within a set number of business days after the cancellation is confirmed. Note that certain fees or promotional discounts may be non-refundable.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Conditions for Refunds</h2>
        <p>
          To qualify for a refund, you must:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Request cancellation within the allowed timeframe</li>
          <li>Meet the eligibility criteria outlined in our policy</li>
          <li>Provide any required documentation, if requested</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Non-Refundable Items</h2>
        <p>
          Please note that certain products or services may be non-refundable. We recommend reviewing the details associated with your purchase for more information.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p>
          If you have any questions or concerns regarding our cancellation or refund policy, please contact us at{" "}
          <a href="mailto:goquizzytechnology@gmail.com" className="text-blue-600 underline">
            goquizzytechnology@gmail.com
          </a>.
        </p>
      </section>
    </div>
  );
};

export default CancellationRefundPage;
