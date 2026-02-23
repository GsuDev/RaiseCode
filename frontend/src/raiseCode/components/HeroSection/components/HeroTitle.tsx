import {Card} from '@chakra-ui/react';

interface Props {
  title?: string;
}

export const HeroTitle = ({ title }: Props) => {
  return (
    <>
        <Card.Title 
        fontSize={{ 
          base: "2xl",   
          sm: "3xl",     
          md: "4xl",     
          lg: "5xl"      
        }}
        fontWeight="bold" 
        m={3} 
        color="fg" 
        wordBreak="normal"
        textAlign="center"         
        mx="auto"
        lineHeight={1.2}
        fontFamily="var(--chakra-fonts-heading)"
        >
            {title || "Domina la programación con retos"}
        </Card.Title>
    </>      
  );
};