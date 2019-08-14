import React from 'react';
import './WhoWereTheQuakers.css';
import Button from '../Button';
import Heading from '../Heading';

const WhoWereTheQuakers: React.FC = () => (
  <section className="Block-quakers bg-flmaroon text-white flex flex-col items-center py-16 px-12  md:px-16 lg:px-20 lg:py-24">
    <Heading darkBg>Who were the Quakers?</Heading>
    <p className="font-serif text-xl opacity-75 leading-relaxed max-w-6xl">
      The early Quakers arose in the mid 1600's in England. Dissatisfied with lifeless
      religion, outward forms and ceremonies; they set about to return to the simple
      purity of New Testament Christianity. They came to see that the same Jesus Christ
      who died on the cross for our sins also appears by his spirit in our hearts, and
      that, when yielded to, this heavenly light and grace becomes our salvation as it
      purifies and truly changes us from within.
    </p>

    <Button className="mt-12 bg-flblue">Find out more</Button>
  </section>
);

export default WhoWereTheQuakers;
