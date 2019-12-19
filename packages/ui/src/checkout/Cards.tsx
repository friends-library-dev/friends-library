import React from 'react';

export const Visa: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`${className ? `${className} ` : ''}card inline-block mr-1`}
    id="card-visa"
    viewBox="0 7 38 23"
    width="38"
    height="26"
  >
    <rect fill="#122a96" y="7" width="38" height="24" rx="5" />
    <path
      fill="#fff"
      d="M15.76,15.56l-2.87,6.89H11L9.61,17a.75.75,0,0,0-.42-.61,7.69,7.69,0,0,0-1.74-.59l0-.2h3a.84.84,0,0,1,.82.71l.74,4,1.84-4.69Zm7.33,4.64c0-1.81-2.5-1.91-2.48-2.73,0-.24.24-.51.75-.57a3.32,3.32,0,0,1,1.75.3l.31-1.46a4.93,4.93,0,0,0-1.66-.3c-1.75,0-3,.93-3,2.28,0,1,.88,1.54,1.55,1.87s.92.56.92.86c0,.46-.55.66-1.06.67a3.66,3.66,0,0,1-1.82-.43L18,22.2a5.41,5.41,0,0,0,2,.36c1.86,0,3.07-.92,3.08-2.36m4.62,2.25h1.63l-1.42-6.89H26.41a.82.82,0,0,0-.76.51L23,22.45h1.86l.36-1h2.27Zm-2-2.44.94-2.58L27.2,20Zm-7.44-4.45-1.46,6.89H15.06l1.46-6.89Z"
    />
  </svg>
);

export const Amex: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`${className ? `${className} ` : ''}card inline-block mr-1`}
    id="card-amex"
    viewBox="0 7 38 23"
    width="38"
    height="26"
  >
    <rect fill="#00adef" y="7" width="38" height="24" rx="5" />
    <path
      fill="#fff"
      d="M18.66,16.5H18l-1.49,3.19L15,16.5H13v4.23L11.08,16.5H9.18L7,21.5H8.49l.45-1.11h2.34l.48,1.11h2.49V17.89l1.67,3.61h1.21l1.53-3.31V21.5H20v-5H18.66ZM9.41,19.25l.67-1.66.71,1.66Z"
    />
    <path
      fill="#fff"
      d="M31,16.5H29.24L27.82,18,26.43,16.5H20.92v5h5.4l1.48-1.58,1.44,1.58H31L28.69,19ZM25,21v-.65H22.21v-.79H25V18.43H22.21v-.79H25v-.75L26.93,19Z"
    />
  </svg>
);

export const Mastercard: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`${className ? `${className} ` : ''}card inline-block mr-1`}
    id="card-mastercard"
    viewBox="0 7 38 23"
    width="38"
    height="26"
  >
    <rect fill="#efefef" x="0.5" y="7.5" width="37" height="23" rx="4.5" />
    <path
      fill="#f7f7f7"
      d="M33,8a4,4,0,0,1,4,4V26a4,4,0,0,1-4,4H5a4,4,0,0,1-4-4V12A4,4,0,0,1,5,8H33m0-1H5a5,5,0,0,0-5,5V26a5,5,0,0,0,5,5H33a5,5,0,0,0,5-5V12a5,5,0,0,0-5-5Z"
    />
    <path
      fill="#f79e1b"
      d="M27.31,19A4.75,4.75,0,0,1,19,22.14a4.74,4.74,0,0,0,0-6.28A4.75,4.75,0,0,1,27.31,19Z"
    />
    <ellipse fill="#ff5f00" cx="19" cy="19" rx="1.19" ry="3.14" />
    <path
      fill="#eb001b"
      d="M17.81,19A4.76,4.76,0,0,0,19,22.14a4.75,4.75,0,1,1,0-6.28A4.76,4.76,0,0,0,17.81,19Z"
    />
  </svg>
);

