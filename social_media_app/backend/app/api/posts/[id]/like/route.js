import { NextResponse } from "next/server";
import postRepo from "@/repos/postRepo";

export async function POST(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const result = await postRepo.toggleLike(id, userId);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json(result);
}