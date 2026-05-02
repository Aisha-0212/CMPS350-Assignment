import { NextResponse } from "next/server";
import postRepo from "@/repos/postRepo";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const authorId = searchParams.get("authorId");
  const search = searchParams.get("search");

  if (search) {
    const posts = await postRepo.search(search);
    return NextResponse.json(posts);
  }
  if (userId) {
    const posts = await postRepo.getFeedPosts(userId);
    return NextResponse.json(posts);
  }
  if (authorId) {
    const posts = await postRepo.getByAuthor(authorId);
    return NextResponse.json(posts);
  }

  const posts = await postRepo.getAll();
  return NextResponse.json(posts);
}

export async function POST(request) {
  const body = await request.json();
  const { authorId, content } = body;

  if (!authorId || !content) {
    return NextResponse.json(
      { error: "authorId and content are required" },
      { status: 400 }
    );
  }
  if (content.trim().length > 500) {
    return NextResponse.json(
      { error: "Post content cannot exceed 500 characters" },
      { status: 400 }
    );
  }

  const newPost = await postRepo.create(authorId, content.trim());
  return NextResponse.json(newPost, { status: 201 });
}