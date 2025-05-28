import { collection, addDoc } from "firebase/firestore"
import { db } from "./firebase"

const sampleBusinesses = [
  {
    name: "TechStart Solutions",
    email: "contact@techstart.com",
    phone: "+1 (555) 123-4567",
    address: "123 Innovation Drive, San Francisco, CA 94105",
    category: "Technology",
    description:
      "A cutting-edge software development company specializing in AI and machine learning solutions for enterprise clients.",
    contactPerson: "Sarah Johnson",
    registrationDate: "2024-01-15T10:30:00Z",
    status: "pending",
  },
  {
    name: "Green Earth Consulting",
    email: "info@greenearth.com",
    phone: "+1 (555) 234-5678",
    address: "456 Eco Street, Portland, OR 97201",
    category: "Environmental",
    description:
      "Environmental consulting firm helping businesses reduce their carbon footprint and implement sustainable practices.",
    contactPerson: "Michael Chen",
    registrationDate: "2024-01-18T14:20:00Z",
    status: "pending",
  },
  {
    name: "Artisan Coffee Roasters",
    email: "hello@artisancoffee.com",
    phone: "+1 (555) 345-6789",
    address: "789 Bean Boulevard, Seattle, WA 98101",
    category: "Food & Beverage",
    description: "Small-batch coffee roasting company sourcing premium beans directly from farmers around the world.",
    contactPerson: "Emma Rodriguez",
    registrationDate: "2024-01-20T09:15:00Z",
    status: "pending",
  },
  {
    name: "Digital Marketing Pro",
    email: "team@digitalmarketingpro.com",
    phone: "+1 (555) 456-7890",
    address: "321 Marketing Lane, Austin, TX 78701",
    category: "Marketing",
    description:
      "Full-service digital marketing agency specializing in social media management, SEO, and content creation.",
    contactPerson: "David Kim",
    registrationDate: "2024-01-22T16:45:00Z",
    status: "accepted",
    acceptedDate: "2024-01-23T10:00:00Z",
  },
  {
    name: "Wellness Center Plus",
    email: "info@wellnesscenterplus.com",
    phone: "+1 (555) 567-8901",
    address: "654 Health Street, Denver, CO 80202",
    category: "Healthcare",
    description:
      "Holistic wellness center offering yoga, meditation, massage therapy, and nutritional counseling services.",
    contactPerson: "Lisa Thompson",
    registrationDate: "2024-01-25T11:30:00Z",
    status: "accepted",
    acceptedDate: "2024-01-26T14:20:00Z",
  },
  {
    name: "Urban Design Studio",
    email: "contact@urbandesign.com",
    phone: "+1 (555) 678-9012",
    address: "987 Creative Avenue, New York, NY 10001",
    category: "Design",
    description:
      "Architecture and interior design studio creating modern, sustainable spaces for residential and commercial clients.",
    contactPerson: "Alex Martinez",
    registrationDate: "2024-01-28T13:10:00Z",
    status: "pending",
  },
]

export async function seedDatabase() {
  try {
    for (const business of sampleBusinesses) {
      await addDoc(collection(db, "businesses"), business)
    }
    console.log("Sample data added successfully!")
  } catch (error) {
    console.error("Error adding sample data:", error)
  }
}
