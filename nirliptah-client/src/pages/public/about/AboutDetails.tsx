import aboutPhoto from "@/assets/about-us.jpg";
import aboutVideo from "@/assets/videos/about-nirlipta.mp4";
import MainNav from "@/components/common/MainNav.tsx";

export default function AboutDetails() {
    return (

        <div className="md:container container-fluid">
            <div className="flex flex-col min-h-[100dvh]">

                {/* About Nirlipta Yoga */}
                <section className="py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-5 mb-12">
                                    About Nirlipta Yoga
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                    🌿 Welcome to <strong>Nirlipta Yoga</strong>, your sanctuary for harmony and well-being. Guided by the vision of Nivedita Pradhan, we are dedicated to spreading the transformative power of yoga, inspiring individuals to connect with their inner selves and embrace a life of balance and positivity. 🧘‍♀️
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                    ✨ At <strong>Nirlipta Yoga</strong>, we believe that yoga is more than just a practice — it’s a journey of self-discovery and growth. Rooted in ancient wisdom, our classes blend physical postures, mindful breathing, and meditation to nurture the mind, body, and soul. 🌸 Whether you're a beginner or an experienced yogi, we welcome you to explore our offerings, designed to meet you where you are in your journey.
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                    💖 Our mission is to create a community where individuals come together to inspire and uplift one another. Through compassion, mindfulness, and dedication, <strong>Nirlipta Yoga</strong> strives to provide a safe and welcoming space where you can grow, heal, and thrive. 🌈
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    🌟 Join us at <strong>Nirlipta Yoga</strong> and embrace the gift of peace, strength, and self-awareness. Let’s embark on this beautiful journey together, discovering the limitless potential within ourselves. Namaste. 🙏
                                </p>
                            </div>

                            <div className="flex items-center justify-center">
                                <img
                                    src={aboutPhoto}
                                    alt="Nirlipta Yoga"
                                    className=" shadow-lg w-[475px] object-fill"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <header className="relative bg-[#F5F5F5] mt-10 py-20 md:py-32 lg:py-40 sm:rounded-lg overflow-hidden mb-16">
                    <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0">
                        <source src={aboutVideo} />
                        Your browser does not support the video tag.
                    </video>
                    <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center relative z-10">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Nirlipta Yoga</h1>
                        <p className="text-lg md:text-xl lg:text-2xl text-white max-w-3xl mx-auto">
                            Elevate your senses with Yoga lifestyle and learn from the best.
                        </p>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-5"></div> {/* Optional overlay for better text readability */}
                </header>


            </div>
        </div>
    )
}