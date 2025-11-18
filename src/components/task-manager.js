'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function TaskManager({ userId, projects, tasks, setTasks, teams, activityLog, setActivityLog }) {
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterProject, setFilterProject] = useState('')
  const [filterMember, setFilterMember] = useState('')
  const [overCapacityWarning, setOverCapacityWarning] = useState(null)
  const [pendingTask, setPendingTask] = useState(null)

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()

  const selectedProjectId = watch('projectId')
  const selectedTeam = selectedProjectId
    ? teams.find((t) => t.id === projects.find((p) => p.id === parseInt(selectedProjectId))?.teamId)
    : null

  const onSubmit = (data) => {
    const memberId = parseInt(data.assignedMemberId)
    const teamMembers = selectedTeam?.members || []
    const member = teamMembers.find((m) => m.id === memberId)
    const memberTasks = tasks.filter((t) => t.assignedMemberId === memberId && t.status !== 'Done')
    
    if (member && memberTasks.length >= member.capacity) {
      setOverCapacityWarning({
        member,
        taskCount: memberTasks.length,
        data,
      })
      setPendingTask(data)
      return
    }

    saveTask(data)
  }

  const saveTask = (data) => {
    if (editingTask) {
      const updated = tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title: data.title,
              description: data.description,
              projectId: parseInt(data.projectId),
              assignedMemberId: data.assignedMemberId ? parseInt(data.assignedMemberId) : null,
              priority: data.priority,
              status: data.status,
            }
          : t
      )
      setTasks(updated)
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(updated))
      setEditingTask(null)
    } else {
      const newTask = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        projectId: parseInt(data.projectId),
        assignedMemberId: data.assignedMemberId ? parseInt(data.assignedMemberId) : null,
        priority: data.priority,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      }
      const updated = [...tasks, newTask]
      setTasks(updated)
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(updated))
    }
    setShowForm(false)
    setOverCapacityWarning(null)
    setPendingTask(null)
    reset()
  }

  const deleteTask = (taskId) => {
    const updated = tasks.filter((t) => t.id !== taskId)
    setTasks(updated)
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(updated))
  }

  const reassignTasks = () => {
    const newTasks = [...tasks]
    let reassignments = []

    teams.forEach((team) => {
      const teamMembers = team.members || []
      const teamTasks = tasks.filter((t) => {
        const project = projects.find((p) => p.id === t.projectId)
        return project?.teamId === team.id
      })

      teamMembers.forEach((member) => {
        const memberTasks = newTasks.filter(
          (t) => t.assignedMemberId === member.id && t.status !== 'Done'
        )

        if (memberTasks.length > member.capacity) {
          const tasksToMove = memberTasks
            .filter((t) => t.priority !== 'High')
            .sort((a, b) => {
              const priorityOrder = { Low: 0, Medium: 1, High: 2 }
              return priorityOrder[a.priority] - priorityOrder[b.priority]
            })
            .slice(0, memberTasks.length - member.capacity)

          tasksToMove.forEach((taskToMove) => {
            const availableMembers = teamMembers.filter((m) => {
              const mTasks = newTasks.filter((t) => t.assignedMemberId === m.id && t.status !== 'Done')
              return mTasks.length < m.capacity && m.id !== member.id
            })

            if (availableMembers.length > 0) {
              const target = availableMembers.sort((a, b) => {
                const aLoad = newTasks.filter((t) => t.assignedMemberId === a.id && t.status !== 'Done').length
                const bLoad = newTasks.filter((t) => t.assignedMemberId === b.id && t.status !== 'Done').length
                return aLoad - bLoad
              })[0]

              const oldMember = member.name
              const newMember = target.name

              newTasks[newTasks.indexOf(taskToMove)] = {
                ...taskToMove,
                assignedMemberId: target.id,
              }

              reassignments.push({
                taskTitle: taskToMove.title,
                from: oldMember,
                to: newMember,
              })
            }
          })
        }
      })
    })

    setTasks(newTasks)
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(newTasks))

    if (reassignments.length > 0) {
      reassignments.forEach((r) => {
        const newLog = {
          id: Date.now() + Math.random(),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          message: `Task "${r.taskTitle}" reassigned from ${r.from} to ${r.to}`,
        }
        setActivityLog((prev) => [newLog, ...prev.slice(0, 9)])
      })
    } else {
      alert('All team members are within capacity!')
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filterProject && task.projectId !== parseInt(filterProject)) return false
    if (filterMember && task.assignedMemberId !== parseInt(filterMember)) return false
    return true
  })

  const getProjectName = (projectId) => {
    return projects.find((p) => p.id === projectId)?.name || 'Unknown'
  }

  const getMemberName = (memberId) => {
    for (const team of teams) {
      const member = team.members?.find((m) => m.id === memberId)
      if (member) return member.name
    }
    return 'Unassigned'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
        <div className="flex gap-2">
          <Button onClick={reassignTasks} className="bg-green-600 hover:bg-green-700">
            Reassign Tasks
          </Button>
          <Button onClick={() => { setShowForm(!showForm); setEditingTask(null) }} className="bg-blue-600 hover:bg-blue-700">
            {showForm ? 'Cancel' : 'Create Task'}
          </Button>
        </div>
      </div>

      {overCapacityWarning && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="py-4">
            <p className="text-yellow-900 font-medium">
              {overCapacityWarning.member.name} has {overCapacityWarning.taskCount} tasks but capacity is{' '}
              {overCapacityWarning.member.capacity}. Assign anyway?
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => saveTask(overCapacityWarning.data)}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Assign Anyway
              </Button>
              <Button
                onClick={() => {
                  setOverCapacityWarning(null)
                  setPendingTask(null)
                }}
                variant="outline"
              >
                Choose Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Task Title</label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  type="text"
                  defaultValue={editingTask?.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Task title..."
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...register('description')}
                  defaultValue={editingTask?.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Task details..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project</label>
                  <select
                    {...register('projectId', { required: 'Project is required' })}
                    defaultValue={editingTask?.projectId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {errors.projectId && <p className="text-red-500 text-sm">{errors.projectId.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    {...register('priority', { required: 'Priority is required' })}
                    defaultValue={editingTask?.priority || 'Medium'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Assign To</label>
                  <select
                    {...register('assignedMemberId')}
                    defaultValue={editingTask?.assignedMemberId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {selectedTeam?.members?.map((member) => {
                      const memberTaskCount = tasks.filter(
                        (t) => t.assignedMemberId === member.id && t.status !== 'Done'
                      ).length
                      return (
                        <option key={member.id} value={member.id}>
                          {member.name} ({memberTaskCount}/{member.capacity})
                        </option>
                      )
                    })}
                  </select>
                  {errors.assignedMemberId && <p className="text-red-500 text-sm">{errors.assignedMemberId.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    {...register('status')}
                    defaultValue={editingTask?.status || 'Pending'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingTask ? 'Update' : 'Create'} Task
                </Button>
                <Button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingTask(null); reset() }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium mb-1">Filter by Project</label>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium mb-1">Filter by Member</label>
          <select
            value={filterMember}
            onChange={(e) => setFilterMember(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Members</option>
            {teams.flatMap((team) =>
              team.members?.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                  {task.description && <p className="text-gray-600 text-sm mt-1">{task.description}</p>}
                  <div className="flex flex-wrap gap-4 mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getProjectName(task.projectId)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === 'Done'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {getMemberName(task.assignedMemberId)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingTask(task)
                      setShowForm(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            {filterProject || filterMember ? 'No tasks match your filters.' : 'No tasks yet. Create your first task to get started.'}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
