import { useEffect, useRef } from 'react';
import { Box, Text } from '@chakra-ui/react';

export const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <Box w="75%" mt={10}>
      <Text fontSize="2xl" fontWeight="bold" color="fg" mb={4}>
        ¿Cómo usar?
      </Text>
    <Box
      borderRadius="xl"
      overflow="hidden"
      border="1px solid"
      borderColor="border"
    >
      <video
        ref={videoRef}
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
    </Box>
  );
};