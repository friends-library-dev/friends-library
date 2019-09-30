import { css } from './lib/helpers';

const spineCss: string = css`
  .Edition--original .logo-icon {
    fill: #9d9d80;
  }

  .Edition--original .bg-block,
  .CoverSpine.Edition--original::before,
  .bg-color--original {
    background-color: #9d9d80;
  }

  .Edition--modernized .logo-icon {
    fill: #628c9d;
  }

  .Edition--modernized .bg-block,
  .CoverSpine.Edition--modernized::before,
  .bg-color--modernized {
    background-color: #628c9d;
  }

  .Edition--updated .logo-icon {
    fill: #6c3142;
  }

  .Edition--updated .bg-block,
  .CoverSpine.Edition--updated::before,
  .bg-color--updated {
    background-color: #6c3142;
  }
`;

export default spineCss;
