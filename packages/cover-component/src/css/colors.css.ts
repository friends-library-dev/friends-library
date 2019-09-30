import { css } from './lib/helpers';

const spineCss: string = css`
  .Edition--original .logo-icon {
    fill: #9d9d80;
  }

  .Cover.Edition--original .has-bg::before,
  .bg-color--original {
    background-color: #9d9d80;
  }

  .Edition--modernized .logo-icon {
    fill: #628c9d;
  }

  .Cover.Edition--modernized .has-bg::before,
  .bg-color--modernized {
    background-color: #628c9d;
  }

  .Edition--updated .logo-icon {
    fill: #6c3142;
  }

  .Cover.Edition--updated .has-bg::before,
  .bg-color--updated {
    background-color: #6c3142;
  }
`;

export default spineCss;
