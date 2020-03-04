import React from 'react';
import Button from '../../Button';
import './CompilationsBlock.css';

const CompilationsBlock: React.FC = () => (
  <div className="CompilationsBlock text-center text-white px-16 py-24 md:py-24 xl:py-32">
    <h1 className="sans-wider text-4xl font-bold">Compilations</h1>
    <p className="body-text text-white py-8 text-lg leading-loose max-w-screen-sm mx-auto">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
    <Button to="/compilations" className="mt-4 mx-auto">
      Learn More
    </Button>
  </div>
);

export default CompilationsBlock;
