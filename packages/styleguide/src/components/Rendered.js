// @flow
import * as React from 'react';
import styled from 'styled-components';


let doctor;
const convert = (adoc) => {
  if (!doctor) {
    doctor = new window.Asciidoctor();
  }
  return doctor.convert(adoc);
}

const StyledDiv = styled.div`
  background: white;
  font-family: Georgia;
  padding: 1em;
`;

export default ({ adoc }) => (
  <StyledDiv className="rendered-adoc" dangerouslySetInnerHTML={{__html: convert(adoc)}}/>
);
