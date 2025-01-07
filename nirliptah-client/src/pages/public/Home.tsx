import Workshops from "@/pages/public/workshop/Workshops.tsx";
import Journey from "@/pages/public/Journey.tsx";
import Retreats from "@/pages/public/retreat/Retreats.tsx";

export default function Home() {
    return (
        <div className="md:container container-fluid mt-16">
            <Journey/>
            <Workshops/>
            <Retreats/>
        </div>
    );

}
