import LeadGenCalculator from '@/components/CalculatorForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Taldo | German Career Simulator 2026',
  description: 'Calculate your exact salary potential in Germany based on your Indian qualification and experience.',
};

export default function Home() {
  return (
    // REMOVED "container mx-auto" and paddings. 
    // Now the component has full control of the screen width.
    <main className="min-h-screen bg-[#F8F9FC]">
      <LeadGenCalculator />
      
      {/* Simple Footer Text */}
      <div className="py-8 text-center text-slate-400 text-sm">
        <p>© 2026 Taldo. Calculations based on official TVöD-P Tariffs.</p>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <span>🔒 Data Privacy</span>
          <span>•</span>
          <span>🇩🇪 2026 Tax Rules Applied</span>
        </div>
      </div>
    </main>
  );
}