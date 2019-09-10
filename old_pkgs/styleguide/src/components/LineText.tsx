import styled from 'styled-components';

export default styled.span`
  display: block;
  padding-left: 48px;
  color: #abb2bf;
  & .asciidoc--i {
    color: #c678dd;
    font-style: italic;
  }
  & .asciidoc--blue {
    color: #61afef;
  }
  & .asciidoc--normal {
    color: #abb2bf;
  }
  & .asciidoc--white {
    color: white;
    font-weight: bold;
  }
  & .asciidoc--grey {
    color: rgba(171, 178, 191, 0.5);
  }
  & .asciidoc--red {
    color: #cc6b73;
  }
  & .asciidoc--green {
    color: #98c379;
  }
  & .asciidoc--orange {
    color: #d19a66;
  }
  & .asciidoc--pink {
    color: #cc89a2;
  }
`;
