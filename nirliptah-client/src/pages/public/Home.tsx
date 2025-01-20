import Workshops from "@/pages/public/workshop/Workshops.tsx";
import Journey from "@/pages/public/Journey.tsx";
import Retreats from "@/pages/public/retreat/Retreats.tsx";
import {Contact} from "@/pages";

export default function Home() {
    return (
        <div className="md:container container-fluid mt-16">
            <div id="journey">
            <Journey />
            </div>
            <div id="workshops">
                <Workshops />
            </div>
            <div id="retreats">
                <Retreats />
            </div>
            <div id="contact-us">
                <Contact />
            </div>
        </div>
    );

}
