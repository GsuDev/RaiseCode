import { Button } from "@chakra-ui/react"
import { ArrowBigRight } from "lucide-react"
import { useNavigate } from "react-router";

interface Props {
    id? : string
}

export const ChallengeActions = ({id} : Props) => {
    const navigate = useNavigate();
    
    const handleNavigate = (link: string) => {
        navigate(link);
    };
    return (
        <>
            <Button
           bg="primary.solid"
           // Añadir id al handleNavigate cuando este hecho el back
           onClick={() => handleNavigate("/retos")}
           _hover={{ bg: "bg.subtle" , color: "fg" }}
           >
            Acceder al reto
            <ArrowBigRight />
          </Button>
        </>
    )
}