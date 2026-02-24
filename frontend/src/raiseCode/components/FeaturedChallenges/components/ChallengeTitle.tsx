import { SkeletonText, Text } from '@chakra-ui/react';
interface Props {
  title?: string;
}

export const ChallengeTitle = ({ title }: Props) => {
  return (
    <>
        <Text 
        fontSize={{ 
        base: "xl",   
        sm: "2xl",     
        md: "3xl",     
        lg: "4xl"      
        }}
        fontWeight="bold" 
        m={3} 
        color="fg" 
        wordBreak="normal"    
        lineHeight={1.2}
        fontFamily="var(--chakra-fonts-heading)"
        width="full"
        textAlign="start"
        >   
            {title || <SkeletonText width="200px" noOfLines={1}/>}
        </Text>
        </>
  );
};