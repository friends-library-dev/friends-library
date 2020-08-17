import React from 'react';
import { t } from '@friends-library/locale';
import Dual from '../Dual';
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
    <Dual.P className="body-text text-center mt-10">
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
    </Dual.P>
    <Button className="mx-auto mt-10" shadow onClick={onClose}>
      {t`Close`}
    </Button>
  </div>
);

export default Confirmation;
