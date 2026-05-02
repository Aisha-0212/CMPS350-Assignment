import { NextResponse } from "next/server";
import postRepo from "@/repos/postRepo";

export async function GET(request, { params }) {
  const { id } = await params;
  const post = await postRepo.getById(id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const result = await postRepo.delete(id, userId);
  if (!result.success) {
    const status = result.error === "Post not found" ? 404 : 403;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ message: "Post deleted" });
}
