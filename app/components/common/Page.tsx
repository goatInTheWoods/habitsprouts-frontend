import React, { useEffect } from 'react';
import Container from '@/components/common/Container';

interface PageProps {
  title: string;
  wide?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Page = ({ title, wide, className, children }: PageProps) => {
  useEffect(() => {
    document.title = `${title} | HabitSprouts`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <Container wide={wide} className={className}>
      {children}
    </Container>
  );
};

export default Page;
