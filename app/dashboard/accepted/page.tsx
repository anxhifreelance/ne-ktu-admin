"use client"

import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { CheckCircle, Mail, Phone, MapPin, Building, User, Calendar, Search } from "lucide-react"

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
  acceptedDate: string
  status: "pending" | "accepted"
}

export default function AcceptedBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const q = query(collection(db, "businesses"), where("status", "==", "accepted"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const businessData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Business[]

      setBusinesses(businessData)
      setFilteredBusinesses(businessData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const filtered = businesses.filter(
      (business) =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredBusinesses(filtered)
  }, [searchTerm, businesses])

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Accepted Businesses</h1>
          <p className="text-gray-600">View all approved business accounts</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Accepted Businesses</h1>
        <p className="text-gray-600">View all approved business accounts</p>
        <div className="mt-4 flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {businesses.length} Accepted
          </Badge>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {filteredBusinesses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {searchTerm ? (
              <>
                <Search className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 text-center">No businesses match your search criteria.</p>
              </>
            ) : (
              <>
                <Building className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No accepted businesses</h3>
                <p className="text-gray-600 text-center">No businesses have been accepted yet.</p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{business.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building className="h-3 w-3" />
                      {business.category}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Accepted</Badge>
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
                    <span>Registered: {new Date(business.registrationDate).toLocaleDateString()}</span>
                  </div>
                  {business.acceptedDate && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Accepted: {new Date(business.acceptedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {business.description && (
                  <>
                    <Separator />
                    <p className="text-sm text-gray-600 line-clamp-3">{business.description}</p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
