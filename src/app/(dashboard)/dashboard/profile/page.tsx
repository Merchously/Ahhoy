"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save, Upload, User } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
  city: string | null;
  state: string | null;
  country: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    city: "",
    state: "",
    country: "",
    avatarUrl: "",
    email: "",
    role: "",
    createdAt: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error();
        const data: Profile = await res.json();
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          bio: data.bio || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          avatarUrl: data.avatarUrl || "",
          email: data.email || "",
          role: data.role || "",
          createdAt: data.createdAt || "",
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function updateForm(updates: Partial<typeof form>) {
    setForm((prev) => ({ ...prev, ...updates }));
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        updateForm({ avatarUrl: url });
        toast.success("Avatar uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          bio: form.bio,
          city: form.city,
          state: form.state,
          country: form.country,
          avatarUrl: form.avatarUrl,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to save profile");
        return;
      }

      toast.success("Profile saved!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">My Profile</h1>
        <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-ocean hover:bg-ocean-dark text-white">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* Avatar */}
        <Card className="rounded-2xl">
          <CardContent className="flex items-center gap-6 pt-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={form.avatarUrl} />
                <AvatarFallback className="bg-ocean/10 text-ocean text-xl">
                  {form.firstName?.[0]}{form.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="font-semibold text-navy">{form.firstName} {form.lastName}</h3>
              <p className="text-sm text-gray-500">{form.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Member since {form.createdAt ? new Date(form.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
              </p>
              <label className="mt-2 inline-flex items-center gap-1.5 text-sm text-ocean cursor-pointer hover:underline">
                {uploadingAvatar ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                {uploadingAvatar ? "Uploading..." : "Change avatar"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={form.firstName} onChange={(e) => updateForm({ firstName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={form.lastName} onChange={(e) => updateForm({ lastName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => updateForm({ phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                placeholder="Tell guests about yourself..."
                rows={4}
                value={form.bio}
                onChange={(e) => updateForm({ bio: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => updateForm({ city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={form.state} onChange={(e) => updateForm({ state: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={form.country} onChange={(e) => updateForm({ country: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pb-8">
          <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-ocean hover:bg-ocean-dark text-white">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
