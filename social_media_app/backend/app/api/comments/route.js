import { NextResponse } from "next/server";
import commentRepo from "@/repos/commentRepo";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      { error: "postId query param is required" },
      { status: 400 }
    );
  }

  const comments = await commentRepo.getByPost(postId);
  return NextResponse.json(comments);
}

export async function POST(request) {
  const body = await request.json();
  const { postId, authorId, content } = body;

  if (!postId || !authorId || !content) {
    return NextResponse.json(
      { error: "postId, authorId and content are required" },
      { status: 400 }
    );
  }

  const result = await commentRepo.add(postId, authorId, content.trim());
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json(result.comment, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("commentId");
  const userId = searchParams.get("userId");

  if (!commentId || !userId) {
    return NextResponse.json(
      { error: "commentId and userId are required" },
      { status: 400 }
    );
  }

  const result = await commentRepo.delete(commentId, userId);
  if (!result.success) {
    const status = result.error === "Comment not found" ? 404 : 403;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ message: "Comment deleted" });
}