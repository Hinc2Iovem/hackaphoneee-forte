import { useAuth } from "../Auth/providers/AuthProvider";
import { BACaseListTable } from "./components/BACaseListTable";
import { CaseListTable } from "./components/CaseListTable";
import CasesEmptyState from "./components/CasesEmptyState";
import CasesSkeleton from "./components/CasesSkeleton";
import { useGetCasesList } from "./hooks/useGetCasesList";

export function CasesPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useGetCasesList();

  if (isLoading) {
    return <CasesSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-4 text-sm text-red-500">
        Не удалось загрузить кейсы. Попробуйте обновить страницу позже.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <CasesEmptyState />;
  }

  return user?.role && user.role === "ANALYTIC" ? (
    <BACaseListTable cases={data} />
  ) : (
    <CaseListTable cases={data} />
  );
}
