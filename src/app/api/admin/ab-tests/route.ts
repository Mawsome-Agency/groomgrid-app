import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAllTests,
  createTest,
  updateTestStatus,
  deleteTest,
} from '@/lib/ab-test-metrics';

// GET - List all tests
export async function GET(req: NextRequest) {
  try {
    const tests = await getAllTests();

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('[Admin AB Tests] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}

// POST - Create new test
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, variantA, variantB, splitRatio } = body;

    if (!name || !variantA || !variantB) {
      return NextResponse.json(
        { error: 'Missing required fields: name, variantA, variantB' },
        { status: 400 }
      );
    }

    const test = await createTest({
      name,
      description,
      variantA,
      variantB,
      splitRatio: splitRatio || 50,
    });

    return NextResponse.json({ test }, { status: 201 });
  } catch (error) {
    console.error('[Admin AB Tests] POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create test' },
      { status: 500 }
    );
  }
}
