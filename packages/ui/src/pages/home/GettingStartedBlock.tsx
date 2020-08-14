import React from 'react';
import { t } from '@friends-library/locale';
import Dual from '../../Dual';
import DuoToneWaveBlock from '../../blocks/DuoToneWaveBlock';
import Heading from '../../Heading';
import Button from '../../Button';

const GettingStartedBlock: React.FC = () => (
  <DuoToneWaveBlock className="px-6 py-16 sm:p-16 md:pb-64">
    <Heading left={[`md`]} className="text-gray-900 md:text-left">
      <Dual.Frag>
        <>Getting started</>
        <>Comenzar</>
      </Dual.Frag>
    </Heading>
    <Dual.P className="font-serif antialiased text-xl sm:text-2xl px-2 text-gray-700 leading-relaxed text-center md:text-left md:max-w-2xl">
      <>
        Not sure where to begin? We’ve hand-picked a small number of our favorite books
        and split them up into four different categories to help you decide what to read
        first.
      </>
      <>
        ¿No sabes por dónde empezar? Hemos seleccionado algunos de nuestros libros
        favoritos y los hemos divido en diferentes categorías para ayudarte a decidir qué
        leer primero.
      </>
    </Dual.P>
    <Button to={t`/getting-started`} width={330} className="mx-auto mt-10 md:mx-0" shadow>
      {t`Recommendations`} &rarr;
    </Button>
  </DuoToneWaveBlock>
);

export default GettingStartedBlock;
