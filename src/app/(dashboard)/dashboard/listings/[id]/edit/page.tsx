"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Save, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { ACTIVITY_TYPES, BOAT_TYPES } from "@/lib/constants";
import { PhotoUploadZone } from "@/components/shared/PhotoUploadZone";
import Link from "next/link";

interface ListingPhoto {
  id: string;
  url: string;
  order: number;
  isPrimary: boolean;
}

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photos, setPhotos] = useState<ListingPhoto[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    activityTypeSlugs: [] as string[],
    locationName: "",
    address: "",
    city: "",
    state: "",
    country: "US",
    latitude: 0,
    longitude: 0,
    boatName: "",
    boatType: "",
    boatLength: "",
    boatYear: "",
    boatManufacturer: "",
    pricingType: "PER_PERSON" as "PER_PERSON" | "FLAT_RATE",
    pricePerPerson: "",
    flatPrice: "",
    currency: "USD",
    minGuests: "1",
    maxGuests: "6",
    durationMinutes: "120",
    includedItems: "",
    notIncludedItems: "",
    requirements: "",
    cancellationPolicy: "MODERATE" as "FLEXIBLE" | "MODERATE" | "STRICT",
    instantBook: false,
    status: "DRAFT" as string,
  });

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();

        setForm({
          title: data.title || "",
          description: data.description || "",
          activityTypeSlugs: data.activityTypes?.map((at: { activityType: { slug: string } }) => at.activityType.slug) || [],
          locationName: data.locationName || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "US",
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          boatName: data.boatName || "",
          boatType: data.boatType || "",
          boatLength: data.boatLength?.toString() || "",
          boatYear: data.boatYear?.toString() || "",
          boatManufacturer: data.boatManufacturer || "",
          pricingType: data.pricingType || "PER_PERSON",
          pricePerPerson: data.pricePerPerson?.toString() || "",
          flatPrice: data.flatPrice?.toString() || "",
          currency: data.currency || "USD",
          minGuests: data.minGuests?.toString() || "1",
          maxGuests: data.maxGuests?.toString() || "6",
          durationMinutes: data.durationMinutes?.toString() || "120",
          includedItems: (data.includedItems || []).join(", "),
          notIncludedItems: (data.notIncludedItems || []).join(", "),
          requirements: (data.requirements || []).join(", "),
          cancellationPolicy: data.cancellationPolicy || "MODERATE",
          instantBook: data.instantBook || false,
          status: data.status || "DRAFT",
        });
        setPhotos(data.photos || []);
      } catch {
        toast.error("Failed to load listing");
        router.push("/dashboard/listings");
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [id, router]);

  function updateForm(updates: Partial<typeof form>) {
    setForm((prev) => ({ ...prev, ...updates }));
  }

  function toggleActivityType(slug: string) {
    setForm((prev) => ({
      ...prev,
      activityTypeSlugs: prev.activityTypeSlugs.includes(slug)
        ? prev.activityTypeSlugs.filter((s) => s !== slug)
        : [...prev.activityTypeSlugs, slug],
    }));
  }

  async function handlePhotosUploaded(urls: string[]) {
    try {
      for (const url of urls) {
        const photoRes = await fetch(`/api/listings/${id}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photos: [{
              url,
              order: photos.length,
              isPrimary: photos.length === 0,
            }],
          }),
        });
        if (photoRes.ok) {
          setPhotos(prev => [...prev, {
            id: `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            url,
            order: prev.length,
            isPrimary: prev.length === 0,
          }]);
        }
      }
      toast.success("Photos uploaded");
    } catch {
      toast.error("Failed to save photos");
    }
  }

  async function removePhoto(photoId: string) {
    try {
      await fetch(`/api/listings/${id}/photos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      toast.success("Photo removed");
    } catch {
      toast.error("Failed to remove photo");
    }
  }

  function handlePhotoDragStart(e: React.DragEvent, index: number) {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  }

  function handlePhotoDrop(e: React.DragEvent, targetIndex: number) {
    e.preventDefault();
    const sourceIndex = Number(e.dataTransfer.getData("text/plain"));
    if (sourceIndex === targetIndex) return;

    setPhotos((prev) => {
      const newPhotos = [...prev];
      const [moved] = newPhotos.splice(sourceIndex, 1);
      newPhotos.splice(targetIndex, 0, moved);
      return newPhotos.map((p, i) => ({ ...p, order: i, isPrimary: i === 0 }));
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        locationName: form.locationName,
        address: form.address || undefined,
        city: form.city,
        state: form.state || undefined,
        country: form.country,
        latitude: form.latitude,
        longitude: form.longitude,
        boatName: form.boatName || undefined,
        boatType: form.boatType || undefined,
        boatLength: form.boatLength ? Number(form.boatLength) : undefined,
        boatYear: form.boatYear ? Number(form.boatYear) : undefined,
        boatManufacturer: form.boatManufacturer || undefined,
        pricingType: form.pricingType,
        pricePerPerson:
          form.pricingType === "PER_PERSON" ? Number(form.pricePerPerson) : null,
        flatPrice:
          form.pricingType === "FLAT_RATE" ? Number(form.flatPrice) : null,
        minGuests: Number(form.minGuests),
        maxGuests: Number(form.maxGuests),
        durationMinutes: Number(form.durationMinutes),
        includedItems: form.includedItems
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        notIncludedItems: form.notIncludedItems
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        requirements: form.requirements
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        cancellationPolicy: form.cancellationPolicy,
        instantBook: form.instantBook,
      };

      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
        return;
      }

      toast.success("Listing saved!");
      router.push("/dashboard/listings");
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
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-lg">
            <Link href="/dashboard/listings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-navy">Edit Listing</h1>
          <Badge className={form.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
            {form.status}
          </Badge>
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-ocean hover:bg-ocean-dark text-white">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => updateForm({ title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={5} value={form.description} onChange={(e) => updateForm({ description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Activity Types</Label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_TYPES.map((type) => (
                  <Badge
                    key={type.slug}
                    variant={form.activityTypeSlugs.includes(type.slug) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleActivityType(type.slug)}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Photos</CardTitle>
            <p className="text-sm text-gray-500">Drag to reorder. First photo is the cover.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((photo, i) => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={(e) => handlePhotoDragStart(e, i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handlePhotoDrop(e, i)}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-grab active:cursor-grabbing"
                  >
                    <img src={photo.url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Cover</span>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <GripVertical className="h-3 w-3" />
                      </span>
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {photos.length < 10 && (
              <PhotoUploadZone
                onUpload={handlePhotosUploaded}
                maxPhotos={10}
                currentCount={photos.length}
                uploading={uploadingPhoto}
                setUploading={setUploadingPhoto}
              />
            )}
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Location Name</Label>
              <Input value={form.locationName} onChange={(e) => updateForm({ locationName: e.target.value })} />
            </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input type="number" step="any" value={form.latitude} onChange={(e) => updateForm({ latitude: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input type="number" step="any" value={form.longitude} onChange={(e) => updateForm({ longitude: Number(e.target.value) })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boat Details */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Boat Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Boat Name</Label>
              <Input value={form.boatName} onChange={(e) => updateForm({ boatName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Boat Type</Label>
              <Select value={form.boatType} onValueChange={(v) => updateForm({ boatType: v })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {BOAT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Length (ft)</Label>
                <Input type="number" value={form.boatLength} onChange={(e) => updateForm({ boatLength: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input type="number" value={form.boatYear} onChange={(e) => updateForm({ boatYear: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Manufacturer</Label>
                <Input value={form.boatManufacturer} onChange={(e) => updateForm({ boatManufacturer: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Pricing & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Pricing Type</Label>
              <Select value={form.pricingType} onValueChange={(v) => updateForm({ pricingType: v as "PER_PERSON" | "FLAT_RATE" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PER_PERSON">Per Person</SelectItem>
                  <SelectItem value="FLAT_RATE">Flat Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.pricingType === "PER_PERSON" ? (
              <div className="space-y-2">
                <Label>Price Per Person ($)</Label>
                <Input type="number" min="1" value={form.pricePerPerson} onChange={(e) => updateForm({ pricePerPerson: e.target.value })} />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Flat Price ($)</Label>
                <Input type="number" min="1" value={form.flatPrice} onChange={(e) => updateForm({ flatPrice: e.target.value })} />
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Min Guests</Label>
                <Input type="number" min="1" value={form.minGuests} onChange={(e) => updateForm({ minGuests: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Max Guests</Label>
                <Input type="number" min="1" value={form.maxGuests} onChange={(e) => updateForm({ maxGuests: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input type="number" min="30" value={form.durationMinutes} onChange={(e) => updateForm({ durationMinutes: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Included Items (comma-separated)</Label>
              <Input value={form.includedItems} onChange={(e) => updateForm({ includedItems: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Not Included Items (comma-separated)</Label>
              <Input value={form.notIncludedItems} onChange={(e) => updateForm({ notIncludedItems: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Requirements (comma-separated)</Label>
              <Input value={form.requirements} onChange={(e) => updateForm({ requirements: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Cancellation Policy</Label>
              <Select value={form.cancellationPolicy} onValueChange={(v) => updateForm({ cancellationPolicy: v as "FLEXIBLE" | "MODERATE" | "STRICT" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FLEXIBLE">Flexible - 24h refund</SelectItem>
                  <SelectItem value="MODERATE">Moderate - 5 day refund</SelectItem>
                  <SelectItem value="STRICT">Strict - 50% after 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="instantBook"
                checked={form.instantBook}
                onChange={(e) => updateForm({ instantBook: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="instantBook">Enable instant booking</Label>
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
