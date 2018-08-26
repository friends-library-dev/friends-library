// @flow
import * as React from 'react';
import { css } from 'glamor';
import { t } from 'c-3po';
import { Document } from '@friends-library/friends';
import { LANG } from '../env';
import PageTitle from './PageTitle';
import ByLine from './ByLine';
import Divider from './Divider';
import Block from './Block';

const address = css`
  margin-left: 1em;
  padding-left: 1em;
  font-style: normal;
  border-left: 1px dotted #ccc;
`;

const note = css`
  font-style: italic;
`;

type Props = {|
  document: Document,
|};

export default ({ document }: Props) => (
  <Block>
    <PageTitle>{t`Order paperback`}: {document.title}</PageTitle>
    <ByLine document={document} />
    {LANG === 'en' ? (
      <React.Fragment>
        <p>
          To purchase a print edition, please send a check made out to <i>Market Street Fellowship</i> at the following address:
        </p>
        <address className={address}>
          The Friends Library<br />
          981 W. Market Street<br />
          Akron, OH 44313<br />
          USA
        </address>
        <p>
          All printed editions are paperback, and cost $6 USD each.  Please add an additional $5 USD (per order) for shipping addresses outside of the United States.
        </p>
        <p className={note}>
          * Be sure to clearly indicate the book title, quantity desired, your shipping address, and a phone number or email address where we can reach you if there is a problem.
        </p>
        <Divider />
        <p>
          Online ordering and acceptance of credit card payments is coming soon -- thanks for your patience. Questions about printed books and ordering can be directed to <a href="mailto:MSFPrinting@gmail.com">MSFPrinting@gmail.com</a>.
        </p>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <p>
          Para comprar una edición impresa, envíe un cheque a <i> Market Street Fellowship </i> en la siguiente dirección:
        </p>
        <address className={address}>
          La Biblioteca de los Amigos<br />
          981 W. Market Street<br />
          Akron, OH 44313<br />
          USA
        </address>
        <p>
          Todas las ediciones impresas son de bolsillo y cuestan $6 USD cada una. Agregue un adicional de $5 USD (por pedido) para las direcciones de envío fuera de los Estados Unidos.
        </p>
        <p className={note}>
          * Asegúrese de indicar claramente el título del libro, la cantidad deseada, su dirección de envío y un número de teléfono o dirección de correo electrónico donde podamos comunicarnos con usted si hay algún problema.
        </p>
        <Divider />
        <p>
          Los pedidos en línea y la aceptación de los pagos con tarjeta de crédito llegarán pronto, gracias por su paciencia. Las preguntas sobre libros impresos y pedidos pueden ser dirigidas a <a href="mailto:MSFPrinting@gmail.com">MSFPrinting@gmail.com</a>.
        </p>
      </React.Fragment>
    )}
  </Block>
);
