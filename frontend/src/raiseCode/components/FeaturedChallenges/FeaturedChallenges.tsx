import { Carousel, IconButton, HStack, Box, VStack } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FeaturedChallengeTitle } from './components/FeaturedChallengeTitle';
import { useFeaturedChallenges } from './hooks/useFeaturedChallenges';
import { ChallengeTitle } from './components/ChallengeTitle';
import { ChallengeStatement } from './components/ChallengeStatement';
import { ChallengeNumCompleted } from './components/ChallengeNumCompleted';
import { ChallengeLanguage } from './components/ChallengeLanguage';
import { ChallengeDifficulty } from './components/ChallengeDifficulty';
import { ChallengeSubject } from './components/ChallengeSubject';
import { ChallengeActions } from './components/ChallengeActions';

interface Props {
    title?: string;
}

export const FeaturedChallenges = ({ title }: Props) => {
    const { featuredChallenges } = useFeaturedChallenges(); 
    return (
        <>
            <Carousel.Root
            slideCount={featuredChallenges.length}
            mx="auto"
            width="75%"
            >
                <HStack justifyContent="space-between" gap="4" mt={3} flexWrap={'nowrap'}>
                    <FeaturedChallengeTitle title={title} />
                    <Carousel.Control h="100%" w="auto" gap="4" display={{ base: "none", md: "flex" }}>
                        <Carousel.PrevTrigger asChild>
                            <IconButton size="xs" variant="ghost">
                                <LuChevronLeft />
                            </IconButton>
                        </Carousel.PrevTrigger>

                        <Carousel.Indicators />

                        <Carousel.NextTrigger asChild>
                            <IconButton size="xs" variant="ghost">
                                <LuChevronRight />
                            </IconButton>
                        </Carousel.NextTrigger>
                    </Carousel.Control>
                </HStack>

                <Carousel.ItemGroup>
                    {featuredChallenges.map((challenge, i) => (
                    <Carousel.Item key={challenge.id} index={i}>
                        <Box 
                        w="100%"  
                        borderColor="border" 
                        borderWidth="1px" 
                        borderRadius="lg" 
                        p={4} 
                        textAlign="center"
                        bgColor="bg.panel"
                        position="relative"
                        >
                            <HStack justifyContent={{base:"center",md:"start", lg:"start"}} alignItems="center" h="100%" gap={4} >
                                <VStack alignItems="start" gap={2} flex={1}>
                                    <HStack justifyContent={{base:"center", lg:"start"}} align="start" gap={3} mx={3} mb={3}>
                                        <ChallengeLanguage language={challenge.language.name} />
                                        <ChallengeDifficulty difficulty={challenge.dificulty.name} />
                                        <ChallengeSubject subject={challenge.subject.name} />
                                    </HStack>
                                    <ChallengeTitle title={challenge.title} />
                                    <ChallengeStatement statement={challenge.statement} />
                                    <ChallengeNumCompleted users={challenge.completedCount} />
                                    <Box display={{base:'flex', md:'none'}} justifyItems={'end'} alignItems='end'>
                                    <ChallengeActions id={`${i}`} />
                                </Box> 
                                </VStack>
                                <Box display={{ base: "none", md: "flex" }}>
                                    <ChallengeActions id={challenge.id.toString()} /> 
                                </Box>        
                            </HStack>
                        </Box>
                    </Carousel.Item>
                    ))}
                </Carousel.ItemGroup>
            </Carousel.Root>
        </>      
    );
};