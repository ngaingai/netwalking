import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ZooLloween2025() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Section */}
        <Card className="overflow-hidden">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src="/images/zoo-lloween-hero.png"
              alt="Zoo-lloween 2025 - Penguins in Halloween costumes"
              width={1200}
              height={675}
              className="object-cover w-full h-full"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <CardTitle className="text-5xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
                Zoo-lloween 2025 🎃
              </CardTitle>
            </div>
          </div>
          <CardContent className="space-y-6 p-6">
            {/* Event Description - English */}
            <div className="space-y-4">
              <p className="text-lg">
                We'll meet at <strong>11:00</strong> for trick or treating and
                other Halloween activities.
              </p>
              <p className="text-lg">
                Then from <strong>13:00</strong>, we'll walk over to the
                Nogeyama Zoo!
              </p>
            </div>

            {/* Event Description - Japanese */}
            <div className="space-y-4 border-t pt-6">
              <p className="text-lg">
                <strong>11:00</strong>{" "}
                に集合して、トリック・オア・トリートやハロウィンのアクティビティを楽しみます！
              </p>
              <p className="text-lg">
                そのあと <strong>13:00</strong>{" "}
                からは、みんなで野毛山動物園まで歩いて行きましょう！
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What to Bring - English */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Please bring:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 list-disc list-inside text-lg">
              <li>Costumes & empty bag for trick or treating!</li>
              <li>One dish (Party food)</li>
              <li>Candy or snacks (For trick or treating)</li>
              <li>¥2,000 per family</li>
            </ul>
          </CardContent>
        </Card>

        {/* What to Bring - Japanese */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">持ち物：</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 list-disc list-inside text-lg">
              <li>仮装衣装＆トリック・オア・トリート用の空のバッグ</li>
              <li>一品料理（パーティーフード）</li>
              <li>お菓子またはスナック（トリック・オア・トリート用）</li>
              <li>ご家族あたり 2,000 円</li>
            </ul>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MapPinIcon className="h-6 w-6" />
              Address & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">神奈川県 横浜市中区 野毛町 3-133-6</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="w-full sm:w-auto">
                <Link
                  href="https://kashispace.com/room/detail?id=6182"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Location Details
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link
                  href="https://maps.app.goo.gl/2zHeQSMSikRiqq566"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Image */}
        <Card className="overflow-hidden">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src="/images/zoo-lloween-bottom.png"
              alt="Children in animal costumes walking down autumn path during Zoo-lloween"
              width={1200}
              height={675}
              className="object-cover w-full h-full"
            />
          </div>
        </Card>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Zoo-lloween 2025 | NetWalking",
  description: "Special NetWalking event",
  openGraph: {
    title: "Zoo-lloween 2025 | NetWalking",
    description: "Special NetWalking event",
    type: "website",
  },
};
