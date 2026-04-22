import { NextResponse } from "next/server";
import StatsRepo from "@/repos/StatsRepo";

export async function GET(request, {params}){
    const [
        avgFollowers,
        avgPosts,
        mostActive,
        mostLiked,
        postsPerMonth,
        mostCommonWord,
        topCommenters,
        mostFollowed,
    ] = await Promise.allSettled([
        StatsRepo.getAverageFollowersPerUser(),
        StatsRepo.getAveragePostsPerUser(),
        StatsRepo.getMostActiveUser(),
        StatsRepo.getMostLikedPost(),
        StatsRepo.getPostsPerMonth(),
        StatsRepo.getMostCommonWord(),
        StatsRepo.getTopCommenters(),
        StatsRepo.getMostFollowedUser(),
    ]);
    const stats = {
        avgFollowers,
        avgPosts,
        mostActive,
        mostLiked,
        postsPerMonth,
        mostCommonWord,
        topCommenters,
        mostFollowed,
    }
    NextResponse.json(stats)
}