import { Badge } from "@/components/ui/badge";

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="secondary">Gallery</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Photos</h1>
        <p className="text-muted-foreground">A quick look at rooms, dining, and events.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="h-32 md:h-40 rounded-2xl border bg-muted" />
        ))}
      </div>
    </div>
  );
}