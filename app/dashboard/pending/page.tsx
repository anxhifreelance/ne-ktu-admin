"use client"

import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, Mail, Phone, MapPin, Building, User, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Business {
  id: string
  name: string
  email: string
  phone: string
  address: string
  category: string
  description: string
  contactPerson: string
  registrationDate: string
  status: "pending" | "accepted"
}

export default function PendingBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "businesses"), where("status", "==", "pending"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const businessData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Business[]

      setBusinesses(businessData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleAcceptBusiness = async (businessId: string) => {
    try {
      await updateDoc(doc(db, "businesses", businessId), {
        status: "accepted",
        acceptedDate: new Date().toISOString(),
      })

      toast({
        title: "Business Accepted",
        description: "The business has been successfully accepted and moved to the accepted list.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept the business. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectBusiness = async (businessId: string) => {
    try {
      await deleteDoc(doc(db, "businesses", businessId))

      toast({
        title: "Business Rejected",
        description: "The business application has been rejected and removed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the business. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pending Businesses</h1>
          <p className="text-gray-600">Review and approve business applications</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pending Businesses</h1>
        <p className="text-gray-600">Review and approve business applications</p>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {businesses.length} Pending
          </Badge>
        </div>
      </div>

      {businesses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600 text-center">No pending business applications at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{business.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building className="h-3 w-3" />
                      {business.category}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{business.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{business.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{business.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{business.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(business.registrationDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {business.description && (
                  <>
                    <Separator />
                    <p className="text-sm text-gray-600 line-clamp-2">{business.description}</p>
                  </>
                )}

                <Separator />

                <div className="flex gap-2">
                  <Button onClick={() => handleAcceptBusiness(business.id)} className="flex-1" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleRejectBusiness(business.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
