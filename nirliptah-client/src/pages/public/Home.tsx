import Workshops from "@/pages/public/workshop/Workshops.tsx";
import Journey from "@/components/common/Journey.tsx";
import Retreats from "@/components/common/Retreats.tsx";
import Partners from "@/components/common/Partners.tsx";
// import MainNav from "@/components/common/MainNav.tsx";

export default function Home() {
    return (
        <div className="md:container container-fluid mt-16">
            <Journey/>
            <Workshops/>
            <Retreats/>
            <Partners />
        </div>
    );

}
