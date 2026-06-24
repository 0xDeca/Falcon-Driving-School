"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { FileText, Plus, Edit, Eye, Calendar, Clock, Search } from "lucide-react";
import toast from "react-hot-toast";

const posts = [
  { id: 1, title: "10 Essential Tips for New Drivers in Nigeria", category: "Driving Tips", status: "published" as const, publishedAt: "2025-12-15", author: "Admin" },
  { id: 2, title: "Understanding Nigerian Road Signs", category: "Road Safety", status: "published" as const, publishedAt: "2025-12-10", author: "Admin" },
  { id: 3, title: "How to Get Your Driver's License", category: "Driver Licensing", status: "draft" as const, publishedAt: null, author: "Admin" },
];

export default function AdminBlog() {
  const [showEditor, setShowEditor] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "Driving Tips",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const handleSave = async (status: "draft" | "published") => {
    toast.success(`Post ${status === "published" ? "published" : "saved as draft"} successfully!`);
    setShowEditor(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">Blog Management</h1>
            <Button variant="gold" onClick={() => setShowEditor(!showEditor)}>
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </div>

          {showEditor && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create New Post</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        placeholder="Post title"
                        value={postData.title}
                        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug *</Label>
                      <Input
                        placeholder="post-url-slug"
                        value={postData.slug}
                        onChange={(e) => setPostData({ ...postData, slug: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Excerpt</Label>
                    <Textarea
                      placeholder="Brief summary"
                      rows={2}
                      value={postData.excerpt}
                      onChange={(e) => setPostData({ ...postData, excerpt: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Content *</Label>
                    <Textarea
                      placeholder="Write your post content here (HTML supported)..."
                      rows={12}
                      value={postData.content}
                      onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm"
                        value={postData.category}
                        onChange={(e) => setPostData({ ...postData, category: e.target.value })}
                      >
                        {["Driving Tips", "Road Safety", "Driver Licensing", "Traffic Rules", "Student Success Stories", "Falcon Updates"].map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <Input type="file" accept="image/*" />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-primary mb-4">SEO Metadata</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>SEO Title</Label>
                        <Input
                          placeholder="Meta title"
                          value={postData.seoTitle}
                          onChange={(e) => setPostData({ ...postData, seoTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SEO Description</Label>
                        <Input
                          placeholder="Meta description"
                          value={postData.seoDescription}
                          onChange={(e) => setPostData({ ...postData, seoDescription: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SEO Keywords</Label>
                        <Input
                          placeholder="keyword1, keyword2"
                          value={postData.seoKeywords}
                          onChange={(e) => setPostData({ ...postData, seoKeywords: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="gold" onClick={() => handleSave("published")}>
                      Publish
                    </Button>
                    <Button variant="outline" onClick={() => handleSave("draft")}>
                      Save as Draft
                    </Button>
                    <Button variant="ghost" onClick={() => setShowEditor(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Published</th>
                    <th className="text-left py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-primary">{post.title}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={post.status === "published" ? "success" : "warning"}>
                          {post.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{post.publishedAt || "-"}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
