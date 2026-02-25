import { Badge, SkeletonText } from '@chakra-ui/react';

interface Props {
    difficulty?: string;
}

export const ChallengeDifficulty = ({ difficulty }: Props) => {

    const difficultyColors = (() => {
        switch (difficulty) {
            case 'Easy':
                return 'green';
            case 'Medium':
                return 'yellow';
            case 'Hard':
                return 'red';
            default:
                return 'gray';
        }
    })

    const difficultyNames = (() => {
        switch (difficulty) {
            case 'Easy':
                return 'Facil';
            case 'Medium':
                return 'Medio';
            case 'Hard':
                return 'Dificil';
            default:
                return 'Desconocido';
        }
    })
    return (
        <>
            <Badge borderColor="border" colorPalette={difficultyColors()} w="auto">
                {difficultyNames() || <SkeletonText width="100px" noOfLines={1}/>}
            </Badge>
        </>
    )
}