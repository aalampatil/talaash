"use client";

import PageLoader from "@/components/feedback/PageLoader";
import { UseUserContext } from "@/features/auth/context/UserContext";
import { propertiesApi } from "@/features/properties/services/properties.api";
import { getPropertyImageUrl } from "@/features/properties/utils/propertyImage";
import { useTenantContext } from "@/features/tenant/context/TenantContext";
import type { Property } from "@/types/domain";
import {
  ArrowLeft,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Check,
  Heart,
  House,
  MapPin,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PropertyDetails() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [visitDate, setVisitDate] = useState("");
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [requested, setRequested] = useState(false);
  const { requestVisit, saveProp, removeProp, savedProperties } =
    useTenantContext();
  const { authStatus, user } = UseUserContext();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setProperty(null);
    setError("");
    setActiveImage(0);
    setRequested(false);
    setVisitDate("");
    propertiesApi
      .byId(id, { signal: controller.signal })
      .then(({ data }) => {
        if (data.success && data.data) setProperty(data.data);
        else setError("This home could not be found.");
      })
      .catch((failure) => {
        if (!controller.signal.aborted)
          setError(
            failure.response?.status === 404
              ? "This home is no longer listed."
              : failure.response?.status === 400
                ? "This property link is not valid."
                : "We couldn’t load this home. Please try again.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id, attempt]);
  if (loading) return <PageLoader />;
  if (error || !property)
    return (
      <div
        role="alert"
        className="page-container flex min-h-[65vh] flex-col items-center justify-center py-16 text-center"
      >
        <House size={35} strokeWidth={1.2} className="mb-6" />
        <h1 className="display-title text-4xl">A small detour.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {error || "This home could not be found."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setAttempt((value) => value + 1)}
            className="button-primary"
          >
            Try again
          </button>
          <Link href="/filter-properties" className="button-secondary">
            Explore other homes
          </Link>
        </div>
      </div>
    );
  const saved = savedProperties.some((item) => item._id === property._id);
  const images = property.images?.length
    ? property.images
    : ["/images/property-placeholder.svg"];
  const owner = property.landlordId?.profile;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  async function save() {
    if (!authStatus) {
      router.push("/login/tenant");
      return;
    }
    if (user?.role !== "tenant") {
      toast.info("Saving homes is available to tenant accounts.");
      return;
    }
    setSaving(true);
    try {
      await (saved ? removeProp(id) : saveProp(id));
    } finally {
      setSaving(false);
    }
  }
  async function schedule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!authStatus) {
      router.push("/login/tenant");
      return;
    }
    if (user?.role !== "tenant") {
      toast.info("Visits can be requested from a tenant account.");
      return;
    }
    if (!visitDate || visitDate < today || !property) {
      toast.error("Choose today or a future visit date.");
      return;
    }
    setSending(true);
    try {
      await requestVisit(property._id, visitDate);
      setRequested(true);
      toast.success("Visit request sent to the owner");
    } catch {
      toast.error("We couldn’t request your visit. Please try again.");
    } finally {
      setSending(false);
    }
  }
  const fallbackImage = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = "/images/property-placeholder.svg";
  };
  return (
    <div className="page-container py-8 lg:py-12">
      <Link
        href="/filter-properties"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground"
      >
        <ArrowLeft size={14} />
        Back to homes
      </Link>
      <div className="mb-7 mt-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="eyebrow">Your next chapter, perhaps</span>
            <span className="status-pill" data-status={property.status}>
              {property.status}
            </span>
          </div>
          <h1 className="display-title text-4xl sm:text-5xl">
            {property.title}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={15} />
            {[property.location?.area, property.location?.city]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          aria-pressed={saved}
          className="button-secondary"
        >
          <Heart size={16} fill={saved ? "currentColor" : "none"} />
          {saving
            ? "Updating…"
            : saved
              ? "Saved to favourites"
              : "Save this home"}
        </button>
      </div>
      <div
        className={`grid gap-3 ${images.length > 1 ? "lg:grid-cols-[1.7fr_1fr]" : ""}`}
      >
        <div className="overflow-hidden rounded-2xl bg-secondary">
          <img
            src={getPropertyImageUrl(images[activeImage])}
            onError={fallbackImage}
            alt={`${property.title}, view ${activeImage + 1}`}
            fetchPriority="high"
            className="h-[300px] w-full object-cover sm:h-[450px] lg:h-[510px]"
          />
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {images
              .filter((_, index) => index !== activeImage)
              .slice(0, 2)
              .map((image) => (
                <button
                  key={getPropertyImageUrl(image)}
                  onClick={() => setActiveImage(images.indexOf(image))}
                  aria-label={`Show another view of ${property.title}`}
                  className="overflow-hidden rounded-2xl bg-secondary"
                >
                  <img
                    src={getPropertyImageUrl(image)}
                    onError={fallbackImage}
                    alt="Additional view of the property"
                    className="h-32 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-48 lg:h-[249px]"
                  />
                </button>
              ))}
          </div>
        )}
      </div>
      {images.length > 3 && (
        <div
          aria-label="Property photographs"
          className="mt-3 flex gap-2 overflow-x-auto pb-2"
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              aria-label={`View photo ${index + 1}`}
              aria-pressed={activeImage === index}
              className={`shrink-0 overflow-hidden rounded-lg border-2 ${activeImage === index ? "border-primary" : "border-transparent"}`}
            >
              <img
                src={getPropertyImageUrl(image)}
                onError={fallbackImage}
                alt=""
                className="h-16 w-24 object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <div>
          <div className="flex flex-wrap items-center gap-6 border-b border-border pb-7">
            <span className="flex items-center gap-2 text-sm">
              <BedDouble size={20} strokeWidth={1.3} />
              {property.propertyType.replace("BHK", " BHK")}
            </span>
            <span className="flex items-center gap-2 text-sm">
              <House size={20} strokeWidth={1.3} />
              {property.propertyType === "room"
                ? "Your own room"
                : "A space of your own"}
            </span>
          </div>
          <section className="border-b border-border py-8">
            <h2 className="font-display text-3xl">
              A little about this place.
            </h2>
            <p className="mt-5 whitespace-pre-line text-sm leading-8 text-muted-foreground">
              {property.description ||
                "Picture your everyday here. Request a visit to explore the space and ask the owner about the details that matter to you."}
            </p>
          </section>
          <section className="border-b border-border py-8">
            <h2 className="font-display text-3xl">
              The little things, included.
            </h2>
            {property.amenities?.length ? (
              <div className="mt-6 grid grid-cols-2 gap-4">
                {property.amenities.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-secondary">
                      <Check size={14} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Ask the owner about available amenities during your visit.
              </p>
            )}
          </section>
          <section className="py-8">
            <h2 className="font-display text-3xl">Meet your property owner.</h2>
            <div className="mt-6 flex items-center gap-4">
              {owner?.profilePicture ? (
                <img
                  src={owner.profilePicture}
                  alt="Property owner"
                  className="size-14 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-14 items-center justify-center rounded-full bg-secondary">
                  <UserRound size={24} strokeWidth={1.3} />
                </span>
              )}
              <div>
                <p className="font-semibold">
                  {owner?.name || "Property owner"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your point of contact for this home
                </p>
              </div>
            </div>
            {owner?.email && (
              <a href={`mailto:${owner.email}`} className="text-link mt-5">
                Contact owner <ArrowUpRight size={14} />
              </a>
            )}
          </section>
        </div>
        <aside className="surface p-6 shadow-[0_10px_50px_-25px_#244b3b30] sm:p-8 lg:sticky lg:top-28">
          <p className="eyebrow">A place for your everyday</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight">
            ₹{property.rent.toLocaleString("en-IN")}
            <span className="ml-2 text-xs font-normal tracking-normal text-muted-foreground">
              / month
            </span>
          </p>
          <div className="my-6 border-t border-border" />
          <h2 className="font-display text-2xl">See if it feels like home.</h2>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            Visit the space, meet the owner, and ask all your questions. A new
            beginning is worth a closer look.
          </p>
          {property.status !== "available" ? (
            <p className="mt-6 rounded-xl bg-secondary p-4 text-sm">
              This home is currently occupied. Explore other available spaces.
            </p>
          ) : requested ? (
            <div role="status" className="mt-6 rounded-xl bg-[#e8efdf] p-5">
              <Check size={22} />
              <h3 className="mt-3 font-semibold">
                Your visit request is on its way.
              </h3>
              <p className="mt-2 text-xs leading-6">
                The owner will review your preferred date. Follow its status in
                your visits.
              </p>
              <Link href="/my-visits" className="text-link mt-4">
                View my visits <ArrowUpRight size={14} />
              </Link>
            </div>
          ) : (
            <form onSubmit={schedule} className="mt-6">
              <label className="field">
                Your preferred date
                <input
                  required
                  type="date"
                  min={today}
                  value={visitDate}
                  onChange={(event) => setVisitDate(event.target.value)}
                  className="form-input"
                />
              </label>
              <button
                type="submit"
                disabled={sending || (authStatus && user?.role !== "tenant")}
                className="button-primary mt-4 w-full"
              >
                <CalendarDays size={16} />
                {sending
                  ? "Sending request…"
                  : !authStatus
                    ? "Sign in to request a visit"
                    : "Request a visit"}
              </button>
              {authStatus && user?.role !== "tenant" && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Visits are available to tenant accounts.
                </p>
              )}
            </form>
          )}
          <p className="mt-5 text-center text-[10px] leading-5 text-muted-foreground">
            A request is not a confirmed appointment.
            <br />
            The owner will approve your visit.
          </p>
          <div className="mt-6 border-t border-border pt-5 text-[10px] leading-5 text-muted-foreground">
            Listings are provided by owners and are not independently verified.
            Visit in person before arranging any agreement or payment.
          </div>
        </aside>
      </div>
    </div>
  );
}
