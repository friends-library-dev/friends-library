import React from 'react';
import { styled } from '@friends-library/ui';
import { withTheme } from 'emotion-theming';
import { CartItem } from '../checkout/types';
import ItemQuantity from './ItemQuantity';
import { Theme } from 'theme';

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  height: 50px;
  padding: 3px;

  .cover {
    width: 30px;
    background: green;
  }

  dl {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 10px 0 5px;
    flex-grow: 1;
    margin: 0;
    text-transform: uppercase;
    font-family: sans-serif;
    font-weight: 200;
    font-size: 12px;
  }

  dd {
    margin: 0;
    font-size: 10px;
    opacity: 0.85;
  }

  .price {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;
  }

  .remove {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 2em;
    font-size: 12px;
    color: red;
    text-align: center;
    cursor: pointer;
  }
`;

type Props = CartItem & {
  theme: Theme;
  changeQty: (qtn: number) => void;
  remove: () => void;
};

const Component: React.FC<Props> = ({
  title,
  author,
  price,
  quantity,
  theme,
  edition,
  changeQty,
  remove,
}) => {
  return (
    <Item>
      <div className="cover" style={{ background: theme[edition].hex }}></div>
      <dl>
        <dt>{title}</dt>
        <dd>{author}</dd>
      </dl>
      <ItemQuantity quantity={quantity} changeQuantity={changeQty} />
      <div className="price">
        <code>${price}</code>
      </div>
      <div className="remove" onClick={remove}>
        &#x2715;
      </div>
    </Item>
  );
};

export default withTheme(Component);
