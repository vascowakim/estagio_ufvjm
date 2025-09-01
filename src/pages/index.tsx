import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirecionar para dashboard ou login dependendo da autenticação
    router.push('/dashboard')
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-sm text-secondary-600">Redirecionando...</p>
      </div>
    </div>
  )
}
