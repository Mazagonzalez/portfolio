import Aurora from "@/components/utils/Aurora";

export default function UsageAurora() {
    return (
        <Aurora
            colorStops={["#7E57C7", "#1D93C2", "#7453ED"]}
            blend={0.5}
            amplitude={2.0}
            speed={0.3}
        />
    )
}