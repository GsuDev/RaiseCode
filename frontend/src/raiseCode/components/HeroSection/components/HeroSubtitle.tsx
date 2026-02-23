import { Text } from '@chakra-ui/react';

interface Props {
  subtitle?: string;
}


export const HeroSubtitle = ({ subtitle }: Props) => {
  return (
    <>
        <Text fontSize={{ 
          base: "sm",   
          sm: "md",     
          md: "lg",     
          lg: "xl"      
        }} 
        fontWeight="normal" 
        m={3} color="fg.muted" 
        fontFamily="var(--chakra-fonts-body)"
        >
            {subtitle || "Practica, compite y mejora tus habilidades de programación resolviendo retos creados por la comunidad del IES Virgen de Gracia."}
        </Text>
    </>      
  );
};