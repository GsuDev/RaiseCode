import {Flex, Text, useBreakpointValue} from '@chakra-ui/react';
import { Star } from 'lucide-react';

interface Props {
  title?: string;
}

export const FeaturedChallengeTitle = ({ title }: Props) => {
  return (
    <>
        <Flex align="center" alignContent={"center"} gap={4} width="full">
            <Star size={useBreakpointValue({ base: 24, sm: 32, md: 40, lg: 48 })} color="#FFD700" />
            <Text 
            fontSize={{ 
            base: "2xl",   
            sm: "3xl",     
            md: "4xl",     
            lg: "5xl"      
            }}
            fontWeight="bold" 
            m={3} 
            color="fg" 
            wordBreak="normal"    
            mx="auto"
            lineHeight={1.2}
            fontFamily="var(--chakra-fonts-heading)"
            width="full"
            
            >   
                {title || "Retos Destacados"}
            </Text>
        </Flex>
    </>      
  );
};