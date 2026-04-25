import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Hushh Hackathon Coming Soon Page
 * 
 * A modern, premium "Coming Soon" page with:
 * - Centered layout
 * - Gradient background
 * - Smooth animations
 * - Dark theme consistent with Hushh branding
 * - Responsive design
 */
const HushhHackathonPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Hushh Hackathon - Coming Soon</title>
        <meta name="description" content="Hushh Hackathon - Coming Soon. Join us for an exciting opportunity to build, innovate, and compete." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orb 1 - top right */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen opacity-20 blur-3xl animate-pulse-slow" />
          
          {/* Gradient orb 2 - bottom left */}
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen opacity-20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          
          {/* Gradient orb 3 - center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen opacity-10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fadeIn">
            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                  Hushh Hackathon
                </span>
              </h1>

              {/* Subtitle with rocket emoji */}
              <div className="text-3xl md:text-4xl font-semibold text-slate-100">
                Coming Soon{' '}
                <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>
                  🚀
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
              <p>
                Get ready to innovate, collaborate, and build the future with Hushh.
              </p>
              <p>
                Join developers, designers, and creators to solve real-world problems and showcase your skills in a competitive environment.
              </p>
            </div>

            {/* Optional: Call-to-action buttons (commented for now) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-200">
                Notify Me
              </button>
              <button className="px-8 py-3 bg-slate-700 text-slate-100 font-semibold rounded-lg border border-slate-600 hover:border-blue-500 hover:text-blue-400 transform hover:scale-105 transition-all duration-200">
                Learn More
              </button>
            </div>

            {/* Footer text */}
            <div className="pt-12 border-t border-slate-700">
              <p className="text-sm md:text-base text-slate-400">
                ✨ Something amazing is brewing. Stay tuned for updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HushhHackathonPage;
