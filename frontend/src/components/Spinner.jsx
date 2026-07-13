export default function Spinner({ label = "Loading messages..." }) {
  return (
    <div className="loading-wrap" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
