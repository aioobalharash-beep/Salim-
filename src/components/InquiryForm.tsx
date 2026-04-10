"use client";

export default function InquiryForm() {
  return (
    <section
      id="enquiry-section"
      className="py-32 px-6 md:px-12 max-w-screen-2xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
        {/* Left Column — Info */}
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-6">
            Inquiries
          </p>
          <h3 className="font-headline text-5xl font-light mb-12">
            Start a Collaboration
          </h3>
          <p className="font-body text-base leading-relaxed text-on-surface-variant max-w-md mb-12">
            Whether it is a new composition, a research project, or a
            pedagogical request, precision begins with a conversation.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary">
                mail
              </span>
              <span className="font-body text-sm">office@salimdada.com</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary">
                location_on
              </span>
              <span className="font-body text-sm">
                Paris | Algiers | International
              </span>
            </div>
          </div>
        </div>

        {/* Right Column — Form */}
        <form className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
              Nature of Request
            </label>
            <select className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm appearance-none transition-all">
              <option>General Inquiry</option>
              <option>Composition Commission</option>
              <option>Masterclass Booking</option>
              <option>Academic Research</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
              Your Message
            </label>
            <textarea
              placeholder="How can we assist you?"
              rows={4}
              className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-12 py-4 bg-primary text-on-primary font-serif-brand text-lg rounded-sm hover:opacity-90 transition-opacity uppercase tracking-widest"
          >
            Submit Request
          </button>
        </form>
      </div>
    </section>
  );
}
