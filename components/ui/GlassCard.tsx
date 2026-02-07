export const GlassCard = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={`backdrop-blur-md bg-white/[0.02] border border-white/[0.08] rounded-2xl transition-all hover:border-white/[0.15] ${className}`}>
    {children}
  </div>
);
