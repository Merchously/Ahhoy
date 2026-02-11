"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import type { ListingCardData } from "@/types";

const ACTIVITY_TYPES = [
  { slug: "fishing", label: "Fishing" },
  { slug: "jet-ski", label: "Jet Ski" },
  { slug: "yacht-party", label: "Yacht Party" },
  { slug: "sunset-cruise", label: "Sunset Cruise" },
  { slug: "snorkeling-diving", label: "Snorkeling" },
  { slug: "wakeboarding", label: "Watersports" },
  { slug: "boat-rental", label: "Boat Rental" },
  { slug: "custom", label: "Custom" },
];

export function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<ListingCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 1000,
  ]);

  const activeActivityTypes =
    searchParams
      .get("activityType")
      ?.split(",")
      .filter(Boolean) || [];

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      setResults(data.results || []);
      setTotal(data.total || 0);
      setLoading(false);
    }
    fetchListings();
  }, [searchParams]);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/search?${params.toString()}`);
  }

  function toggleActivityType(slug: string) {
    const current = new Set(activeActivityTypes);
    if (current.has(slug)) {
      current.delete(slug);
    } else {
      current.add(slug);
    }
    updateParams({
      activityType: current.size > 0 ? Array.from(current).join(",") : null,
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: query || null });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search header */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search experiences, locations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-11 h-12 rounded-xl border-gray-200 shadow-sm focus:border-ocean focus:ring-ocean"
            />
          </div>
          <Button
            type="submit"
            className="h-12 rounded-xl bg-ocean hover:bg-ocean-dark px-6"
          >
            Search
          </Button>
        </form>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="h-12 rounded-xl md:w-auto w-full border-gray-200"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="rounded-l-2xl">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-8">
              <div>
                <h4 className="font-semibold mb-4">Price Range</h4>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={2000}
                  step={10}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 rounded-lg"
                  onClick={() =>
                    updateParams({
                      minPrice: String(priceRange[0]),
                      maxPrice: String(priceRange[1]),
                    })
                  }
                >
                  Apply Price Filter
                </Button>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Activity Type</h4>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_TYPES.map((type) => (
                    <Badge
                      key={type.slug}
                      variant={
                        activeActivityTypes.includes(type.slug)
                          ? "default"
                          : "outline"
                      }
                      className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors ${
                        activeActivityTypes.includes(type.slug)
                          ? "bg-ocean text-white hover:bg-ocean-dark"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => toggleActivityType(type.slug)}
                    >
                      {type.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Guests</h4>
                <Input
                  type="number"
                  min={1}
                  placeholder="Number of guests"
                  defaultValue={searchParams.get("guests") || ""}
                  className="h-12 rounded-xl"
                  onChange={(e) =>
                    updateParams({
                      guests: e.target.value || null,
                    })
                  }
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Activity type pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ACTIVITY_TYPES.map((type) => (
          <button
            key={type.slug}
            onClick={() => toggleActivityType(type.slug)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeActivityTypes.includes(type.slug)
                ? "bg-ocean text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Active filters */}
      {activeActivityTypes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {activeActivityTypes.map((slug) => {
            const type = ACTIVITY_TYPES.find((t) => t.slug === slug);
            return (
              <Badge
                key={slug}
                variant="secondary"
                className="gap-1.5 rounded-full bg-ocean-light text-ocean px-3 py-1"
              >
                {type?.label || slug}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-ocean-dark"
                  onClick={() => toggleActivityType(slug)}
                />
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
            onClick={() => updateParams({ activityType: null })}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">
        {loading ? (
          "Searching..."
        ) : (
          <>
            <span className="font-semibold text-ocean">{total}</span>{" "}
            experience{total !== 1 ? "s" : ""} found
          </>
        )}
      </p>

      {/* Results grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-navy mb-2">
            No experiences found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filters to find what you&apos;re
            looking for.
          </p>
        </div>
      )}
    </div>
  );
}
