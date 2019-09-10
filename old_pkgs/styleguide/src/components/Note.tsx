import styled from 'styled-components';

export default styled.div`
  background: rgb(251, 238, 242);
  padding: 1em 1em 1em 1.3em;
  border-left: 6px solid rgb(210, 112, 147);
  font-size: 19px;
  line-height: 1.3em;
  margin-bottom: 35px;
  color: rgba(46, 68, 78, 0.9);
  font-weight: 200;
  font-family: sans-serif;
  h1 + & {
    margin-top: 40px;
  }
`;
