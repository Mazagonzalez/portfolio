import StarBorder from "../utils/StarBorder"

export default function UsageStarBorder({ children }) {
    return (
        <StarBorder
            color="red"
            thickness={0.5}
            speed="2.5s"
        >
            {children}
        </StarBorder>
    )
}