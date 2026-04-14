import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Alumni } from "@/data/alumni";

export function AlumniCard({ alumni: a }: { alumni: Alumni }) {
  return (
    <Link href={`/alumni/${a.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="flex gap-4 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.avatarUrl}
            alt={a.name}
            className="h-14 w-14 shrink-0 rounded-full"
            width={56}
            height={56}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-[#002E5D]">
                {a.name}
              </h3>
              {a.willingToMentor && (
                <Badge
                  variant="secondary"
                  className="shrink-0 bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0"
                >
                  Mentor
                </Badge>
              )}
            </div>
            <p className="truncate text-sm text-gray-600">
              {a.title} at {a.company}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
              <span>
                {a.city}, {a.state}
              </span>
              <span>Class of {a.graduationYear}</span>
            </div>
            <Badge variant="outline" className="mt-2 text-[10px]">
              {a.industry}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
