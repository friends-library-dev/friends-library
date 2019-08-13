import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import { Address } from './types';

// @ts-ignore
import { CountryDropdown } from 'react-country-region-selector';

const CollectAddress: React.FC<{
  onSubmit: (address: Address) => void;
  stored?: Address;
}> = ({ onSubmit, stored }) => {
  const [name, setName] = useState<string>(stored ? stored.name : '');
  const [street, setStreet] = useState<string>(stored ? stored.street : '');
  const [street2, setStreet2] = useState<string>(stored ? stored.street2 || '' : '');
  const [city, setCity] = useState<string>(stored ? stored.city : '');
  const [state, setState] = useState<string>(stored ? stored.state : '');
  const [zip, setZip] = useState<string>(stored ? stored.zip : '');
  const [country, setCountry] = useState<string>(stored ? stored.country : '');
  const nameRef = useRef<HTMLInputElement>(null);
  const filledOutCompletely = !!(name && street && city && state && zip && country);

  useEffect(() => {
    if (nameRef && nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  return (
    <div style={{}}>
      <h1 className="text-2xl mb-5 uppercase">Shipping Address</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (filledOutCompletely) {
            onSubmit({
              name,
              street,
              street2,
              city,
              state,
              zip,
              country,
            });
          }
        }}
      >
        <input
          className="input mb-2"
          ref={nameRef}
          type="text"
          onChange={e => setName(e.target.value)}
          value={name}
          placeholder="Full name"
        />
        <input
          className="input mb-2"
          type="text"
          onChange={e => setStreet(e.target.value)}
          value={street}
          placeholder="Street address, P.O. box, c/o"
        />
        <input
          className="input mb-2"
          type="text"
          onChange={e => setStreet2(e.target.value)}
          value={street2}
          placeholder="Apartment, suite, unit, etc."
        />
        <input
          className="input mb-2"
          type="text"
          onChange={e => setCity(e.target.value)}
          value={city}
          placeholder="City"
        />
        <input
          className="input mb-2"
          type="text"
          onChange={e => setState(e.target.value)}
          value={state}
          placeholder="State / Province / Region"
        />
        <input
          className="input mb-2"
          type="text"
          onChange={e => setZip(e.target.value)}
          value={zip}
          placeholder="ZIP / Postal Code"
        />
        <CountryDropdown
          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-6"
          value={country}
          onChange={(country: string) => setCountry(country)}
        />
        <Button className="bg-flblue" disabled={!filledOutCompletely}>
          Next &rarr;
        </Button>
      </form>
    </div>
  );
};

export default CollectAddress;
