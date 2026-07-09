import {
  Wifi,
  Car,
  ShieldCheck,
  Zap,
  UtensilsCrossed,
  ConciergeBell,
  Cctv,
  Building2,
} from "lucide-react";

const AMENITIES = [
  { title: "Free Wi-Fi", icon: Wifi },
  { title: "Parking", icon: Car },
  { title: "Power Backup", icon: Zap },
  { title: "Restaurant", icon: UtensilsCrossed },
  { title: "Room Service", icon: ConciergeBell },
  { title: "CCTV Security", icon: Cctv },
  { title: "Banquet Hall", icon: Building2 },
  { title: "Safe & Secure", icon: ShieldCheck },
];

export function AmenitiesSection() {
  return (
    <section className="rounded-2xl border bg-background">
      {/* header row */}
      <div className="flex items-end justify-between gap-4 border-b px-6 py-6">
        <h2 className="text-2xl font-semibold tracking-tight">Amenities</h2>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          Included with every stay
        </p>
      </div>

      {/* grid */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {AMENITIES.map((a, i) => {
          const Icon = a.icon;
          return (
            <div
              key={a.title}
              className={[
                "flex flex-col items-center justify-center gap-3 px-6 py-10 text-center",
                "border-muted/60",
                // grid lines
                "border-b md:border-b-0",
                i < 4 ? "md:border-b" : "",
                i % 2 === 0 ? "border-r" : "",
                i % 4 !== 3 ? "md:border-r" : "",
              ].join(" ")}
            >
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted">
                <Icon className="h-7 w-7 text-foreground/80" />
              </div>
              <div className="text-base font-medium">{a.title}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}