export const Discover: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`${className ? `${className} ` : ''}card inline-block mr-1`}
    id="card-discover"
    viewBox="0 7 38 23"
    width="38"
    height="26"
  >
    <defs>
      <style>{`.cls-1{fill:#f18a1b;}.cls-2{fill:#fff;}`}</style>
    </defs>
    <path fill="#f18a1b" d="M38,18.77V26a5,5,0,0,1-5,5H9.9A38.28,38.28,0,0,0,38,18.77Z" />
    <rect fill="#f9edde" y="7" width="38" height="24" rx="5" />
    <path
      fill="#f18a1b"
      d="M20.29,16.07a2.24,2.24,0,1,0,2.29,2.24A2.27,2.27,0,0,0,20.29,16.07Z"
    />
    <rect x="8.51" y="16.18" width="0.78" height="4.25" />
    <path d="M7.61,17.36a1.94,1.94,0,0,0-.5-.65,2.17,2.17,0,0,0-.71-.41,2.87,2.87,0,0,0-.83-.11H3.85v4.25H5.47a2.85,2.85,0,0,0,.81-.13,2.36,2.36,0,0,0,.75-.4,1.94,1.94,0,0,0,.76-1.6A2.3,2.3,0,0,0,7.61,17.36ZM6.84,19a1.61,1.61,0,0,1-.38.44,1.47,1.47,0,0,1-.57.24,2.5,2.5,0,0,1-.69.09H4.63V16.86h.7A2.78,2.78,0,0,1,6,17a2,2,0,0,1,.51.24,1.13,1.13,0,0,1,.34.46,1.44,1.44,0,0,1,.13.66A1.41,1.41,0,0,1,6.84,19Z" />
    <path d="M12.45,18.21A2.81,2.81,0,0,0,12,18a4.22,4.22,0,0,1-.5-.16,1.3,1.3,0,0,1-.39-.2.37.37,0,0,1-.15-.33.51.51,0,0,1,.06-.25.65.65,0,0,1,.16-.17.92.92,0,0,1,.23-.09,1.15,1.15,0,0,1,.26,0,1.08,1.08,0,0,1,.44.08.7.7,0,0,1,.33.25l.57-.58a1.6,1.6,0,0,0-.59-.34,2.26,2.26,0,0,0-1.26,0,1.5,1.5,0,0,0-.51.24,1.29,1.29,0,0,0-.37.4,1.15,1.15,0,0,0-.14.57,1.07,1.07,0,0,0,.16.6,1.19,1.19,0,0,0,.38.36,2.52,2.52,0,0,0,.5.22,4.92,4.92,0,0,1,.5.16,1.51,1.51,0,0,1,.38.21.44.44,0,0,1,.16.36.56.56,0,0,1-.07.26.77.77,0,0,1-.18.18.71.71,0,0,1-.25.11,1.26,1.26,0,0,1-.27,0,1.07,1.07,0,0,1-.49-.12,1,1,0,0,1-.37-.33L10,20a1.53,1.53,0,0,0,.65.45,2.28,2.28,0,0,0,.78.13,2.37,2.37,0,0,0,.61-.08,1.37,1.37,0,0,0,.51-.26,1.1,1.1,0,0,0,.35-.42,1.26,1.26,0,0,0,.13-.6,1.07,1.07,0,0,0-.15-.6A1.21,1.21,0,0,0,12.45,18.21Z" />
    <polygon points="28.05 18.59 30.06 18.59 30.06 17.91 28.05 17.91 28.05 16.86 30.17 16.86 30.17 16.18 27.28 16.18 27.28 20.43 30.28 20.43 30.28 19.75 28.05 19.75 28.05 18.59" />
    <path d="M33.18,18.55a1.09,1.09,0,0,0,.75-.38,1.16,1.16,0,0,0,.26-.77,1.21,1.21,0,0,0-.13-.6,1.3,1.3,0,0,0-.37-.37,1.76,1.76,0,0,0-.52-.2,4,4,0,0,0-.61,0H31v4.25h.78V18.63h.58l1,1.81h.94ZM32.76,18h-.94V16.83h.68l.3,0a1,1,0,0,1,.28.07.48.48,0,0,1,.22.17.49.49,0,0,1,.08.31.56.56,0,0,1-.08.32.66.66,0,0,1-.23.18Z" />
    <path d="M16.39,19.73a1.08,1.08,0,0,1-.52.13,1.41,1.41,0,0,1-1.39-.95,1.85,1.85,0,0,1-.11-.63,1.68,1.68,0,0,1,.11-.6,1.5,1.5,0,0,1,.3-.48,1.47,1.47,0,0,1,.48-.33,1.66,1.66,0,0,1,.61-.11,1.42,1.42,0,0,1,.45.08,1.35,1.35,0,0,1,.47.34l.6-.43a1.78,1.78,0,0,0-.7-.52,2,2,0,0,0-.83-.16,2.73,2.73,0,0,0-.92.16,2,2,0,0,0-.73.46,1.86,1.86,0,0,0-.48.71,2.29,2.29,0,0,0-.17.92,2.21,2.21,0,0,0,.17.91,1.9,1.9,0,0,0,.48.7,1.88,1.88,0,0,0,.73.45,2.51,2.51,0,0,0,.92.16,2.27,2.27,0,0,0,.91-.18,1.62,1.62,0,0,0,.72-.58l-.64-.44A1.37,1.37,0,0,1,16.39,19.73Z" />
    <polygon points="24.74 19.39 23.55 16.18 22.65 16.18 24.37 20.43 25.04 20.43 26.81 16.18 25.97 16.18 24.74 19.39" />
    <path fill="#f18a1b" d="M38,18.77V26a5,5,0,0,1-5,5H9.9A38.28,38.28,0,0,0,38,18.77Z" />
  </svg>
);

export const Card: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`${className ? `${className} ` : ''}card inline-block mr-1`}
    id="card-default"
    viewBox="0 7 38 23"
    width="38"
    height="26"
  >
    <rect fill="#4486e4" y="7" width="38" height="24" rx="5" />
    <rect fill="#0f3760" y="13" width="38" height="3" />
    <rect
      fill="#d4e3f4"
      x="25"
      y="22"
      width="8"
      height="3"
      transform="translate(58 47) rotate(-180)"
    />
  </svg>
);

export const CardRow: React.FC = () => (
  <>
    <Visa />
    <Mastercard />
    <Discover />
    <Amex />
    <Card />
  </>
);

export const FeedbackCard: React.FC<{ brand?: string }> = ({ brand }) => {
  const Component = brand
    ? {
        amex: Amex,
        discover: Discover,
        mastercard: Mastercard,
        visa: Visa,
      }[brand] || Card
    : Card;
  return (
    <Component
      className={`absolute top-0 right-0 mt-2 mr-2${
        isKnownBrand(brand) ? '' : ' opacity-25'
      }`}
    />
  );
};

function isKnownBrand(brand?: string): boolean {
  return !!(brand && ['amex', 'visa', 'mastercard', 'discover'].includes(brand));
}
