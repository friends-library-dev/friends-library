import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import Input from './Input';
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
      <h1 style={{ marginTop: 0 }}>Shipping Address</h1>
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
        <Input
          ref={nameRef}
          type="text"
          onChange={e => setName(e.target.value)}
          value={name}
          placeholder="Full name"
        />
        <Input
          type="text"
          onChange={e => setStreet(e.target.value)}
          value={street}
          placeholder="Street address, P.O. box, c/o"
        />
        <Input
          type="text"
          onChange={e => setStreet2(e.target.value)}
          value={street2}
          placeholder="Apartment, suite, unit, etc."
        />
        <Input
          type="text"
          onChange={e => setCity(e.target.value)}
          value={city}
          placeholder="City"
        />
        <Input
          type="text"
          onChange={e => setState(e.target.value)}
          value={state}
          placeholder="State / Province / Region"
        />
        <Input
          type="text"
          onChange={e => setZip(e.target.value)}
          value={zip}
          placeholder="ZIP / Postal Code"
        />
        <CountryDropdown
          value={country}
          onChange={(country: string) => setCountry(country)}
          style={{ fontSize: '13.7px', padding: '5px', margin: '8px 0' }}
        />
        <Button disabled={!filledOutCompletely}>Next &rarr;</Button>
      </form>
    </div>
  );
};

export default CollectAddress;
