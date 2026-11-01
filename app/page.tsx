import { PortfolioAssistant } from "@/components/ai/PortfolioAssistant";
import { AboutSection } from "@/components/about/AboutSection";
import { BlogPreview } from "@/components/blog/BlogPreview";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { CurrentlyBuilding } from "@/components/building/CurrentlyBuilding";
import { ContactSection } from "@/components/contact/ContactSection";
import { BehindTheWorkSection } from "@/components/experience/BehindTheWork";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { HeroSection } from "@/components/hero/HeroSection";
import { JourneySection } from "@/components/journey/JourneySection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { SkillsSection } from "@/components/skills/SkillsSection";

/**
 * The story, in order:
 * discover → who → how he thinks → what he knows → what he's built → where →
 * behind the work → AI → building now → writing → newsletter → contact.
 * Each section carries a data-section marker; the feather's path across them lives in data/featherPath.ts.
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <JourneySection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceTimeline />
      <BehindTheWorkSection />
      <PortfolioAssistant />
      <CurrentlyBuilding />
      <BlogPreview />
      <NewsletterSection />
      <ContactSection />
    </>
  );
}
