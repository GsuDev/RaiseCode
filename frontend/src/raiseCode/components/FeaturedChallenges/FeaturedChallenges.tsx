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
                    <Carousel.Item key={i} index={i}>
                        <Box w="100%"  borderColor="border" 
                        borderWidth="1px" 
                        borderRadius="lg" 
                        p={4} 
                        textAlign="center"
                        bgColor="bg.panel"
                        >
                            <HStack justifyContent={{base:"center",md:"start", lg:"start"}} alignItems="center" h="100%" gap={4}>
                                <VStack alignItems="start" gap={2}>
                                    <HStack justifyContent={{base:"center", lg:"start"}} align="start" gap={4} mx={3}>
                                        <ChallengeLanguage language={challenge.language.name} />
                                        <ChallengeDifficulty difficulty={challenge.dificulty.name} />
                                        <ChallengeSubject subject={challenge.subject.name} />
                                    </HStack>
                                    <ChallengeTitle title={challenge.title} />
                                    <ChallengeStatement statement={challenge.statement} />
                                    <ChallengeNumCompleted users={challenge.completedCount} />
                                </VStack>
                            </HStack>
                        </Box>
                    </Carousel.Item>
                    ))}
                </Carousel.ItemGroup>
            </Carousel.Root>
        </>      
    );
};