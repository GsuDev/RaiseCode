import { Box } from '@chakra-ui/react';

export const HeroVideo = () => {
  return (
    <Box
      w="75%"
      borderRadius="xl"
      overflow="hidden"
      border="1px solid"
      borderColor="border"
      mt={10}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{ width: '100%', display: 'block' }}
      >
        <source src="/videos/hero-demo.mp4" type="video/mp4" />
      </video>
    </Box>
  );
};