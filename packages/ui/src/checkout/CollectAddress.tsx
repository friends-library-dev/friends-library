import React, { useState } from 'react';
import cx from 'classnames';
import Button from '../Button';
import Header from './Header';
import Progress from './Progress';
import Input from './Input';
import Back from './Back';
import NoProfit from './NoProfit';
import { Address } from './types';
import './CollectAddress.css';

// @ts-ignore
import { CountryDropdown } from 'react-country-region-selector';

const CollectAddress: React.FC<{
  onSubmit: (address: Address) => void;
  stored?: Address;
}> = ({ onSubmit, stored }) => {
  const [email, setEmail] = useState<string>(stored ? stored.email : '');
  const [emailBlurred, setEmailBlurred] = useState<boolean>(false);
  const [name, setName] = useState<string>(stored ? stored.name : '');
  const [nameBlurred, setNameBlurred] = useState<boolean>(false);
  const [street, setStreet] = useState<string>(stored ? stored.street : '');
  const [streetBlurred, setStreetBlurred] = useState<boolean>(false);
  const [street2, setStreet2] = useState<string>(stored ? stored.street2 || '' : '');
  const [city, setCity] = useState<string>(stored ? stored.city : '');
  const [cityBlurred, setCityBlurred] = useState<boolean>(false);
  const [state, setState] = useState<string>(stored ? stored.state : '');
  const [stateBlurred, setStateBlurred] = useState<boolean>(false);
  const [zip, setZip] = useState<string>(stored ? stored.zip : '');
  const [zipBlurred, setZipBlurred] = useState<boolean>(false);
  const [country, setCountry] = useState<string>(stored ? stored.country : '');
  const [countryBlurred, setCountryBlurred] = useState<boolean>(false);
  const filledOutCompletely = !!(name && street && city && state && zip && country);

  return (
    <div>
      <Header>Delivery</Header>
      <NoProfit className="hidden md:block" />
      <Progress step="Delivery" />
      <form
        className="mt-8"
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
              email,
            });
          }
        }}
      >
        <div className="InputWrap md:flex flex-wrap justify-between">
          <Input
            autofocus
            className="order-1"
            onChange={val => setName(val)}
            onBlur={() => setNameBlurred(true)}
            onFocus={() => setNameBlurred(false)}
            value={name}
            valid={!nameBlurred || !!name}
            placeholder="Full name"
            invalidMsg="Name is required"
          />
          <Input
            className="order-3"
            onChange={val => setStreet(val)}
            onFocus={() => setStreetBlurred(false)}
            onBlur={() => setStreetBlurred(true)}
            value={street}
            placeholder="Street address, P.O. Box, C/O"
            invalidMsg="Street address is required"
            valid={!streetBlurred || !!street}
          />
          <Input
            className="order-4"
            invalidMsg=""
            valid={true}
            onChange={val => setStreet2(val)}
            value={street2}
            placeholder="Apartment, suite, unit, etc."
          />
          <Input
            className="order-5"
            invalidMsg="City is required"
            valid={!cityBlurred || !!city}
            onChange={val => setCity(val)}
            onFocus={() => setCityBlurred(false)}
            onBlur={() => setCityBlurred(true)}
            value={city}
            placeholder="City"
          />
          <Input
            className="order-6"
            invalidMsg="State / Province / Region is required"
            valid={!stateBlurred || !!state}
            onChange={val => setState(val)}
            onFocus={() => setStateBlurred(false)}
            onBlur={() => setStateBlurred(true)}
            value={state}
            placeholder="State / Province / Region"
          />
          <Input
            className="order-7"
            invalidMsg="ZIP / Postal Code is required"
            valid={!zipBlurred || !!zip}
            onChange={val => setZip(val)}
            onFocus={() => setZipBlurred(false)}
            onBlur={() => setZipBlurred(true)}
            value={zip}
            placeholder="ZIP / Postal Code"
          />
          <CountryDropdown
            className={cx(
              'CartInput text-gray-500 order-8',
              countryBlurred && !country && 'invalid text-red-600',
            )}
            value={country}
            onChange={(country: string) => setCountry(country)}
            onFocus={() => setCountryBlurred(false)}
            onBlur={() => setCountryBlurred(true)}
            priorityOptions={['US', 'GB']}
          />
          <Input
            className="order-2"
            invalidMsg={email ? 'Valid email is required' : 'Email is required'}
            valid={!emailBlurred || !!email.match(/^\S+@\S+$/)}
            onChange={val => setEmail(val)}
            onFocus={() => setEmailBlurred(false)}
            onBlur={() => setEmailBlurred(true)}
            value={email}
            placeholder="Email"
            type="email"
          />
        </div>
        <Back>Back to Order</Back>
        <Button className="bg-flprimary mx-auto" disabled={!filledOutCompletely}>
          Payment &nbsp;&rsaquo;
        </Button>
      </form>
    </div>
  );
};

export default CollectAddress;
