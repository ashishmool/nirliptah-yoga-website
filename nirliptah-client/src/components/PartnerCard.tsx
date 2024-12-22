interface PartnerCardProps {
    imageUrl: string;
}

export default function PartnerCard({ imageUrl }: PartnerCardProps) {
    return (
        <div className="flex items-center justify-center overflow-hidden w-32 h-32 sm:w-40 sm:h-40 mx-auto">
            <img
                src={imageUrl}
                alt="Partner Logo"
                className="object-contain w-full h-full"
            />
        </div>
    );
}
