import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserRating, submitRating } from "@/lib/db/ratings";

/**
 * GET /api/ratings?productId=xxx
 * Get the current user's rating for a product
 */
export async function GET(req: Request) {
    const session = await auth();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
        return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    // If not logged in, return null rating
    if (!session?.user?.id) {
        return NextResponse.json({ rating: null, loggedIn: false });
    }

    const rating = await getUserRating(productId, session.user.id);
    return NextResponse.json({ rating, loggedIn: true });
}

/**
 * POST /api/ratings
 * Submit or update a rating
 * Body: { productId: string, rating: number }
 */
export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { productId, rating } = body;

        if (!productId || typeof rating !== "number") {
            return NextResponse.json(
                { error: "productId and rating required" },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        await submitRating(productId, session.user.id, rating);

        return NextResponse.json({ success: true, rating });
    } catch (error: any) {
        console.error("Error submitting rating:", error);
        return NextResponse.json(
            { error: "Failed to submit rating", details: error.message },
            { status: 500 }
        );
    }
}
