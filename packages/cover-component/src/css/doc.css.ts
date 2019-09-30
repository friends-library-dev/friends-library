import { Css } from '@friends-library/types';
import { css } from './lib/helpers';

export default function(dims: Record<string, number>): Css {
  return css`
    .Cover .back,
    .Cover .front,
    .Cover .spine {
      height: ${dims.height}in;
    }

    .Cover .back,
    .Cover .front {
      width: ${dims.width}in;
    }

    .Cover .spine {
      width: ${dims.pdfSpineWidth}in;
    }
  `;
}
