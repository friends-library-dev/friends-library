import React from 'react';
import Button from '../../Button';
import Heading from '../../Heading';
import './WhoWereTheQuakersBlock.css';

const WhoWereTheQuakersBlock: React.FC = () => (
  <section className="WhoWereTheQuakersBlock bg-flmaroon text-white flex flex-col items-center py-12 sm:py-16 px-12  md:px-16 lg:px-20 lg:py-24">
    <Heading darkBg>Who were the Quakers?</Heading>
    <p className="font-serif text-lg sm:text-xl opacity-75 leading-relaxed max-w-6xl">
      The early Quakers arose in the mid 1600's in England. Dissatisfied with lifeless
      religion, outward forms and ceremonies, they set about to return to the simple
      purity of New Testament Christianity. They came to see that the same Jesus Christ
      who died on the cross for our sins also appears by his Spirit in our hearts, and
      that, when yielded to, this heavenly light and grace becomes our salvation as it
      purifies and truly changes us from within.
    </p>

    <Button to="/quakers" className="mt-12" bg="blue" shadow>
      Find out more
    </Button>
  </section>
);

export default WhoWereTheQuakersBlock;
