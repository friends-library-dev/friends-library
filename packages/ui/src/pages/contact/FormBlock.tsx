import React from 'react';
import { t, Dual } from '../../translation';
import Form from './Form';
import Stack from '../../layout/Stack';
import './FormBlock.css';

interface Props {
  onSubmit: (formData: Record<string, string>) => Promise<boolean>;
}

const ContactFormBlock: React.FC<Props> = ({ onSubmit }) => (
  <div className="ContactFormBlock">
    <div className="flex flex-col lg:flex-row lg:py-24 lg:px-6 max-w-screen-lg mx-auto">
      <div className="bg-white p-16 text-center lg:text-left body-text flex flex-col lg:w-1/3 lg:bg-flgray-100 lg:px-12">
        <h1 className="sans-widest text-2xl pb-3 mb-10 uppercase border-flprimary border-b-4 self-center">
          {t`Contact`}
        </h1>
        <Stack space="6" lg="8">
          <Dual.p key="p1">
            <>
              Got a question? &mdash; or are you having any sort of technical trouble with
              our books or website?
            </>
            <>
              ¿Tienes alguna pregunta? &mdash; ¿o estás teniendo algún tipo de problema
              técnico con nuestros libros o con el sitio?
            </>
          </Dual.p>
          <Dual.p key="p2">
            <>Want to reach out for any other reason?</>
            <>¿Quieres ponerte en contacto por alguna otra razón?</>
          </Dual.p>
          <Dual.p key="p3">
            <>
              We'd love to hear from you! You can expect to hear back within a day or two.
            </>
            <>
              ¡Nos encantaría escucharte! Puedes contar con nuestra respuesta en un día o
              dos.
            </>
          </Dual.p>
        </Stack>
      </div>
      <Form onSubmit={onSubmit} className="lg:flex-grow p-6 m-2 sm:m-6 lg:m-0 lg:py-12" />
    </div>
  </div>
);

export default ContactFormBlock;
