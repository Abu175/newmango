import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        // Check if user is authenticated and has an access token
        if (!token || !token.accessToken) {
            return NextResponse.json({ error: 'Unauthorized: No access token found' }, { status: 401 });
        }

        // Verify the provider is Facebook (optional but good practice)
        if (token.provider !== 'facebook') {
            return NextResponse.json({ error: 'Unauthorized: Invalid provider' }, { status: 401 });
        }

        const { message, imageUrl, pageId, pageAccessToken } = await req.json();

        if (!message && !imageUrl) {
            return NextResponse.json({ error: 'Content is required (message or imageUrl)' }, { status: 400 });
        }

        const accessToken = pageAccessToken || token.accessToken;
        const targetId = pageId || 'me';

        let endpoint = `https://graph.facebook.com/v18.0/${targetId}/feed`;
        const params = new URLSearchParams({
            access_token: accessToken as string,
        });

        if (imageUrl) {
            endpoint = `https://graph.facebook.com/v18.0/${targetId}/photos`;
            params.append('url', imageUrl);
            if (message) {
                params.append('caption', message);
            }
        } else {
            if (message) {
                params.append('message', message);
            }
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            body: params
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Facebook API Error:', data);
            return NextResponse.json({ error: data.error?.message || 'Failed to post to Facebook' }, { status: response.status });
        }

        return NextResponse.json({ success: true, postId: data.id });

    } catch (error) {
        console.error('Internal Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
