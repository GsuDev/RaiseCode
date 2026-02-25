import { Badge, SkeletonText } from "@chakra-ui/react"

interface Props {
    language?: string;
}

export const ChallengeLanguage = ({ language }: Props) => {
    return (
        <>
            <Badge variant="outline"  borderColor="border">
                {language || <SkeletonText width="100px" noOfLines={1}/>}
            </Badge>
        </>
    )
}