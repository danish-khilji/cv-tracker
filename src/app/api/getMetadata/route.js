import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '../../../../lib/db';
import Candidate from '../../../../models/candidate';


export async function GET() {
    try {
        await dbConnect();

        const records = await Candidate.find({});

        return new Response(JSON.stringify(records), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching records:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch records' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}