"use client";

import { useState } from "react";
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
import { Loader2, ArrowLeft, ArrowRight, Check, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { ACTIVITY_TYPES, BOAT_TYPES } from "@/lib/constants";

const steps = ["Basic Info", "Location", "Boat Details", "Photos", "Pricing", "Review"];

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    activityTypeIds: [] as string[],
    locationName: "",
    city: "",
    state: "",
    country: "US",
    latitude: 25.7617,
    longitude: -80.1918,
    boatName: "",
    boatType: "",
    boatLength: "",
    boatYear: "",
    boatManufacturer: "",
    photos: [] as string[],
    pricingType: "PER_PERSON" as "PER_PERSON" | "FLAT_RATE",
    pricePerPerson: "",
    flatPrice: "",
    minGuests: "1",
    maxGuests: "6",
    durationMinutes: "120",
    includedItems: "",
    cancellationPolicy: "MODERATE" as "FLEXIBLE" | "MODERATE" | "STRICT",
    instantBook: false,
  });

  function updateForm(updates: Partial<typeof form>) {
    setForm((prev) => ({ ...prev, ...updates }));
  }

  function toggleActivityType(id: string) {
    setForm((prev) => ({
      ...prev,
      activityTypeIds: prev.activityTypeIds.includes(id)
        ? prev.activityTypeIds.filter((i) => i !== id)
        : [...prev.activityTypeIds, id],
    }));
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    const remaining = 10 - form.photos.length;
    const toUpload = Array.from(files).slice(0, remaining);

    if (toUpload.length === 0) {
      toast.error("Maximum 10 photos allowed");
      return;
    }

    setUploadingPhoto(true);
    try {
      for (const file of toUpload) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const { url } = await res.json();
          setForm((prev) => ({ ...prev, photos: [...prev.photos, url] }));
        } else {
          const data = await res.json();
          toast.error(data.error || "Failed to upload photo");
        }
      }
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
      // Reset the input so the same file can be selected again
      e.target.value = "";
    }
  }

  function removePhoto(index: number) {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit() {
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        activityTypeIds: form.activityTypeIds,
        locationName: form.locationName || `${form.city}, ${form.state}`,
        city: form.city,
        state: form.state,
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
          form.pricingType === "PER_PERSON" ? Number(form.pricePerPerson) : undefined,
        flatPrice:
          form.pricingType === "FLAT_RATE" ? Number(form.flatPrice) : undefined,
        minGuests: Number(form.minGuests),
        maxGuests: Number(form.maxGuests),
        durationMinutes: Number(form.durationMinutes),
        includedItems: form.includedItems
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        cancellationPolicy: form.cancellationPolicy,
        instantBook: form.instantBook,
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to create listing");
        setLoading(false);
        return;
      }

      const listing = await res.json();

      // Save photos to the listing
      if (form.photos.length > 0) {
        const photosRes = await fetch(`/api/listings/${listing.id}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photos: form.photos.map((url, i) => ({
              url,
              order: i,
              isPrimary: i === 0,
            })),
          }),
        });

        if (!photosRes.ok) {
          // Listing was created but photos failed — still redirect, just warn
          toast.warning("Listing created but some photos could not be saved.");
        }
      }

      toast.success("Listing created! You can now publish it.");
      router.push("/dashboard/listings");
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-sm hidden md:block">{label}</span>
            {i < steps.length - 1 && (
              <div className="w-8 h-0.5 bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g., Deep Sea Fishing Adventure in Miami"
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your experience in detail..."
                  rows={5}
                  value={form.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Activity Types</Label>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_TYPES.map((type) => (
                    <Badge
                      key={type.slug}
                      variant={
                        form.activityTypeIds.includes(type.slug)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleActivityType(type.slug)}
                    >
                      {type.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Location Name</Label>
                <Input
                  placeholder="e.g., Miami Beach Marina"
                  value={form.locationName}
                  onChange={(e) => updateForm({ locationName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    placeholder="Miami Beach"
                    value={form.city}
                    onChange={(e) => updateForm({ city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    placeholder="FL"
                    value={form.state}
                    onChange={(e) => updateForm({ state: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) =>
                      updateForm({ latitude: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) =>
                      updateForm({ longitude: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Boat Details */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label>Boat Name</Label>
                <Input
                  placeholder="e.g., Sea Breeze"
                  value={form.boatName}
                  onChange={(e) => updateForm({ boatName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Boat Type</Label>
                <Select
                  value={form.boatType}
                  onValueChange={(v) => updateForm({ boatType: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOAT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Length (ft)</Label>
                  <Input
                    type="number"
                    value={form.boatLength}
                    onChange={(e) => updateForm({ boatLength: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={form.boatYear}
                    onChange={(e) => updateForm({ boatYear: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Manufacturer</Label>
                  <Input
                    value={form.boatManufacturer}
                    onChange={(e) =>
                      updateForm({ boatManufacturer: e.target.value })
                    }
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Photos */}
          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label>Photos (up to 10)</Label>
                <p className="text-sm text-gray-500">
                  The first photo will be the cover image. Max 5MB per file (JPEG, PNG, WebP, GIF).
                </p>
              </div>

              {form.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {form.photos.map((url, i) => (
                    <div
                      key={url}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden group"
                    >
                      <img
                        src={url}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {form.photos.length < 10 && (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                  {uploadingPhoto ? (
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-500 mt-2">
                    {uploadingPhoto
                      ? "Uploading..."
                      : "Click to upload photos"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {form.photos.length}/10 photos
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                  />
                </label>
              )}
            </>
          )}

          {/* Step 4: Pricing */}
          {step === 4 && (
            <>
              <div className="space-y-2">
                <Label>Pricing Type</Label>
                <Select
                  value={form.pricingType}
                  onValueChange={(v) =>
                    updateForm({
                      pricingType: v as "PER_PERSON" | "FLAT_RATE",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PER_PERSON">Per Person</SelectItem>
                    <SelectItem value="FLAT_RATE">Flat Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.pricingType === "PER_PERSON" ? (
                <div className="space-y-2">
                  <Label>Price Per Person ($)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.pricePerPerson}
                    onChange={(e) =>
                      updateForm({ pricePerPerson: e.target.value })
                    }
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Flat Price ($)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.flatPrice}
                    onChange={(e) => updateForm({ flatPrice: e.target.value })}
                  />
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Min Guests</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.minGuests}
                    onChange={(e) => updateForm({ minGuests: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Guests</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.maxGuests}
                    onChange={(e) => updateForm({ maxGuests: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input
                    type="number"
                    min="30"
                    value={form.durationMinutes}
                    onChange={(e) =>
                      updateForm({ durationMinutes: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Included Items (comma-separated)</Label>
                <Input
                  placeholder="Life jackets, Snacks, Fishing gear"
                  value={form.includedItems}
                  onChange={(e) =>
                    updateForm({ includedItems: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Cancellation Policy</Label>
                <Select
                  value={form.cancellationPolicy}
                  onValueChange={(v) =>
                    updateForm({
                      cancellationPolicy: v as "FLEXIBLE" | "MODERATE" | "STRICT",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FLEXIBLE">Flexible - 24h refund</SelectItem>
                    <SelectItem value="MODERATE">Moderate - 5 day refund</SelectItem>
                    <SelectItem value="STRICT">Strict - 50% after 7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-3 text-sm">
              <p><strong>Title:</strong> {form.title}</p>
              <p><strong>Description:</strong> {form.description.slice(0, 100)}...</p>
              <p><strong>Location:</strong> {form.locationName || form.city}</p>
              <p>
                <strong>Price:</strong>{" "}
                {form.pricingType === "PER_PERSON"
                  ? `$${form.pricePerPerson}/person`
                  : `$${form.flatPrice} flat`}
              </p>
              <p><strong>Duration:</strong> {form.durationMinutes} min</p>
              <p><strong>Guests:</strong> {form.minGuests}-{form.maxGuests}</p>
              {form.boatName && <p><strong>Boat:</strong> {form.boatName} ({form.boatType})</p>}
              <p>
                <strong>Photos:</strong>{" "}
                {form.photos.length > 0
                  ? `${form.photos.length} photo${form.photos.length !== 1 ? "s" : ""}`
                  : "None"}
              </p>
              {form.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-1">
                  {form.photos.map((url, i) => (
                    <img
                      key={url}
                      src={url}
                      alt={`Photo ${i + 1}`}
                      className="w-16 h-12 rounded object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              )}
              <p className="text-muted-foreground mt-4">
                Your listing will be saved as a draft. You can publish it from your listings page.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Listing
          </Button>
        )}
      </div>
    </div>
  );
}
