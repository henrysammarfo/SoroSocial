"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Database, Play, CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function DatabaseSetupPage() {
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [status, setStatus] = useState<{
    database: 'checking' | 'ready' | 'not_setup' | 'error'
    tables: number
    message: string
  }>({
    database: 'checking',
    tables: 0,
    message: ''
  })

  const checkDatabaseStatus = async () => {
    try {
      setStatus({ database: 'checking', tables: 0, message: 'Checking database status...' })
      
      const response = await fetch('/api/setup-database')
      const result = await response.json()
      
      if (result.success) {
        if (result.data?.status === 'existing' || result.data?.status === 'ready') {
          setStatus({ database: 'ready', tables: 9, message: 'Database is ready!' })
        } else {
          setStatus({ database: 'not_setup', tables: 0, message: result.data?.message || 'Database needs setup' })
        }
      } else {
        setStatus({ database: 'error', tables: 0, message: result.error || 'Database check failed' })
      }
    } catch (error) {
      setStatus({ 
        database: 'error', 
        tables: 0, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  const setupDatabase = async () => {
    try {
      setIsSettingUp(true)
      setStatus({ database: 'checking', tables: 0, message: 'Setting up database...' })
      
      const response = await fetch('/api/setup-database', {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (result.success) {
        setStatus({ database: 'ready', tables: 9, message: 'Database setup completed!' })
        toast({
          title: "Success!",
          description: result.message
        })
      } else {
        setStatus({ database: 'error', tables: 0, message: result.error || 'Setup failed' })
        toast({
          title: "Setup Failed",
          description: result.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      setStatus({ 
        database: 'error', 
        tables: 0, 
        message: error instanceof Error ? error.message : 'Setup failed' 
      })
      toast({
        title: "Setup Failed",
        description: "An error occurred during setup",
        variant: "destructive"
      })
    } finally {
      setIsSettingUp(false)
    }
  }

  const getStatusIcon = () => {
    switch (status.database) {
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'not_setup':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'checking':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      default:
        return <Database className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (status.database) {
      case 'ready':
        return 'text-green-700 dark:text-green-400'
      case 'not_setup':
        return 'text-red-700 dark:text-red-400'
      case 'error':
        return 'text-red-700 dark:text-red-400'
      case 'checking':
        return 'text-blue-700 dark:text-blue-400'
      default:
        return 'text-gray-700 dark:text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Database Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Set up the SoroSocial database schema and check system status
          </p>
        </div>

        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Database Status
            </CardTitle>
            <CardDescription>
              Current status of the database and required tables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-medium ${getStatusColor()}`}>
                  {status.message || 'Checking...'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {status.tables > 0 ? `${status.tables} tables configured` : 'Tables not configured'}
                </div>
              </div>
              <Button onClick={checkDatabaseStatus} variant="outline" size="sm">
                Check Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Schema
            </CardTitle>
            <CardDescription>
              Create the required database tables for SoroSocial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>The following tables will be created:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>users</strong> - User profiles and trader information</li>
                <li><strong>follows</strong> - Social graph relationships</li>
                <li><strong>trades</strong> - Trading history and execution</li>
                <li><strong>copy_executions</strong> - Copy trading records</li>
                <li><strong>performance_metrics</strong> - Trader performance data</li>
                <li><strong>posts</strong> - Social media posts</li>
                <li><strong>comments</strong> - Post comments</li>
                <li><strong>notifications</strong> - Real-time notifications</li>
                <li><strong>activity_feed</strong> - Social activity stream</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={setupDatabase} 
                disabled={isSettingUp || status.database === 'ready'}
                className="flex-1"
              >
                {isSettingUp ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : status.database === 'ready' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Database Ready
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Setup Database
                  </>
                )}
              </Button>
            </div>

            {status.database === 'not_setup' && (
              <div className="text-sm text-amber-600 dark:text-amber-400">
                <p><strong>Note:</strong> If automatic setup fails, you can manually create the tables by copying the SQL schema from <code>supabase-schema.sql</code> and running it in your Supabase SQL Editor.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Setup (Alternative)</CardTitle>
            <CardDescription>
              If automatic setup fails, follow these steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Go to your Supabase dashboard</li>
              <li>Navigate to SQL Editor</li>
              <li>Copy the content from <code>supabase-schema.sql</code></li>
              <li>Paste and run the SQL script</li>
              <li>Refresh this page to verify setup</li>
            </ol>
          </CardContent>
        </Card>

        {/* Quick Test */}
        {status.database === 'ready' && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Test</CardTitle>
              <CardDescription>
                Test the database functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => window.location.href = '/admin/demo-seed'}
                  className="w-full"
                >
                  Seed Demo Data
                </Button>
                <Button 
                  onClick={() => window.location.href = '/app'}
                  variant="outline"
                  className="w-full"
                >
                  Test Frontend
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}