// 'use client'

// import { useForm } from 'react-hook-form'
// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// export function TeamManager({ userId, teams, setTeams, setActivityLog }) {
//   const [showForm, setShowForm] = useState(false)
//   const [editingTeam, setEditingTeam] = useState(null)
//   const [showMemberForm, setShowMemberForm] = useState(null)
  
//   const { register, handleSubmit, reset, formState: { errors } } = useForm()
//   const { register: registerMember, handleSubmit: handleMemberSubmit, reset: resetMember, formState: { errors: memberErrors } } = useForm()

//   const onTeamSubmit = (data) => {
//     if (editingTeam) {
//       const updated = teams.map((t) =>
//         t.id === editingTeam.id ? { ...t, name: data.teamName } : t
//       )
//       setTeams(updated)
//       localStorage.setItem(`teams_${userId}`, JSON.stringify(updated))
//       setEditingTeam(null)
//     } else {
//       const newTeam = {
//         id: Date.now(),
//         name: data.teamName,
//         members: [],
//       }
//       const updated = [...teams, newTeam]
//       setTeams(updated)
//       localStorage.setItem(`teams_${userId}`, JSON.stringify(updated))
//     }
//     setShowForm(false)
//     reset()
//   }

//   const onMemberSubmit = (data) => {
//     const teamId = showMemberForm
//     const newMember = {
//       id: Date.now(),
//       name: data.memberName,
//       role: data.role,
//       capacity: parseInt(data.capacity),
//     }
//     const updated = teams.map((t) =>
//       t.id === teamId
//         ? { ...t, members: [...(t.members || []), newMember] }
//         : t
//     )
//     setTeams(updated)
//     localStorage.setItem(`teams_${userId}`, JSON.stringify(updated))
//     setShowMemberForm(null)
//     resetMember()
//   }

//   const deleteTeam = (teamId) => {
//     const updated = teams.filter((t) => t.id !== teamId)
//     setTeams(updated)
//     localStorage.setItem(`teams_${userId}`, JSON.stringify(updated))
//   }

//   const deleteMember = (teamId, memberId) => {
//     const updated = teams.map((t) =>
//       t.id === teamId
//         ? { ...t, members: t.members.filter((m) => m.id !== memberId) }
//         : t
//     )
//     setTeams(updated)
//     localStorage.setItem(`teams_${userId}`, JSON.stringify(updated))
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
//         <Button onClick={() => { setShowForm(!showForm); setEditingTeam(null) }} className="bg-blue-600 hover:bg-blue-700">
//           {showForm ? 'Cancel' : 'Create Team'}
//         </Button>
//       </div>

//       {showForm && (
//         <Card>
//           <CardContent className="pt-6">
//             <form onSubmit={handleSubmit(onTeamSubmit)} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Team Name</label>
//                 <input
//                   {...register('teamName', { required: 'Team name is required' })}
//                   type="text"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Design Team"
//                 />
//                 {errors.teamName && <p className="text-red-500 text-sm">{errors.teamName.message}</p>}
//               </div>
//               <div className="flex gap-2">
//                 <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
//                   {editingTeam ? 'Update' : 'Create'} Team
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={() => { setShowForm(false); setEditingTeam(null); reset() }}
//                   variant="outline"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       <div className="grid gap-4">
//         {teams.map((team) => (
//           <Card key={team.id}>
//             <CardHeader>
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle>{team.name}</CardTitle>
//                   <p className="text-sm text-gray-600 mt-1">{(team.members || []).length} members</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => {
//                       setEditingTeam(team)
//                       setShowForm(true)
//                     }}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => deleteTeam(team.id)}
//                     className="text-red-600 hover:bg-red-50"
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {(team.members || []).map((member) => (
//                   <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
//                     <div>
//                       <p className="font-medium text-gray-900">{member.name}</p>
//                       <p className="text-sm text-gray-600">{member.role} • Capacity: {member.capacity}</p>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => deleteMember(team.id, member.id)}
//                       className="text-red-600 hover:bg-red-50"
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 ))}
//               </div>

