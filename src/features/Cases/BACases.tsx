import { BACaseListTable } from "./components/BACaseListTable";
import CasesEmptyState from "./components/CasesEmptyState";
import CasesSkeleton from "./components/CasesSkeleton";
import { useGetCasesList } from "./hooks/useGetCasesList";

export function BACasesPage() {
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

  return <BACaseListTable cases={data} />;
}
