import React from 'react';
import dynamic from 'next/dynamic';
import { HomeClientLayout } from '@/components/HomeClientLayout';

// Above the fold - immediate load
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';

// Below the fold - code split into lazy chunks for fast mobile boot
const ServicesSection = dynamic(() => import('@/components/sections/ServicesSection'));
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection').then(m => ({ default: m.ProjectsSection })));
const PricingSection = dynamic(() => import('@/components/sections/PricingSection'));
const ProcessSection = dynamic(() => import('@/components/sections/ProcessSection'));
const WhySection = dynamic(() => import('@/components/sections/WhySection'));
const GithubSection = dynamic(() => import('@/components/sections/GithubSection'));
const VideosSection = dynamic(() => import('@/components/sections/VideosSection'));
const StackSection = dynamic(() => import('@/components/sections/StackSection'));
const CredentialsSection = dynamic(() => import('@/components/sections/CredentialsSection'));
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'));
const ContactSection = dynamic(() => import('@/components/sections/ContactSection'));

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
