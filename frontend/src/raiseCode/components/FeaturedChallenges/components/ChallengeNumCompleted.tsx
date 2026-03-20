import {Flex, SkeletonText, Text, useBreakpointValue} from '@chakra-ui/react';
import { User } from 'lucide-react';

interface Props {
  users?: number;
}

export const ChallengeNumCompleted = ({ users }: Props) => {
  return (
    <>
        <Flex alignItems={"center"} justifyContent={{ base: "center", md: "flex-start" }} gap={1} width="full" mx={{base: 0, md: 3}} >
            <User size={useBreakpointValue({ base: 16, sm: 16, md: 16, lg: 24 })} color="var(--chakra-colors-fg-muted)" />
            <Text 
            fontSize={{ 
                base: "sm",   
                sm: "md",     
                md: "lg",     
                lg: "xl"      
            }}
            fontWeight="normal" 
            color="fg.muted" 
            wordBreak="normal"    
            fontFamily="var(--chakra-fonts-body)"
            >   
                {users != null ? users : <SkeletonText width="200px" noOfLines={1}/>}
            </Text>
        </Flex>
    </>      
  );
};