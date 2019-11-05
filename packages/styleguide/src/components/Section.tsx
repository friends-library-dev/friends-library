import styled from 'styled-components';

export default styled.div`
  padding-bottom: 70px;
  margin-bottom: 50px;
  border-bottom: 1px dotted #a9a9a9;
  max-width: 910px;
  & > ul {
    color: #555;
    font-size: 21px;
    font-family: sans-serif;
    font-weight: 200;
    line-height: 1.4em;
    margin-top: -10px;
    margin-bottom: 35px;
  }
  & + & {
    padding-top: 20px;
  }
`;
