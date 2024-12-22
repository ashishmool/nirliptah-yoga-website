import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Player } from "@lottiefiles/react-lottie-player";
import ErrorAnimation from "@/assets/animations/error.json";

const ErrorPage: React.FC = () => {
  return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
        <div className="flex flex-col items-center text-center max-w-md px-6">
          {/* Lottie Animation */}
          <Player
              autoplay
              loop
              src={ErrorAnimation}
              className="w-72 h-72 mb-6"
          />

          {/* Error Title */}
          <h1 className="text-4xl font-bold text-[#9B6763] mb-4">
            Oops! Page Not Found
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 text-lg mb-6">
            We couldn’t find the page you’re looking for. Let’s get you back on track!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/">
              <Button className="px-6 py-2 bg-[#9B6763] text-white text-lg">
                Back to Home
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="px-6 py-2 text-[#9B6763] border-[#9B6763] text-lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
  );
};

export default ErrorPage;
