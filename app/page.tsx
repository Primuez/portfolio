import React from 'react';
import { HomeClientLayout } from '@/components/HomeClientLayout';

// Modularized Sections
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProcessSection from '@/components/sections/ProcessSection';
import WhySection from '@/components/sections/WhySection';
import PricingSection from '@/components/sections/PricingSection';
import GithubSection from '@/components/sections/GithubSection';
import VideosSection from '@/components/sections/VideosSection';
import StackSection from '@/components/sections/StackSection';
import CredentialsSection from '@/components/sections/CredentialsSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <HomeClientLayout>
      <main id="main-content" aria-label="Portfolio content">
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 pb-0">
          <HeroSection />

          <AboutSection />

          <ServicesSection />

          <ProjectsSection />

          <PricingSection />

          <ProcessSection />

          <WhySection />

          <GithubSection />

          <VideosSection />

          <StackSection />

          <CredentialsSection />

          <FAQSection />

          <ContactSection />
        </div>
      </main>
    </HomeClientLayout>
  );
}
