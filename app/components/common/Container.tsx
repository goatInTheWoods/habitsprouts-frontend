import React from 'react';
import styled from 'styled-components';

const Container = (props: $TSFixMe) => {
  return (
    <Div
      className={
        'container py-md-5 ' +
        (props.wide ? '' : 'container--narrow ') +
        (props.className ? props.className : '')
      }
    >
      {props.children}
    </Div>
  );
};

const Div = styled.div`
  &.container--narrow {
    max-width: 732px;
  }
`;

export default Container;
