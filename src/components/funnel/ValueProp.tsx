import { CheckCircle2 } from 'lucide-react';

interface ValuePropItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ValuePropItem({ icon, title, description }: ValuePropItemProps) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-white border border-stone-100">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-stone-900 mb-1">{title}</h3>
        <p className="text-sm text-stone-600">{description}</p>
      </div>
    </div>
  );
}

export default function ValueProp() {
  const valueProps = [
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      title: "2-tap booking",
      description: "Book appointments in seconds with our mobile-first design",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      title: "Automated reminders",
      description: "Reduce no-shows with SMS and email reminders",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      title: "Client management",
      description: "Store pet profiles, grooming notes, and payment history",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      title: "Revenue tracking",
      description: "See earnings at a glance with real-time analytics",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {valueProps.map((prop, index) => (
        <ValuePropItem key={index} {...prop} />
      ))}
    </div>
  );
}
