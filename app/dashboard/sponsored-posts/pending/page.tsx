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
import type { Post } from "@/lib/validations/post";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Calendar, CheckCircle, Clock, Image, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function PendingSponsoredPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("subscriptionStatus", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Post[];

      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprovePost = async (postId: string) => {
    try {
      await updateDoc(doc(db, "posts", postId), {
        subscriptionStatus: "approved",
      });

      toast({
        title: "Post Approved",
        description: "The sponsored post has been successfully approved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectPost = async (postId: string) => {
    try {
      await updateDoc(doc(db, "posts", postId), {
        subscriptionStatus: "rejected",
      });

      toast({
        title: "Post Rejected",
        description: "The sponsored post has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Pending Sponsored Posts
          </h1>
          <p className="text-gray-600">
            Review and approve sponsored post requests
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
          Pending Sponsored Posts
        </h1>
        <p className="text-gray-600">
          Review and approve sponsored post requests
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {posts.length} Pending
          </Badge>
        </div>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-600 text-center">
              No pending sponsored posts at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">
                      {post.author}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <User className="h-3 w-3" />
                      Post by {post.author}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-200"
                  >
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {post.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {post.mediaUrl && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Image className="h-4 w-4" />
                      <span className="truncate">Has media attachment</span>
                    </div>
                  )}
                  <div className="mt-2">
                    <p className="text-gray-700 line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprovePost(post.id)}
                    className="flex-1"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleRejectPost(post.id)}
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
  );
}
