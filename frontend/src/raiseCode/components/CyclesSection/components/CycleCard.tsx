import { Box, Flex, Text } from "@chakra-ui/react";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface Props {
  code: string;
  title: string;
  description: string;
  subjects: number;
  challenges: number;
  icon: LucideIcon;
  gradient: string;
  borderClr: string;
  bgClr: string;
  onClick?: () => void;
}

export const CycleCard = ({
  code,
  title,
  description,
  subjects,
  challenges,
  icon: IconComponent,
  gradient,
  borderClr,
  bgClr,
  onClick,
}: Props) => {
  return (
    <Box
      as="button"
      textAlign="left"
      onClick={onClick}
      position="relative"
      overflow="hidden"
      borderRadius="2xl"
      border="2px solid"
      borderColor={borderClr}
      bg={bgClr}
      p="6"
      transition="all 0.2s"
      cursor="pointer"
      _hover={{
        transform: "scale(1.02)",
        boxShadow: `0 10px 40px ${borderClr}`,
      }}
      role="group"
    >
      <Box
        position="absolute"
        right="-8"
        top="-8"
        h="32"
        w="32"
        borderRadius="full"
        bg={gradient}
        opacity="0.15"
        filter="blur(40px)"
        transition="opacity 0.3s"
        _groupHover={{ opacity: 0.3 }}
      />

      <Box position="relative">
        <Flex
          mb="4"
          h="14"
          w="14"
          alignItems="center"
          justifyContent="center"
          borderRadius="xl"
          bg={gradient}
        >
          <IconComponent size={28} color="white" />
        </Flex>

        <Box
          display="inline-block"
          mb="3"
          px="2"
          py="0.5"
          borderRadius="md"
          bg={gradient}
          fontSize="xs"
          fontWeight="bold"
          color="white"
        >
          {code}
        </Box>

        <Text mb="2" fontWeight="bold" fontSize="lg" color={{ base: "gray.900", _dark: "white" }}>
          {title}
        </Text>
        <Text mb="4" color={{ base: "gray.600", _dark: "gray.400" }} fontSize="sm">
          {description}
        </Text>

        <Flex gap="4" fontSize="sm">
          <Text color={{ base: "gray.600", _dark: "gray.400" }}>
            <Text as="span" fontWeight="semibold" color={{ base: "gray.900", _dark: "white" }}>
              {subjects}
            </Text>{" "}
            asignaturas
          </Text>
          <Text color={{ base: "gray.600", _dark: "gray.400" }}>
            <Text as="span" fontWeight="semibold" color={{ base: "gray.900", _dark: "white" }}>
              {challenges}
            </Text>{" "}
            retos
          </Text>
        </Flex>

        <Flex
          mt="4"
          alignItems="center"
          gap="2"
          fontWeight="medium"
          color="brand.500"
          fontSize="sm"
          opacity="0"
          transition="opacity 0.3s"
          _groupHover={{ opacity: 1 }}
        >
          Explorar ciclo <ArrowRight size={16} />
        </Flex>
      </Box>
    </Box>
  );
};
