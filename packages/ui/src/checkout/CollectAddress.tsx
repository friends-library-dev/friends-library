import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import Input from './Input';

// @ts-ignore
import { CountryDropdown } from 'react-country-region-selector';

interface Address {
  name: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const CollectAddress: React.FC<{ onSubmit: (address: Address) => void }> = ({
  onSubmit,
}) => {
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zip, setZip] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const nameRef = useRef<HTMLInputElement>(null);
  const filledOutCompletely = !!(name && address && city && state && zip && country);

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
              address,
              address2,
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
          onChange={e => setAddress(e.target.value)}
          value={address}
          placeholder="Street address, P.O. box, c/o"
        />
        <Input
          type="text"
          onChange={e => setAddress2(e.target.value)}
          value={address2}
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
          onChange={setCountry}
          style={{ fontSize: '13.7px', padding: '5px', margin: '8px 0' }}
        />
        <Button disabled={!filledOutCompletely}>Next &rarr;</Button>
      </form>
    </div>
  );
};

export default CollectAddress;
