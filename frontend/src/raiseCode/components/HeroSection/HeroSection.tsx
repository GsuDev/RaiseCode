import { Card } from '@chakra-ui/react';
import { HeroTitle } from './components/HeroTitle';
import { HeroSubtitle } from './components/HeroSubtitle';
import { HeroActions } from './components/HeroActions';

interface Props {
  title?: string;
  subtitle?: string;
  btn1name?: string;
  btn1link?: string;
  btn2name?: string;
  btn2link?: string;
}

export const HeroSection = ({ title, subtitle, btn1name, btn1link, btn2name, btn2link }: Props) => {
  return (
    <>
        <Card.Root
        borderColor="border" 
        borderWidth="1px" 
        borderRadius="lg" 
        p={6} 
        textAlign="center"
        bgColor="bg.panel"
        width="75%"
        >
            <HeroTitle title={title} />
            <HeroSubtitle subtitle={subtitle} />
            <HeroActions btn1name={btn1name} btn1link={btn1link} btn2name={btn2name} btn2link={btn2link} />
        </Card.Root>
    </>      
  );
};