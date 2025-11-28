export default function DashboardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-10 mt-8 max-w-5xl mx-auto">
      {children}
    </div>
  );
}