//               {showMemberForm === team.id ? (
//                 <form onSubmit={handleMemberSubmit(onMemberSubmit)} className="mt-4 p-4 bg-blue-50 rounded space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Member Name</label>
//                     <input
//                       {...registerMember('memberName', { required: 'Name is required' })}
//                       type="text"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="John Doe"
//                     />
//                     {memberErrors.memberName && <p className="text-red-500 text-sm">{memberErrors.memberName.message}</p>}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Role</label>
//                     <input
//                       {...registerMember('role', { required: 'Role is required' })}
//                       type="text"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Designer"
//                     />
//                     {memberErrors.role && <p className="text-red-500 text-sm">{memberErrors.role.message}</p>}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Task Capacity (0-5)</label>
//                     <input
//                       {...registerMember('capacity', {
//                         required: 'Capacity is required',
//                         min: { value: 0, message: 'Minimum is 0' },
//                         max: { value: 5, message: 'Maximum is 5' },
//                       })}
//                       type="number"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="3"
//                     />
//                     {memberErrors.capacity && <p className="text-red-500 text-sm">{memberErrors.capacity.message}</p>}
//                   </div>
//                   <div className="flex gap-2">
//                     <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
//                       Add Member
//                     </Button>
//                     <Button
//                       type="button"
//                       onClick={() => { setShowMemberForm(null); resetMember() }}
//                       variant="outline"
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </form>
//               ) : (
//                 <Button
//                   onClick={() => setShowMemberForm(team.id)}
//                   variant="outline"
//                   className="mt-4 w-full"
//                 >
//                   Add Team Member
//                 </Button>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {teams.length === 0 && !showForm && (
//         <Card>
//           <CardContent className="py-8 text-center text-gray-500">
//             No teams yet. Create your first team to get started.
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }



'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function TeamManager({ userId, teams, setTeams, setActivityLog }) {
  const [showForm, setShowForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [showMemberForm, setShowMemberForm] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { register: registerMember, handleSubmit: handleMemberSubmit, reset: resetMember, formState: { errors: memberErrors } } = useForm()

  const onTeamSubmit = (data) => {
    if (editingTeam) {
      const updated = teams.map((t) =>
        t.id === editingTeam.id ? { ...t, name: data.teamName } : t
      )
      setTeams(updated)
      localStorage.setItem(`teams_${userId}`, JSON.stringify(updated))
      setEditingTeam(null)
    } else {
      const newTeam = {
        id: Date.now(),
        name: data.teamName,
        members: [],
      }
      const updated = [...teams, newTeam]
      setTeams(updated)
      localStorage.setItem(`teams_${userId}`, JSON.stringify(updated))
    }
    setShowForm(false)
    reset()
  }

  const onMemberSubmit = (data) => {
    const teamId = showMemberForm
    const newMember = {
      id: Date.now(),
      name: data.memberName,
      role: data.role,
      capacity: parseInt(data.capacity),
    }
    const updated = teams.map((t) =>
      t.id === teamId
        ? { ...t, members: [...(t.members || []), newMember] }
        : t
    )
    setTeams(updated)
    localStorage.setItem(`teams_${userId}`, JSON.stringify(updated))
    setShowMemberForm(null)
    resetMember()
  }

  const deleteTeam = (teamId) => {
    const updated = teams.filter((t) => t.id !== teamId)
    setTeams(updated)
    localStorage.setItem(`teams_${userId}`, JSON.stringify(updated))
  }

  const deleteMember = (teamId, memberId) => {
    const updated = teams.map((t) =>
      t.id === teamId
        ? { ...t, members: t.members.filter((m) => m.id !== memberId) }
        : t
    )
    setTeams(updated)
    localStorage.setItem(`teams_${userId}`, JSON.stringify(updated))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditingTeam(null) }} className="bg-blue-600 hover:bg-blue-700">
          {showForm ? 'Cancel' : 'Create Team'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onTeamSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Team Name</label>
                <input
                  {...register('teamName', { required: 'Team name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Design Team"
                />
                {errors.teamName && <p className="text-red-500 text-sm">{errors.teamName.message}</p>}
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingTeam ? 'Update' : 'Create'} Team
                </Button>
                <Button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingTeam(null); reset() }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{team.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{(team.members || []).length} members</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingTeam(team)
                      setShowForm(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteTeam(team.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(team.members || []).map((member) => (
                  <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role} • Capacity: {member.capacity}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMember(team.id, member.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              {showMemberForm === team.id ? (
                <form onSubmit={handleMemberSubmit(onMemberSubmit)} className="mt-4 p-4 bg-blue-50 rounded space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Member Name</label>
                    <input
                      {...registerMember('memberName', { required: 'Name is required' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                    {memberErrors.memberName && <p className="text-red-500 text-sm">{memberErrors.memberName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <input
                      {...registerMember('role', { required: 'Role is required' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Designer"
                    />
                    {memberErrors.role && <p className="text-red-500 text-sm">{memberErrors.role.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Task Capacity (0-5)</label>
                    <input
                      {...registerMember('capacity', {
                        required: 'Capacity is required',
                        min: { value: 0, message: 'Minimum is 0' },
                        max: { value: 5, message: 'Maximum is 5' },
                      })}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="3"
                    />
                    {memberErrors.capacity && <p className="text-red-500 text-sm">{memberErrors.capacity.message}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Add Member
                    </Button>
                    <Button
                      type="button"
                      onClick={() => { setShowMemberForm(null); resetMember() }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  onClick={() => setShowMemberForm(team.id)}
                  variant="outline"
                  className="mt-4 w-full"
                >
                  Add Team Member
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {teams.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No teams yet. Create your first team to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
