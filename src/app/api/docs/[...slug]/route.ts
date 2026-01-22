import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const slug = params.slug;
    const filePath = path.join(process.cwd(), 'src/app/kilocode-docs/docs', ...slug) + '.md';

    // Try .md first, then .mdx
    let content = '';
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf-8');
    } else {
      const mdxPath = filePath.replace('.md', '.mdx');
      if (fs.existsSync(mdxPath)) {
        content = fs.readFileSync(mdxPath, 'utf-8');
      } else {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}