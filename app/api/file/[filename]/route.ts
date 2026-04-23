import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const secret = process.env.FILE_ACCESS_SECRET;
  if (!secret) {
    return new NextResponse('File access is not configured', { status: 503 });
  }

  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || token !== secret) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { filename } = await params;
    
    if (filename.includes('..') || filename.includes('/')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    const uploadDir = '/mnt/user-data/uploads';
    const filePath = path.join(uploadDir, filename);

    const fileBuffer = await fs.readFile(filePath);

    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.mp4') contentType = 'video/mp4';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`
      },
    });
  } catch (error) {
    return new NextResponse('File not found or unreadable', { status: 404 });
  }
}
