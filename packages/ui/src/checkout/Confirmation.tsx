import React from 'react';
import { t, Dual } from '../translation';
import Button from '../Button';
import Header from './Header';
import Progress from './Progress';

const Confirmation: React.FC<{ onClose: () => void; email: string }> = ({
  onClose,
  email,
}) => (
  <div className="md:py-12">
    <Header>{t`Confirmed!`}</Header>
    <Progress step="Confirmation" />
    <Dual.p className="bg-orange-600 font-sans text-white py-4 px-8 mt-10 -mb-2">
      <>
        Note: Due to complications with shipping having to do with the ongoing COVID-19
        pandemic, your book order may arrive as much as 10-15 days later than normal.
        We’re sorry for the inconvenience.
      </>
      <>
        Nota: Debido a las complicaciones que tienen los envíos por la pandemia del
        COVID-19, tu pedido de libros puede demorar en llegar hasta 10-15 días más de lo
        normal. Lamentamos las molestias que esto pueda ocasionarte.
      </>
    </Dual.p>
    <Dual.p className="body-text text-center mt-10">
      <>
        We’ve processed your order. You will receive an email to <code>{email}</code> with
        a confirmation shortly, and in a few days we’ll also send you a tracking number
        for your package once it ships. We really hope you enjoy and benefit from the book
        you ordered!
      </>
      <>
        Hemos procesado tu pedido. En breve recibirás un correo electrónico a
        <code>{email}</code> con la confirmación, y en unos pocos días, también te
        enviaremos el número de seguimiento de tu paquete, una vez que haya sido enviado.
        ¡Realmente esperamos que disfrutes y obtengas provecho del libro que has pedido!
      </>
    </Dual.p>
    <Button className="mx-auto mt-10" shadow onClick={onClose}>
      {t`Close`}
    </Button>
  </div>
);

export default Confirmation;
