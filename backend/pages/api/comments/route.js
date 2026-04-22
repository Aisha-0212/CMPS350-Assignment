import { NextResponse } from "next/server";
import CommentRepo from "@/repos/CommentRepo";

export async function GET(request, {params}){
    const {searchParams} = new URL(request.url);
    const postId = searchParams.get("postId");
    if(!postId){
        return NextResponse.json(
            { error: "postId query param is required" },
            { status: 400 }
        );
    }
    const comments = await CommentRepo.getByPost(postId);
    return NextResponse.json(comments);
}

export async function POST(request, {params}){
    const body = await request.json();
    const {action} = body;
    if(action==="add"){
        if(!body.postId || !body.authorId || !body.content){
            return NextResponse.json(
                {error: "postId, authorId, content are required"},
                {status: 400}
            )
        }
        const postedComment = await CommentRepo.add(body.postId, body.authorId, body.content.trim());
        if(!postedComment.success){
            return NextResponse.json({ error: postedComment.error }, { status: 404 });
        }
        return NextResponse.json(postedComment.comment, { status: 201 });

    }
    if(action ==="delete"){
        if(!body.commentId || !body.userId){
            return NextResponse.json(
                { error: "commentId and userId are required" },
                { status: 400 }
            );
        }
        const result = await CommentRepo.delete(body.commentId, body.userId);
        if (!result.success) {
            const status = result.error === "Comment not found" ? 404 : 403;
            return NextResponse.json({ error: result.error }, { status });
        }
        return NextResponse.json({message: "Comment deleted"})
    }
    return NextResponse.json(
        { error: `Unknown action: ${action}` },
        { status: 400 }
    );

}