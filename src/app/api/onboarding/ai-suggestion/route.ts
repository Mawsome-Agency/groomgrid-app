import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';

// Mock breed timing data (matches client-side data)
// TODO: Replace with real AI/ML model when available
const BREED_TIMINGS: Record<string, { minMin: number; maxMin: number }> = {
  'Chihuahua': { minMin: 45, maxMin: 60 },
  'Yorkshire Terrier': { minMin: 45, maxMin: 60 },
  'Pomeranian': { minMin: 45, maxMin: 60 },
  'Toy Poodle': { minMin: 45, maxMin: 60 },
  'Maltese': { minMin: 45, maxMin: 60 },
  'Shih Tzu': { minMin: 50, maxMin: 65 },
  'Papillon': { minMin: 45, maxMin: 60 },
  'Boston Terrier': { minMin: 50, maxMin: 65 },
  'French Bulldog': { minMin: 50, maxMin: 65 },
  'Pug': { minMin: 50, maxMin: 65 },
  'Beagle': { minMin: 60, maxMin: 75 },
  'Cocker Spaniel': { minMin: 60, maxMin: 75 },
  'Border Collie': { minMin: 60, maxMin: 75 },
  'Australian Shepherd': { minMin: 60, maxMin: 75 },
  'Corgi': { minMin: 55, maxMin: 70 },
  'Shiba Inu': { minMin: 55, maxMin: 70 },
  'Staffordshire Bull Terrier': { minMin: 55, maxMin: 70 },
  'Whippet': { minMin: 50, maxMin: 65 },
  'Golden Retriever': { minMin: 60, maxMin: 75 },
  'Labrador Retriever': { minMin: 60, maxMin: 75 },
  'German Shepherd': { minMin: 65, maxMin: 80 },
  'Boxer': { minMin: 55, maxMin: 70 },
  'Husky': { minMin: 65, maxMin: 80 },
  'Doberman': { minMin: 55, maxMin: 70 },
  'Great Dane': { minMin: 75, maxMin: 90 },
  'Rottweiler': { minMin: 65, maxMin: 80 },
  'Bernese Mountain Dog': { minMin: 75, maxMin: 90 },
  'Newfoundland': { minMin: 75, maxMin: 90 },
  'Standard Poodle': { minMin: 85, maxMin: 120 },
  'Old English Sheepdog': { minMin: 90, maxMin: 120 },
  'Afghan Hound': { minMin: 90, maxMin: 120 },
  'Komondor': { minMin: 90, maxMin: 120 },
  'Puli': { minMin: 90, maxMin: 120 },
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const breed = searchParams.get('breed');
    const petName = searchParams.get('petName');

    // Mock AI analysis
    // TODO: Replace with actual AI service call
    const breedTiming = BREED_TIMINGS[breed || ''] || { minMin: 60, maxMin: 75 };

    // Generate mock no-show risk (in real implementation, this would use ML)
    const riskRoll = Math.random();
    let noShowRisk: 'low' | 'med' | 'high';
    if (riskRoll < 0.7) {
      noShowRisk = 'low';
    } else if (riskRoll < 0.9) {
      noShowRisk = 'med';
    } else {
      noShowRisk = 'high';
    }

    // Calculate duration (average of min/max)
    const duration = Math.round((breedTiming.minMin + breedTiming.maxMin) / 2);
    const durationLabel = `${breedTiming.minMin}-${breedTiming.maxMin} min`;

    // Mock confidence score
    const confidence = 0.85 + Math.random() * 0.14; // 0.85 - 0.99

    const response = {
      noShowRisk,
      duration,
      durationLabel,
      confidence: Math.round(confidence * 100) / 100,
      benchmark: {
        breed: breed || 'Unknown',
        avgDuration: duration,
        sampleSize: Math.floor(1000 + Math.random() * 2000), // Mock sample size
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI suggestion error:', error);
    return NextResponse.json(
      { error: 'AI service unavailable' },
      { status: 500 }
    );
  }
}
