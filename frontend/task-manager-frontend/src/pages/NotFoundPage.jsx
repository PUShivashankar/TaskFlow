import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-black text-primary-100">404</p>
      <h1 className="text-2xl font-bold text-slate-700 mt-2">Page not found</h1>
      <p className="text-slate-500 mt-2 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
    </div>
  )
}
