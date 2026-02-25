import { featuredChallengesMock } from "@/mock-data/FeaturedChallenges.mock";
import { useEffect, useState } from "react";

export const useFeaturedChallenges = () => {
    const [featuredChallenges, setFeaturedChallenges] = useState(featuredChallengesMock);
    
    // Cuando se implemente la logica en el backend, hay que cambiar todo esto para que haga la llamada a la API y no use el mock
    useEffect(() => {
        setFeaturedChallenges(featuredChallengesMock);
    }, []);

    return {
        featuredChallenges,
        setFeaturedChallenges
    }
}