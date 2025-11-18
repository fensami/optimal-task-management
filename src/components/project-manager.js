'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProjectManager({ userId, teams, projects, setProjects, setActivityLog }) {
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()

  const onSubmit = (data) => {
    if (editingProject) {
      const updated = projects.map((p) =>
        p.id === editingProject.id
          ? { ...p, name: data.projectName, description: data.description, teamId: parseInt(data.teamId) }
          : p
      )
      setProjects(updated)
      localStorage.setItem(`projects_${userId}`, JSON.stringify(updated))
      setEditingProject(null)
    } else {
      const newProject = {
        id: Date.now(),
        name: data.projectName,
        description: data.description,
        teamId: parseInt(data.teamId),
        createdAt: new Date().toISOString(),
      }
      const updated = [...projects, newProject]
      setProjects(updated)
      localStorage.setItem(`projects_${userId}`, JSON.stringify(updated))
    }
    setShowForm(false)
    reset()
  }

  const deleteProject = (projectId) => {
    const updated = projects.filter((p) => p.id !== projectId)
    setProjects(updated)
    localStorage.setItem(`projects_${userId}`, JSON.stringify(updated))
  }

  const getTeamName = (teamId) => {
    return teams.find((t) => t.id === teamId)?.name || 'Unknown'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditingProject(null) }} className="bg-blue-600 hover:bg-blue-700">
          {showForm ? 'Cancel' : 'Create Project'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input
                  {...register('projectName', { required: 'Project name is required' })}
                  type="text"
                  defaultValue={editingProject?.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Website Redesign"
                />
                {errors.projectName && <p className="text-red-500 text-sm">{errors.projectName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...register('description')}
                  defaultValue={editingProject?.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Project details..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Select Team</label>
                <select
                  {...register('teamId', { required: 'Team is required' })}
                  defaultValue={editingProject?.teamId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a team...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {errors.teamId && <p className="text-red-500 text-sm">{errors.teamId.message}</p>}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingProject ? 'Update' : 'Create'} Project
                </Button>
                <Button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingProject(null); reset() }}
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
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Team: {getTeamName(project.teamId)}</p>
                  {project.description && <p className="text-sm text-gray-500 mt-2">{project.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingProject(project)
                      setShowForm(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteProject(project.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {projects.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No projects yet. Create your first project to get started.
          </CardContent>
        </Card>
      )}

      {teams.length === 0 && showForm && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="py-4 text-yellow-800 text-sm">
            Create a team first before creating projects.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
