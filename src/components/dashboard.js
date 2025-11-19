'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TeamManager } from './team-manager'
import { ProjectManager } from './project-manager'
import { TaskManager } from './task-manager'
import { ActivityLog } from './activity-log'
import LogoImage from '../../assets/logo.png'
import Image from 'next/image'

export function Dashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [teams, setTeams] = useState([])
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [activityLog, setActivityLog] = useState([])

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem(`teams_${user.id}`) || '[]')
    const storedProjects = JSON.parse(localStorage.getItem(`projects_${user.id}`) || '[]')
    const storedTasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]')
    const storedLog = JSON.parse(localStorage.getItem(`log_${user.id}`) || '[]')
    
    setTeams(storedTeams)
    setProjects(storedProjects)
    setTasks(storedTasks)
    setActivityLog(storedLog)
  }, [user.id])

  useEffect(() => {
    localStorage.setItem(`log_${user.id}`, JSON.stringify(activityLog))
  }, [activityLog, user.id])

  const logout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'Done').length
  const totalProjects = projects.length

  const getTeamSummary = () => {
    return teams.map((team) => {
      const teamMembers = team.members || []
      return {
        ...team,
        members: teamMembers.map((member) => {
          const memberTasks = tasks.filter((t) => t.assignedMemberId === member.id)
          const isOverCapacity = memberTasks.length > member.capacity
          return {
            ...member,
            taskCount: memberTasks.length,
            isOverCapacity,
          }
        }),
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 md:px-0 py-6  flex justify-between items-center">
          <div>
            <Image src={LogoImage} width={150} height={60} alt='Logo Image'/>
          </div>
          {/* <h1 className="text-3xl font-bold text-gray-900">Opti Task</h1> */}
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.name}</span>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 md:px-0 flex gap-8">
          {['overview', 'teams', 'projects', 'tasks'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-0 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProjects}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTasks}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teams.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Team Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Team Summary - Workload</CardTitle>
              </CardHeader>
              <CardContent>
                {getTeamSummary().length === 0 ? (
                  <p className="text-gray-500">No teams created yet</p>
                ) : (
                  <div className="space-y-4">
                    {getTeamSummary().map((team) => (
                      <div key={team.id} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{team.name}</h3>
                        <div className="space-y-1">
                          {team.members.map((member) => (
                            <div
                              key={member.id}
                              className={`flex justify-between items-center p-2 rounded ${
                                member.isOverCapacity ? 'bg-red-50' : 'bg-gray-50'
                              }`}
                            >
                              <span className={member.isOverCapacity ? 'text-red-700 font-medium' : 'text-gray-700'}>
                                {member.name}
                              </span>
                              <span className={`text-sm ${member.isOverCapacity ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                {member.taskCount}/{member.capacity} tasks
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Log */}
            <ActivityLog logs={activityLog} />
          </div>
        )}

        {activeTab === 'teams' && (
          <TeamManager
            userId={user.id}
            teams={teams}
            setTeams={setTeams}
            setActivityLog={setActivityLog}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectManager
            userId={user.id}
            teams={teams}
            projects={projects}
            setProjects={setProjects}
            setActivityLog={setActivityLog}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManager
            userId={user.id}
            projects={projects}
            tasks={tasks}
            setTasks={setTasks}
            teams={teams}
            activityLog={activityLog}
            setActivityLog={setActivityLog}
          />
        )}
      </div>
    </div>
  )
}
