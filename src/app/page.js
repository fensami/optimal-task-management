'use client'
import { AuthForm } from "@/components/auth-form"
import { Dashboard } from "@/components/dashboard"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
     const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return <AuthForm setUser={setUser} />
  }
  return (
    <div>
   <Dashboard user={user} setUser={setUser} />
   
    </div>
  );
}
