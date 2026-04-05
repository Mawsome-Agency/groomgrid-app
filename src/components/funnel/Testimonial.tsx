import { Quote } from 'lucide-react';

interface TestimonialProps {
  name: string;
  business: string;
  quote: string;
  avatar?: string;
}

export default function Testimonial({ name, business, quote, avatar }: TestimonialProps) {
  return (
    <div className="bg-stone-50 rounded-2xl p-6">
      <Quote className="w-8 h-8 text-green-500 mb-4" />
      <p className="text-stone-700 mb-4 italic">"{quote}"</p>
      <div>
        <p className="font-semibold text-stone-900">{name}</p>
        <p className="text-sm text-stone-500">{business}</p>
      </div>
    </div>
  );
}
