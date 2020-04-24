import React from 'react';
import { t } from '@friends-library/locale';
import Item from './Item';
import Button from '../Button';
import Dual from '../Dual';
import Back from '../checkout/Back';
import Progress from '../checkout/Progress';
import Header from '../checkout/Header';
import CartItem, { CartItemData } from '../checkout/models/CartItem';
import NoProfit from '../checkout/NoProfit';

interface Props {
  checkout: () => void;
  onContinueBrowsing: () => void;
  subTotal: number;
  items: CartItemData[];
  setItems: (items: CartItemData[]) => void;
}

const CartComponent: React.FC<Props> = ({
  checkout,
  onContinueBrowsing,
  items,
  setItems,
  subTotal,
}) => (
  <>
    <Header>{t`Your Order`}</Header>
    <NoProfit />
    <Dual.p className="bg-orange-600 text-white py-3 px-6 mb-4">
      <>
        Due to the COVID-19 pandemic, the United States Postal Service has temporarily
        suspended international shipping. For this reason we are only able to process
        orders <i>to the United States</i> at this time. Sorry for the inconvenience.
      </>
      <>
        Debido a la pandemia de COVID-19, el Servicio Postal de los Estados Unidos ha
        suspendido temporalmente el envío internacional. Por esta razón, lamentablemente,
        no podemos procesar pedidos de otros países en este momento.
      </>
    </Dual.p>
    <Progress step="Order" />
    <div className="ColumnHeadings flex text-gray-900 text-center antialiased mt-6 border-b border-gray-300 pb-2">
      <div className="w-2/3 md:w-3/5 text-left">{t`Item`}</div>
      <div className="w-1/3 md:w-2/5 flex">
        <div className="w-1/2 md:w-1/3 order-2 md:order-1">{t`Price`}</div>
        <div className="w-1/2 md:w-1/3 order-1">
          <span className="md:hidden">{t`Qty.`}</span>
          <span className="hidden md:inline">{t`Quantity`}</span>
        </div>
        <div className="hidden md:block md:w-1/3 order-2">{t`Remove`}</div>
      </div>
    </div>
    {items.map((item, index) => (
      <Item
        key={`item-${index}`}
        edition={item.edition}
        price={new CartItem(item).price()}
        {...item}
        displayTitle={item.displayTitle}
        title={item.title[0]}
        changeQty={(qty: number) => {
          items[index].quantity = qty;
          setItems([...items]);
        }}
        remove={() => {
          items.splice(index, 1);
          setItems([...items]);
        }}
      />
    ))}
    <div className="text-right font-sans text-lg mb-5 py-4 border-b ">
      <span className="font-bold tracking-wider">{t`Total`}:</span>
      <span className="pl-4 font-sans text-gray-700 text-md md:text-lg antialiased md:tracking-wider">
        ${(subTotal / 100).toFixed(2)}
      </span>
    </div>
    <Back onClick={onContinueBrowsing}>{t`Continue Browsing`}</Back>
    <Button className="mb-5 mx-auto" shadow onClick={checkout}>
      {t`Delivery`} &nbsp;&rsaquo;
    </Button>
  </>
);

export default CartComponent;

export const SubLine: React.FC<{ label: string; className?: string }> = ({
  label,
  children,
  className,
}) => (
  <div className={`${className || ''} text-gray-700 text-sm flex`}>
    <span className="flex-grow">{label}</span>
    {children}
  </div>
);
