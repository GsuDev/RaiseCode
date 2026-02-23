import { Button, HStack, VStack } from '@chakra-ui/react';
import { PlusCircle, Target } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Props {
  btn1name?: string;
  btn1link?: string;

  btn2name?: string;
  btn2link?: string;
}

export const HeroActions = ({btn1name, btn1link, btn2name, btn2link}: Props) => {
  const navigate = useNavigate();

  const handleNavigate = (link: string) => {
    navigate(link);
  };
  return (
    <>
        <HStack justifyContent={"center"} mt={6} gap={100} display={{base: "none", md: "flex" }}>
          <Button
           bg="primary.solid"
           onClick={() => handleNavigate(btn1link || "/")}
           _hover={{ bg: "bg.subtle" , color: "fg" }}
           >
            <Target size={18}></Target>
            {btn1name || "Explora los retos"}
          </Button>
          <Button
           bg="bg.panel"
           borderColor="primary.solid"
           color="primary.solid"
           onClick={() => handleNavigate(btn2link || "/")}
           _hover={{ bg: "bg.subtle" , color: "fg" , borderColor: "bg.subtle" }}
          >
            <PlusCircle size={18}></PlusCircle>
            {btn2name || "Crea tu propio reto"}
          </Button>
        </HStack>

        <VStack justifyContent={"center"} mt={6} gap={5} display={{base: "flex", md: "none" }}>
          <Button
           bg="primary.solid"
           onClick={() => handleNavigate(btn1link || "/")}
           _hover={{ bg: "bg.subtle" , color: "fg" }}
           >
            <Target size={18}></Target>
            {btn1name || "Explora los retos"}
          </Button>
          <Button
           bg="bg.panel"
           borderColor="primary.solid"
           color="primary.solid"
           onClick={() => handleNavigate(btn2link || "/")}
           _hover={{ bg: "bg.subtle" , color: "fg" }}
           >
            <PlusCircle size={18}></PlusCircle>
            {btn2name || "Crea tu propio reto"}
          </Button>
        </VStack>
    </>      
  );
};