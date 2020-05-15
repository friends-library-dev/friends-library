import { syntax as css } from '@friends-library/types';

const lessThanCss = css`
  .Cover .blurb--lt-375 .blurb {
    font-size: 3.3%;
  }

  .Cover .blurb--lt-350 .blurb {
    font-size: 3.4%;
  }

  .Cover .blurb--lt-300 .blurb {
    font-size: 3.6%;
  }

  .Cover .blurb--lt-225 .blurb {
    font-size: 3.9%;
    padding-left: 2.7em;
    padding-right: 2.7em;
  }

  .Cover .blurb--lt-200 .blurb {
    font-size: 4.4%;
    padding-left: 1.2em;
    padding-right: 1.2em;
  }
`;

const greaterThanCss = css`
  .Cover .blurb--gte-550 .blurb {
    font-size: 2.78%;
  }

  .Cover .blurb--gte-600 .blurb {
    font-size: 2.73%;
  }

  .Cover .blurb--gte-625 .blurb {
    font-size: 2.7%;
  }

  .Lang--es .blurb--gte-625 .blurb {
    font-size: 2.675%;
  }

  .Cover .blurb--gte-650 .blurb {
    font-size: 2.65%;
  }

  .trim--s .blurb--gte-650 .blurb {
    font-size: 2.615%;
  }

  .Lang--es .blurb--gte-650 .blurb {
    font-size: 2.61%;
  }

  .Cover .blurb--gte-675 .blurb {
    font-size: 2.6%;
  }

  .Cover .blurb--gte-700 .blurb {
    font-size: 2.52%;
  }

  .Cover .blurb--gte-775 .blurb {
    font-size: 2.48%;
  }

  .Cover .blurb--gte-850 .blurb {
    padding-top: 2.1em;
    font-size: 2.385%;
  }

  .Cover .blurb--gte-875 .blurb {
    font-size: 2.325%;
  }

  .Cover .blurb--gte-900 .blurb {
    font-size: 2.25%;
  }

  .Cover .blurb--gte-950 .blurb {
    font-size: 2.23%;
  }

  .Cover .blurb--gte-1000 .blurb {
    font-size: 2.175%;
    padding-top: 1.75em;
    margin: 0 7%;
  }
`;

export default `${lessThanCss}\n${greaterThanCss}`;
