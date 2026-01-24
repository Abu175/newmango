import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
    try {
        // Since we are using a custom basePath (/api/facebook), we must specify it for getToken
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
            secureCookie: process.env.NODE_ENV === 'production'
        });

        if (!token || !token.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (token.provider !== 'facebook') {
            return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
        }

        const fbAccessToken = token.accessToken;

        // Fetch accounts (Pages) the user manages
        const response = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${fbAccessToken}`);
        const data = await response.json();

        if (!response.ok) {
            console.error('Facebook Graph API Error:', data);
            return NextResponse.json({ error: data.error?.message || 'Failed to fetch Facebook pages' }, { status: response.status });
        }

        // Return the list of pages
        // Each page in accounts has: name, id, access_token, category, tasks, etc.
        const pages = data.data.map((page: any) => ({
            id: page.id,
            name: page.name,
            access_token: page.access_token,
            category: page.category,
            picture: `https://graph.facebook.com/${page.id}/picture?type=small&access_token=${fbAccessToken}`
        }));

        return NextResponse.json({ pages });

    } catch (error) {
        console.error('Internal Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
