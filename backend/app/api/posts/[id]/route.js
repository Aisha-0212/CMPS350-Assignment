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
  const body = await request.json();
  if (!body.userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  const deletedPost = await postRepo.delete(id, body.userId);
  if (!deletedPost.success) {
    const status = deletedPost.error === "Post not found" ? 404 : 403;
    return NextResponse.json({ deletedPost: deletedPost.error }, { status });
  }
  return NextResponse.json({ message: "Post deleted" });
}
