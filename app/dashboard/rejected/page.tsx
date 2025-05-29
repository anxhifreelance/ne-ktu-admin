"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Ban,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Business {
  id: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  address: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
  status: "pending" | "accepted" | "rejected";
}

export default function RejectedBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), where("status", "==", "rejected"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const businessData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Business[];

      setBusinesses(businessData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleReconsiderBusiness = async (businessId: string) => {
    try {
      await updateDoc(doc(db, "users", businessId), {
        status: "pending",
      });

      toast({
        title: "Business Reconsidered",
        description: "The business has been moved back to pending review.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reconsider the business. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Rejected Businesses
          </h1>
          <p className="text-gray-600">
            View and manage rejected business applications
          </p>
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
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Rejected Businesses
        </h1>
        <p className="text-gray-600">
          View and manage rejected business applications
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Ban className="h-3 w-3" />
            {businesses.length} Rejected
          </Badge>
        </div>
      </div>

      {businesses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Rejected Businesses
            </h3>
            <p className="text-gray-600 text-center">
              There are no rejected business applications at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Card
              key={business.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {business.businessName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <User className="h-3 w-3" />
                      {business.firstName} {business.lastName}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-red-600 border-red-200"
                  >
                    Rejected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{business.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{business.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{business.address}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleReconsiderBusiness(business.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Reconsider
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
