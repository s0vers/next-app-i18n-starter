import { notFound } from "next/navigation";

export default function CatchAllPage() {
  notFound();
}

export const dynamic = "force-static";
export const revalidate = false;
