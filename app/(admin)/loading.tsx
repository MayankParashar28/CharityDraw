export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="skeuo-card rounded-3xl p-10 h-20"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="skeuo-card rounded-3xl h-32"></div>
        <div className="skeuo-card rounded-3xl h-32"></div>
        <div className="skeuo-card rounded-3xl h-32"></div>
        <div className="skeuo-card rounded-3xl h-32"></div>
      </div>
    </div>
  )
}
