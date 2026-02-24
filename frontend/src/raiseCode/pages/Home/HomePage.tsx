import { VStack } from '@chakra-ui/react';
import { HeroSection } from '../../components/HeroSection/HeroSection';
import { CyclesSection } from '@/raiseCode/components/CyclesSection/CyclesSection';
export const HomePage = () => {
  return (
    <>
        <VStack justifyContent="center" m={5}>
            <HeroSection />
            <CyclesSection />
        </VStack>
    </>      
  );
};