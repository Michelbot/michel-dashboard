import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MEMORY_DIR = process.env.OPENCLAW_MEMORY_DIR || '/root/clawd/memory';

// Determine memory file type from name
function getMemoryType(filename: string): 'daily' | 'project' | 'context' | 'other' {
  // Daily files: 2026-02-05.md
  if (/^\d{4}-\d{2}-\d{2}\.md$/.test(filename)) {
    return 'daily';
  }
  // Project files: project-*.md
  if (filename.startsWith('project-')) {
    return 'project';
  }
  // Context files: context-*.md, MEMORY.md
  if (filename.startsWith('context-') || filename === 'MEMORY.md') {
    return 'context';
  }
  return 'other';
}

// GET: List memory files or get specific file content
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get('file');

  try {
    // If specific file requested, return its content
    if (filePath) {
      // Sanitize path to prevent directory traversal
      const safePath = path.basename(filePath);
      const fullPath = path.join(MEMORY_DIR, safePath);

      try {
        const content = await fs.readFile(fullPath, 'utf-8');
        const stat = await fs.stat(fullPath);

        return NextResponse.json({
          file: {
            name: safePath,
            path: fullPath,
            lastModified: stat.mtime,
            size: stat.size,
            type: getMemoryType(safePath),
          },
          content,
        });
      } catch {
        return NextResponse.json(
          { error: 'File not found', path: safePath },
          { status: 404 }
        );
      }
    }

    // List all memory files
    const files = await fs.readdir(MEMORY_DIR);
    const memoryFiles = [];

    for (const file of files) {
      // Only include markdown files
      if (!file.endsWith('.md')) continue;

      const fullPath = path.join(MEMORY_DIR, file);
      try {
        const stat = await fs.stat(fullPath);
        memoryFiles.push({
          name: file,
          path: fullPath,
          lastModified: stat.mtime,
          size: stat.size,
          type: getMemoryType(file),
        });
      } catch {
        // Skip files we can't stat
      }
    }

    // Sort by last modified (newest first)
    memoryFiles.sort((a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );

    return NextResponse.json({
      files: memoryFiles,
      total: memoryFiles.length,
      directory: MEMORY_DIR,
    });
  } catch (error) {
    console.error('Memory API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to access memory directory',
        directory: MEMORY_DIR,
      },
      { status: 500 }
    );
  }
}
