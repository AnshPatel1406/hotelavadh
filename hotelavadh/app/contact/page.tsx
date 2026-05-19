import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Badge variant="secondary">Contact</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Get in touch</h1>
        <p className="text-muted-foreground">
          Call or WhatsApp us for enquiries. Directions are available on Google Maps.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Phone</div>
              <a className="font-medium hover:underline" href="tel:+919999999999">
                +91 99999 99999
              </a>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <a className="font-medium hover:underline" href="mailto:info@hotelavadh.com">
                info@hotelavadh.com
              </a>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Address</div>
              <div className="font-medium">Himmatnagar, Gujarat</div>
            </div>

            <div className="flex gap-3">
              <Button asChild variant="outline">
                <a href="tel:+919999999999">Call</a>
              </Button>
              <Button asChild>
                <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-2xl border overflow-hidden bg-muted">
          {/* Replace this iframe later with your real Maps embed */}
          <iframe
            title="Map"
            className="w-full h-[340px]"
            loading="lazy"
            src="https://www.google.com/maps?q=23.733917,72.980000&output=embed"
          />
        </div>
      </div>
    </div>
  );
}