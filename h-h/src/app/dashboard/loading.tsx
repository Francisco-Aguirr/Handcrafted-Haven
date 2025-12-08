// src/app/dashboard/loading.tsx
import DashboardContainer from "./components/DashboardContainer";
import AdminDashboardSkeleton from "./components/AdminDashboardSkeleton";

export default function Loading() {
  return (
    <DashboardContainer>
      <AdminDashboardSkeleton />
    </DashboardContainer>
  );
}