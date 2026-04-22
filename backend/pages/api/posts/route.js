import { NextResponse } from "next/server";
import PostRepo from "@/repos/PostRepo";

export async function GET(request){
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get("userId");
    const authorId = searchParams.get("authorId");
    if(userId){
        const posts = await PostRepo.getFeedPosts(userId);
        return NextResponse.json(posts);
    }
    if(authorId){
        const posts = await PostRepo.getFeedPosts(authorId);
        return NextResponse.json(posts);
    }
    return NextResponse.json(
        { error: "Provide userId or authorId as a query param" },
        { status: 400 }
    )

}

export async function POST(request){
    const body = await request.json();
    if(action==="create"){
        if (!body.authorId || !body.content) {
            return NextResponse.json(
                { error: "authorId and content are required" },
                { status: 400 }
            );
        }
        if(body.content.trim().length>500){
        return NextResponse.json(
                { error: "Post content cannot exceed 500 characters" },
                { status: 400 }
            );
        }
        const newPost = await PostRepo.create(body.authorId, body.content.trim());
        return NextResponse.json(newPost, {status: 201});
    }
    else if(action==="delete"){
        if(!body.postId || !body.userId){
            return NextResponse.json(
                { error: "postId and userId are required" },
                { status: 400 }
            );
        }
        const deletedPost = await PostRepo.delete(body.postId, body.userId);
        if(!deletedPost.success){
            const status = deletedPost.error === "Post not found" ? 404 : 403;
            return NextResponse.json({ error: deletedPost.error }, { status });
        }
        return NextResponse.json({success: true});
    }
    else if(action==="like"){
        if(!body.postId || !body.userId){
            return NextResponse.json(
                { error: "postId and userId are required" },
                { status: 400 }
            )
        }
        const likedPost = await PostRepo.toggleLike(body.postId, body.userId);
        if(!likedPost.success){
            return NextResponse.json({error: likedPost.error}, {status: 404});
        }
        return NextResponse.json(likedPost)
    }
    else{
        return NextResponse.json(
        { error: `Unknown action: ${action}` },
        { status: 400 }
    );
    }
    
}   