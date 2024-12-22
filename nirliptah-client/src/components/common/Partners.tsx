import PartnerCard from '../PartnerCard.tsx';

import {dummyPartners} from "../../backend/data/dummyPartners";
interface BrandsProps {
    title?: string;
}

export default function Partners({ title }: BrandsProps) {


    return (
        <div className="rounded-xl">
            {/* Header section */}
            <div className="sm:container text-center header py-6 mt-3 sm:px-auto px-3">
                <h2 className="text-2xl font-bold">
                    {title ? (
                        <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-8">
                            Our Partners & Supporters
                        </span>
                    ) : (
                        'Partners and Supporters'
                    )}
                </h2>
                <p className={`${title ? 'hidden' : ''} text-gray-500`}>
                    Experience the finest yoga experience and support from our trusted partners.
                </p>
            </div>

            {/* Partners logos in a grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center items-center pb-6">
                {dummyPartners.map((partner, index) => (
                    <a
                        key={index}
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center w-full "
                        title={`Visit ${partner.name}`}
                    >
                        <PartnerCard imageUrl={partner.logoUrl} />
                        {/*<p className="text-xs text-gray-500 mt-2">{partner.category}</p>*/}
                    </a>
                ))}
            </div>
        </div>
    );
}
