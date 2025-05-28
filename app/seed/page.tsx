"use client"

import { useState } from "react"
import { seedDatabase } from "@/lib/seed-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Loader2 } from "lucide-react"

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)

  const handleSeed = async () => {
    setLoading(true)
    try {
      await seedDatabase()
      setSeeded(true)
    } catch (error) {
      console.error("Error seeding database:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Database className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Seed Database</CardTitle>
          <CardDescription>Add sample business data to test the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          {seeded ? (
            <div className="text-center">
              <p className="text-green-600 mb-4">Database seeded successfully!</p>
              <Button asChild className="w-full">
                <a href="/login">Go to Login</a>
              </Button>
            </div>
          ) : (
            <Button onClick={handleSeed} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                "Seed Database"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
