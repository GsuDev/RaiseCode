import { VStack } from '@chakra-ui/react';
import { HeroSection } from '../../components/HeroSection/HeroSection';
import { CyclesSection } from '@/raiseCode/components/CyclesSection/CyclesSection';
import { FeaturedChallenges } from '@/raiseCode/components/FeaturedChallenges/FeaturedChallenges';
export const HomePage = () => {
  return (
    <>
        <VStack justifyContent="center" m={5}>
            <HeroSection btn1link="/asignaturas" btn2link="/crear-reto" />
            <FeaturedChallenges />
            <CyclesSection />

        </VStack>
    </>      
  );
};