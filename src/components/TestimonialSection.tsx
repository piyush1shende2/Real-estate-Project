import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

// Import our custom-generated customer portrait image
// @ts-ignore
import customerImg1 from '../assets/images/customer_portrait_1779448713685.png';

interface TestimonialRecord {
  id: string;
  name: string;
  residency: string; // literal text from screenshot: "Bachlor resident since last 2 years" or custom
  image: string;
  avatar: string;
  feedback: string;
}

const TESTIMONIALS: TestimonialRecord[] = [
  {
    id: 't1',
    name: 'Andrew Davis',
    residency: 'Bachlor resident since last 2 years',
    image: customerImg1,
    avatar: customerImg1,
    feedback: 'Lorem ipsum dolor sit amet consectetur. Mi elit vulputate malesuada lectus lectus pellentesque tellus. Cursus euismod vivamus id quam sit faucibus amet fermentum. Nibh pharetra tempus ornare eu quam sit adipiscing hendrerit consequat.'
  },
  {
    id: 't2',
    name: 'Grace Kingsley',
    residency: 'Family resident since last 4 years',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    feedback: 'The team at Urban Nest Realty made renting an absolute dream! Their site features verified land parcels and plots directly compiled with legal safety compliance checklists. Finding our 3-BHK home was extremely simple!'
  },
  {
    id: 't3',
    name: 'Michael Owens',
    residency: 'Plot investor since 2021',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    feedback: 'Excellent assistance on purchase formalities! I was extremely nervous inspecting municipal title codes, but one click on the Buying Guide and Urban Nest Support guided me. Their interactive trend calculators are unmatched.'
  }
];

export default function TestimonialSection() {
  const [currIdx, setCurrIdx] = useState(0);

  const nextTestimonial = () => {
    setCurrIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currIdx];

  return (
    <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-12 py-12 select-none">
      
      {/* Title block */}
      <div className="mb-10 text-left">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-red-600">
          What our Customers says about us:-
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wide">
          These are genuine feedbacks from our customers
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Photo Frame exact replication of design layout */}
        <div className="col-span-1 md:col-span-4 flex flex-col items-center">
          <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-gray-50 flex items-center justify-center">
            
            {/* The Main Customer High Quality Portrait Asset */}
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover transition-all duration-500 hover:scale-103"
              referrerPolicy="no-referrer"
            />
            
            {/* Shaded overlay bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Solid Pill label centered at bottom "Name:- Andrew Davis" */}
            <div className="absolute bottom-4 inset-x-4">
              <div className="bg-[#0E1F35] text-white font-bold py-2.5 px-4 rounded-full text-center text-xs tracking-wider border border-white/15 shadow uppercase">
                Name:- {current.name}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quote feedback description text details */}
        <div className="col-span-1 md:col-span-8 flex flex-col justify-between space-y-6">
          
          {/* User Review Info Card */}
          <div className="space-y-4">
            
            {/* Tiny Avatar + Name on top of review */}
            <div className="flex items-center gap-4">
              <img
                src={current.avatar}
                alt={current.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-sm font-black text-slate-900 tracking-wide uppercase m-0 leading-none">
                  {current.name}
                </h4>
                <p className="text-[11px] text-[#FF0101] font-bold mt-1.5 uppercase tracking-wide">
                  {current.residency}
                </p>
              </div>
            </div>

            {/* Main feedback quotes typography with quote decorative symbol */}
            <div className="relative">
              <Quote className="absolute -top-3.5 -left-3.5 w-10 h-10 text-gray-100 -z-10 transform scale-x-[-1]" />
              <p className="text-sm sm:text-base font-semibold text-gray-700 leading-relaxed italic relative z-2">
                "{current.feedback}"
              </p>
            </div>

          </div>

          {/* Pagination buttons inline under text as shown in screenshot */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <button
              onClick={prevTestimonial}
              className="border border-gray-300 hover:bg-slate-50 transition-colors p-2.5 rounded-md cursor-pointer flex items-center justify-center shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={nextTestimonial}
              className="border border-gray-300 hover:bg-slate-50 transition-colors p-2.5 rounded-md cursor-pointer flex items-center justify-center shadow-xs"
            >
              <ArrowRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}
