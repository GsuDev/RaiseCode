import { VStack } from '@chakra-ui/react';
import { HeroSection } from '../../components/HeroSection/HeroSection';
import { FeaturedChallenges } from '@/raiseCode/components/FeaturedChallenges/FeaturedChallenges';

export const HomePage = () => {
  return (
    <>
        <VStack justifyContent="center" m={5}>
            <HeroSection />
            <FeaturedChallenges />
        </VStack>
    </>      
  );
};