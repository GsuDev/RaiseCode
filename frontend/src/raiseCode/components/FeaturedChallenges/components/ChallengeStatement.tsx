import { SkeletonText, Text } from '@chakra-ui/react';

interface Props {
  statement?: string;
}


export const ChallengeStatement = ({ statement }: Props) => {
  return (
    <>
        <Text fontSize={{ 
          base: "sm",   
          sm: "md",     
          md: "lg",     
          lg: "xl"      
        }} 
        fontWeight="normal" 
        mx={{base: 0, md: 3}} 
        color="fg.muted" 
        fontFamily="var(--chakra-fonts-body)"
        textAlign={{ base: "center", md: "start" }}
        w="full"
        >
            {statement || <SkeletonText width="300px" noOfLines={3}/>}
        </Text>
    </>      
  );
};