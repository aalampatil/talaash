"use client";

import PageHeading from "@/components/ui/page-heading";
import { UseLandlordContext } from "@/features/landlord/context/LandlordContext";
import { ArrowLeft, ArrowUpRight, Check, ImagePlus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const amenities = [
  "WiFi",
  "Air Conditioning",
  "Heating",
  "Parking",
  "Pool",
  "Gym",
  "Elevator",
  "Furnished",
  "Pet Friendly",
  "Security",
];

export default function AddProperty() {
  const { createLandlordProperty } = UseLandlordContext();
  const [form, setForm] = useState({
    title: "",
    description: "",
    rent: "",
    city: "",
    area: "",
    address: "",
    State: "",
    propertyType: "1BHK",
    status: "available",
    amenities: [] as string[],
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);
  function change(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }
  function addImages(files: File[]) {
    const next = [...images, ...files];
    if (next.length > 10) {
      toast.error("Choose up to 10 property images.");
      return;
    }
    if (next.some((file) => !file.type.startsWith("image/"))) {
      toast.error("Please choose image files only.");
      return;
    }
    if (
      next.some((file) => file.size > 10 * 1024 * 1024) ||
      next.reduce((sum, file) => sum + file.size, 0) > 25 * 1024 * 1024
    ) {
      toast.error(
        "Keep each image under 10 MB and your total upload under 25 MB.",
      );
      return;
    }
    setImages(next);
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      data.append(key, Array.isArray(value) ? JSON.stringify(value) : value),
    );
    images.forEach((image) => data.append("images", image));
    try {
      await createLandlordProperty(data);
    } catch {
      setError(
        "Your property could not be published. Check the details and try again.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="dashboard-page">
      <Link
        href="/dashboard/landlord/properties"
        className="mb-7 inline-flex items-center gap-2 text-xs text-muted-foreground"
      >
        <ArrowLeft size={14} />
        Back to your properties
      </Link>
      <PageHeading
        eyebrow="Make room for a new beginning"
        title="Every home has a story."
        description="Tell us about yours. A few thoughtful details help the right tenant picture their life here."
      />
      <form
        onSubmit={submit}
        className="grid items-start gap-8 xl:grid-cols-[1fr_280px]"
      >
        <div className="space-y-6">
          <section className="surface p-6 sm:p-8">
            <SectionHeading
              number="01"
              title="Start with the essentials."
              description="The details that help someone find your space."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="field sm:col-span-2">
                Give your listing a name
                <input
                  required
                  maxLength={160}
                  name="title"
                  placeholder="A sunlit 2 BHK in a quiet neighbourhood"
                  value={form.title}
                  onChange={change}
                  className="form-input"
                />
              </label>
              <label className="field">
                Monthly rent (₹)
                <input
                  required
                  name="rent"
                  type="number"
                  min={0}
                  max={5000000}
                  placeholder="e.g. 18000"
                  value={form.rent}
                  onChange={change}
                  className="form-input"
                />
              </label>
              <label className="field">
                Kind of space
                <select
                  name="propertyType"
                  value={form.propertyType}
                  onChange={change}
                  className="form-input"
                >
                  {["1BHK", "2BHK", "3BHK", "room"].map((type) => (
                    <option key={type} value={type}>
                      {type === "room"
                        ? "Private room"
                        : type.replace("BHK", " BHK")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Availability
                <select
                  name="status"
                  value={form.status}
                  onChange={change}
                  className="form-input"
                >
                  <option value="available">Available to rent</option>
                  <option value="occupied">Currently occupied</option>
                </select>
              </label>
            </div>
          </section>
          <section className="surface p-6 sm:p-8">
            <SectionHeading
              number="02"
              title="Put your place on the map."
              description="A neighbourhood is part of what makes a home."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { name: "city", label: "City", placeholder: "e.g. Pune" },
                {
                  name: "State",
                  label: "State",
                  placeholder: "e.g. Maharashtra",
                },
                {
                  name: "area",
                  label: "Area / neighbourhood",
                  placeholder: "e.g. Baner",
                },
                {
                  name: "address",
                  label: "Street address",
                  placeholder: "Building, street, and locality",
                },
              ].map((field) => (
                <label key={field.name} className="field">
                  {field.label}
                  <input
                    required
                    name={field.name}
                    value={
                      form[field.name as keyof Omit<typeof form, "amenities">]
                    }
                    onChange={change}
                    placeholder={field.placeholder}
                    className="form-input"
                  />
                </label>
              ))}
            </div>
          </section>
          <section className="surface p-6 sm:p-8">
            <SectionHeading
              number="03"
              title="The little things that matter."
              description="Select the amenities your property offers."
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {amenities.map((amenity) => (
                <label
                  key={amenity}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-xs transition-colors ${form.amenities.includes(amenity) ? "border-primary bg-[#eef1e5]" : "border-border"}`}
                >
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(amenity)}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        amenities: event.target.checked
                          ? [...previous.amenities, amenity]
                          : previous.amenities.filter(
                              (value) => value !== amenity,
                            ),
                      }))
                    }
                    className="size-4 accent-primary"
                  />
                  {amenity}
                </label>
              ))}
            </div>
            <label className="field mt-7">
              Tell the story of your space
              <textarea
                name="description"
                rows={5}
                value={form.description}
                onChange={change}
                placeholder="What makes this place special? Think natural light, nearby cafés, transport links, or a favourite corner."
                className="form-input resize-y leading-7"
              />
            </label>
          </section>
          <section className="surface p-6 sm:p-8">
            <SectionHeading
              number="04"
              title="Let your space speak."
              description="Natural light and a tidy room go a long way."
            />
            <label
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (!saving) addImages(Array.from(event.dataTransfer.files));
              }}
              className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-[#adb8a2] bg-secondary/40 px-4 py-9 text-center focus-within:ring-2 focus-within:ring-primary"
            >
              <ImagePlus size={30} strokeWidth={1.2} />
              <span className="mt-4 text-sm font-semibold">
                Choose photos or drop them here
              </span>
              <span className="mt-2 text-[11px] text-muted-foreground">
                Up to 10 images · 10 MB each · 25 MB total
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={saving}
                onChange={(event) => {
                  addImages(Array.from(event.target.files || []));
                  event.target.value = "";
                }}
                className="sr-only"
                aria-label="Upload property photos"
              />
            </label>
            {previews.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previews.map((src, index) => (
                  <div key={src} className="relative">
                    <img
                      src={src}
                      alt={`Property preview ${index + 1}`}
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`Remove photo ${index + 1}`}
                      disabled={saving}
                      onClick={() =>
                        setImages((previous) =>
                          previous.filter((_, i) => i !== index),
                        )
                      }
                      className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-[#f8e8e1] p-4 text-sm text-[#9b4b36]"
            >
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="button-primary">
              {saving ? "Publishing your property…" : "Publish your property"}
              <ArrowUpRight size={16} />
            </button>
            <Link
              href="/dashboard/landlord/properties"
              className="button-secondary"
            >
              Cancel
            </Link>
          </div>
        </div>
        <aside className="surface p-6 xl:sticky xl:top-28">
          <span className="eyebrow">A little guidance</span>
          <h2 className="mt-4 font-display text-2xl">
            Help them feel at home.
          </h2>
          <div className="mt-5 space-y-5">
            {[
              "Use a clear, descriptive title.",
              "Show each room in natural light.",
              "Include an accurate monthly rent.",
              "Share what you love about the neighbourhood.",
            ].map((text) => (
              <p
                key={text}
                className="flex items-start gap-2 text-xs leading-6 text-muted-foreground"
              >
                <Check size={14} className="mt-1 shrink-0 text-primary" />
                {text}
              </p>
            ))}
          </div>
          <p className="mt-6 border-t border-border pt-5 text-[11px] leading-6 text-muted-foreground">
            Your listing will be visible to people exploring Talaash when its
            status is available.
          </p>
        </aside>
      </form>
    </div>
  );
}

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="eyebrow mb-2">Chapter {number}</p>
      <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
