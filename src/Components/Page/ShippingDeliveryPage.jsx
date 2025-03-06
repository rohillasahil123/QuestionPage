import React from 'react';

const ShippingDeliveryPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Shipping & Delivery</h1>
      {/* <p className="mb-4 text-sm text-gray-600">Effective Date: [Insert Effective Date]</p> */}

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Shipping Information</h2>
        <p>
          We strive to process and ship your orders as quickly as possible. Once your order is placed, it is processed within 1-2 business days.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Delivery Options</h2>
        <p>
          We offer a range of delivery options to suit your needs, including standard and express shipping. You can choose your preferred delivery method at checkout.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Estimated Delivery Time</h2>
        <p>
          Delivery times depend on your location and the shipping method selected. Typically, standard shipping takes 3-7 business days, while express shipping takes 1-3 business days.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Shipping Charges</h2>
        <p>
          Shipping fees are calculated at checkout based on your selected shipping method and destination. We also offer occasional free shipping promotions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Order Tracking</h2>
        <p>
          Once your order has shipped, you will receive a tracking number via email. Use this number on our website to track the status of your delivery.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p>
          If you have any questions or concerns regarding shipping or delivery, please contact our customer support at{" "}
          <a href="mailto:goquizzytechnology@gmail.com" className="text-blue-600 underline">
            goquizzytechnology@gmail.com
          </a>.
        </p>
      </section>
    </div>
  );
};

export default ShippingDeliveryPage;
