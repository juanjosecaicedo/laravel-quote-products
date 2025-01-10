export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-neutral-900">
      <div className="max-w-screen-lg mx-auto border-neutral-700 py-5">
        <p className="text-sm text-neutral-400">
          © {new Date().getFullYear()} Juan Jose Caicedo.
        </p>
      </div>
    </footer>
  )
}
