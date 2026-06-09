import Hero from "@/components/Hero";
import PortfolioSlider from "@/components/PortfolioSlider";
import Services from "@/components/Services";
import ConsultationSection from "@/components/ConsultationSection";
import TestimonialSection from "@/components/TestimonialSection";
import InquiryForm from "@/components/InquiryForm";
import { client } from "@/sanity/client";
import {
  portfolioQuery,
  servicesQuery,
  testimonialsQuery,
} from "@/sanity/queries";

export const revalidate = 60;

export default async function HomePage() {
  // Fetch all sections in parallel
  const [portfolio, services, testimonials] = await Promise.all([
    client.fetch(portfolioQuery).catch(() => []),
    client.fetch(servicesQuery).catch(() => []),
    client.fetch(testimonialsQuery).catch(() => []),
  ]);

  return (
    <>
      <Hero />
      <PortfolioSlider items={portfolio ?? []} />
      <ConsultationSection />
      <Services items={services ?? []} />
      <TestimonialSection items={testimonials ?? []} />
      <InquiryForm />
    </>
  );
}
