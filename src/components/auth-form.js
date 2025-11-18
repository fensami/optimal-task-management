// 'use client'

// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// export function AuthForm({ setUser }) {
//   const [isLogin, setIsLogin] = useState(true)
//   const { register, handleSubmit, formState: { errors }, reset } = useForm()

//   const onSubmit = (data) => {
//     const users = JSON.parse(localStorage.getItem('users') || '[]')
    
//     if (isLogin) {
//       const user = users.find((u) => u.email === data.email && u.password === data.password)
//       if (user) {
//         localStorage.setItem('currentUser', JSON.stringify(user))
//         setUser(user)
//       } else {
//         alert('Invalid credentials')
//       }
//     } else {
//       const existingUser = users.find((u) => u.email === data.email)
//       if (existingUser) {
//         alert('User already exists')
//       } else {
//         const newUser = {
//           id: Date.now(),
//           email: data.email,
//           password: data.password,
//           name: data.name,
//           teams: [],
//           projects: [],
//         }
//         users.push(newUser)
//         localStorage.setItem('users', JSON.stringify(users))
//         localStorage.setItem('currentUser', JSON.stringify(newUser))
//         setUser(newUser)
//       }
//     }
//     reset()
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-center">{isLogin ? 'Login' : 'Register'}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {!isLogin && (
//               <div>
//                 <label className="block text-sm font-medium mb-1">Full Name</label>
//                 <input
//                   {...register('name', { required: 'Name is required' })}
//                   type="text"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="John Doe"
//                 />
//                 {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//               </div>
//             )}
            
//             <div>
//               <label className="block text-sm font-medium mb-1">Email</label>
//               <input
//                 {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
//                 type="email"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="you@example.com"
//               />
//               {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Password</label>
//               <input
//                 {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
//                 type="password"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="••••••"
//               />
//               {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//             </div>

//             <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
//               {isLogin ? 'Login' : 'Register'}
//             </Button>
//           </form>

//           <p className="text-center text-sm mt-4 text-gray-600">
//             {isLogin ? "Don't have an account? " : 'Already have an account? '}
//             <button
//               onClick={() => {
//                 setIsLogin(!isLogin)
//                 reset()
//               }}
//               className="text-blue-600 hover:underline font-medium"
//             >
//               {isLogin ? 'Register' : 'Login'}
//             </button>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AuthForm({ setUser }) {
  const [isLogin, setIsLogin] = useState(true)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    if (isLogin) {
      const user = users.find((u) => u.email === data.email && u.password === data.password)
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user))
        setUser(user)
      } else {
        alert('Invalid credentials')
      }
    } else {
      const existingUser = users.find((u) => u.email === data.email)
      if (existingUser) {
        alert('User already exists')
      } else {
        const newUser = {
          id: Date.now(),
          email: data.email,
          password: data.password,
          name: data.name,
          teams: [],
          projects: [],
        }
        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))
        localStorage.setItem('currentUser', JSON.stringify(newUser))
        setUser(newUser)
      }
    }
    reset()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">{isLogin ? 'Login' : 'Register'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                reset()
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
