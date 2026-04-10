import Hero from "@/components/Hero";
import LatestWork from "@/components/LatestWork";
import Services from "@/components/Services";
import Testimonial from "@/components/Testimonial";
import InquiryForm from "@/components/InquiryForm";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LatestWork />
      <Services />
      <Testimonial />
      <InquiryForm />
    </>
  );
}
