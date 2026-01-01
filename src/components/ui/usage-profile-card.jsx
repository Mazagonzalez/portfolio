import ProfileCard from "../utils/ProfileCard";

export default function UsageProfileCard() {
    return(
        <ProfileCard
            name="Carlos Maza G."
            title="Developer Frontend"
            handle="javicodes"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/images/carlos.jpeg"
            showUserInfo={false}
            enableTilt={true}
            enableMobileTilt={false}
            behindGlowEnabled={true}
            showBehindGlow={true}
            iconUrl="</>"
            onContactClick={() => console.log('Contact clicked')}
        />
    )
}