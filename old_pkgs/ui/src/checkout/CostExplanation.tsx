import React from 'react';
import Link from 'gatsby-link';
import Button from '../Button';

const CostExplanation: React.FC<{ onGotIt: () => void }> = ({ onGotIt }) => (
  <div>
    <h1 className="text-2xl mb-5 uppercase">About Our Pricing</h1>
    <p className="mb-6">
      We are committed to never making a profit from the books we make available on this
      website. For that reason, when you order one or more paperback books, we charge you{' '}
      <i>only and exactly</i> what we calculate it will cost us to have the books printed
      and shipped from our printing partner.
    </p>
    <Button className="bg-flblue" onClick={onGotIt}>
      Got it &rarr;
    </Button>
    <p style={{ opacity: 0.7, fontSize: '0.95em', marginTop: 30 }}>
      In certain cases, we are also willing to send paperback copies free of charge.{' '}
      <Link to="/contact">Contact us</Link> to find out more.
    </p>
  </div>
);

export default CostExplanation;
