'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ActivityLog({ logs }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reassignments</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">No activity yet.</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 p-3 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-900 min-w-16">{log.time}</div>
                <p className="text-sm text-gray-600">{log.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

