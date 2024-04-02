import React, { useEffect } from 'react';
import Container from '@/components/common/Container';

const Page = props => {
  useEffect(() => {
    document.title = `${props.title} | HabitSprouts`;
    window.scrollTo(0, 0);
  }, [props.title]);

  return (
    <Container wide={props.wide} className={props.className}>
      {props.children}
    </Container>
  );
};

export default Page;
