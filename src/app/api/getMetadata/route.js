import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const metadataPath = path.join(process.cwd(), 'public/metadata.json');
    if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        return new Response(JSON.stringify(metadata), { status: 200 });
    } else {
        return new Response(JSON.stringify({ error: 'No metadata found' }), { status: 404 });
    }
}
