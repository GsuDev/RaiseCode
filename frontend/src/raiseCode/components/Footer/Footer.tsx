import { Box, Flex, HStack, Link, Text, VStack } from '@chakra-ui/react';
import { Github, Code2 } from 'lucide-react';
import LogoSrc from 'src/assets/Logo.svg';

const developers = [
  { name: 'GsuDev',    github: 'https://github.com/GsuDev'    },
  { name: 'MrsBambi',  github: 'https://github.com/MrsBambi'  },
  { name: 'carloospg', github: 'https://github.com/carloospg' },
  { name: 'Iaancasve', github: 'https://github.com/Iaancasve' },
];

export const Footer = () => {
  return (
    <Box
      as="footer"
      borderTop="1px solid"
      borderColor="border"
      bg="bg.canvas"
      backdropFilter="blur(12px)"
    >
      <Flex
        maxW="9xl"
        mx="auto"
        px={{ base: '4', sm: '6', lg: '8' }}
        py="6"
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="space-between"
        gap="6"
      >
        {/* Logo + nombre */}
        <HStack gap="2">
          <Box h="7" w="7">
            <img src={LogoSrc} alt="RaiseCode" style={{ width: '100%', height: '100%' }} />
          </Box>
          <VStack align="start" gap="0">
            <Text fontWeight="bold" fontSize="sm" color="fg" fontFamily="var(--chakra-fonts-heading)">
              RaiseCode
            </Text>
            <Text fontSize="xs" color="fg.muted">
              IES Virgen de Gracia · 2025–2026
            </Text>
          </VStack>
        </HStack>

        {/* Desarrolladores */}
        <VStack gap="2" align="center">
          <HStack gap="1" color="fg.muted">
            <Code2 size={12} />
            <Text fontSize="xs" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
              Desarrollado por
            </Text>
          </HStack>
          <HStack gap="5" flexWrap="wrap" justify="center">
            {developers.map((dev) => (
              <Link
                key={dev.name}
                href={dev.github}
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ textDecoration: 'none' }}
              >
                <HStack gap="1" color="fg.muted" _hover={{ color: 'brand.500' }} transition="color 0.15s">
                  <Github size={13} />
                  <Text fontSize="xs" fontWeight="medium">{dev.name}</Text>
                </HStack>
              </Link>
            ))}
          </HStack>
        </VStack>

        {/* Proyecto */}
        <Text fontSize="xs" color="fg.subtle" textAlign={{ base: 'center', md: 'right' }}>
          Proyecto fin de ciclo DAW
        </Text>
      </Flex>
    </Box>
  );
};
