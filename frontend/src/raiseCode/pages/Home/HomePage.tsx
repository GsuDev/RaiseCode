import { VStack } from '@chakra-ui/react';
import { HeroSection } from '../../components/HeroSection/HeroSection';
export const HomePage = () => {
  return (
    <>
        <VStack justifyContent="center" m={5}>
            <HeroSection />
        </VStack>
    </>      
  );
};