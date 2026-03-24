export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="skeuo-card rounded-3xl p-10 h-28"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="skeuo-card rounded-3xl h-40"></div>
        <div className="skeuo-card rounded-3xl h-40"></div>
        <div className="skeuo-card rounded-3xl h-40"></div>
      </div>
      <div className="skeuo-card rounded-3xl h-64"></div>
    </div>
  )
}
