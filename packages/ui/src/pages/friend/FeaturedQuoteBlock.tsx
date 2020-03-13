import React from 'react';
import Quotes from './Quotes';
import './FeaturedQuoteBlock.css';

interface Props {
  cite: string;
  quote: string;
}

const FeaturedQuoteBlock: React.FC<Props> = ({ cite, quote }) => {
  return (
    <blockquote className="FeaturedQuoteBlock text-justify bg-flgreen-600 text-white px-12 py-20 md:py-20 md:px-48 antialiased font-sans leading-loose text-md relative flex flex-col items-center">
      <div>
        <p className="relative max-w-4xl">
          <Quotes className="LeftQuote" />
          <Quotes className="hidden md:block RightQuote" />
          <span
            className="relative block font-serif text-lg"
            dangerouslySetInnerHTML={{ __html: quote }}
          />
        </p>
        <cite className="not-italic block mt-4">- {cite}</cite>
      </div>
    </blockquote>
  );
};

export default FeaturedQuoteBlock;
