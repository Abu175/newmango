import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
    try {
        // Retrieve token from the custom x-twitter path
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
            secureCookie: process.env.NODE_ENV === 'production'
        });

        if (!token || !token.accessToken) {
            return NextResponse.json({ error: 'Unauthorized: No Twitter access token found' }, { status: 401 });
        }

        if (token.provider !== 'twitter') {
            return NextResponse.json({ error: 'Unauthorized: Invalid provider for this endpoint' }, { status: 401 });
        }

        const { message, imageUrl } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Post content (message) is required' }, { status: 400 });
        }

        const twitterAccessToken = token.accessToken;

        // Note: Twitter v2 API handles text easily. 
        // For images, they must first be uploaded via v1.1 Media Upload API or passed as media IDs if already uploaded.
        // For simplicity in this initial integration, we'll focus on text.
        // If image support is strictly required, we'll need to add a media upload step.

        const response = await fetch('https://api.twitter.com/2/tweets', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${twitterAccessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: message,
                // Uncomment if we add media upload logic
                // media: imageUrl ? { media_ids: [mediaId] } : undefined
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Twitter API Error:', data);
            return NextResponse.json({
                error: data.detail || data.error?.message || 'Failed to post to Twitter'
            }, { status: response.status });
        }

        return NextResponse.json({ success: true, tweetId: data.data.id });

    } catch (error) {
        console.error('Internal Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
