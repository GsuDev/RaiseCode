import { Badge, SkeletonText } from "@chakra-ui/react"

interface Props {
    subject?: string;
}

export const ChallengeSubject = ({ subject }: Props) => {
    return (
        <>
            <Badge variant="surface" borderColor="border" colorScheme="blue" whiteSpace="normal" textAlign="center">
                {subject || <SkeletonText width="100px" noOfLines={1}/>}
            </Badge>
        </>
    )
}