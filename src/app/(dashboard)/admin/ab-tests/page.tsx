'use client';

/**
 * Admin A/B Tests Dashboard
 *
 * Manage and monitor A/B tests. View results, create new tests,
 * start/stop tests, and delete old tests.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ABTest {
  id: string;
  name: string;
  description?: string;
  variantA: Record<string, any>;
  variantB: Record<string, any>;
  splitRatio: number;
  active: boolean;
  startedAt: string;
  endedAt?: string;
  createdAt: string;
  _count: {
    assignments: number;
    conversions: number;
  };
}

interface TestResults {
  testId: string;
  testName: string;
  variantA: {
    views: number;
    conversions: number;
    rate: number;
  };
  variantB: {
    views: number;
    conversions: number;
    rate: number;
  };
  totalConversions: number;
  winner?: 'A' | 'B' | 'inconclusive';
  confidence?: number;
}

export default function ABTestsPage() {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New test form state
  const [newTestName, setNewTestName] = useState('');
  const [newTestDesc, setNewTestDesc] = useState('');
  const [newVariantA, setNewVariantA] = useState('');
  const [newVariantB, setNewVariantB] = useState('');

  // Fetch tests
  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/ab-tests');
      const data = await res.json();
      setTests(data.tests || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (testId: string) => {
    try {
      const res = await fetch(`/api/admin/ab-tests/${testId}/results`);
      const data = await res.json();
      setResults(data.results);
      setShowResults(true);
    } catch (err) {
      console.error('Failed to fetch results:', err);
    }
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/ab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTestName,
          description: newTestDesc,
          variantA: { text: newVariantA },
          variantB: { text: newVariantB },
        }),
      });

      if (res.ok) {
        setNewTestName('');
        setNewTestDesc('');
        setNewVariantA('');
        setNewVariantB('');
        setShowCreateModal(false);
        fetchTests();
      }
    } catch (err) {
      console.error('Failed to create test:', err);
    }
  };

  const handleToggleActive = async (testId: string, currentActive: boolean) => {
    try {
      await fetch(`/api/admin/ab-tests/${testId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      });
      fetchTests();
    } catch (err) {
      console.error('Failed to toggle test:', err);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    
    try {
      await fetch(`/api/admin/ab-tests/${testId}`, {
        method: 'DELETE',
      });
      fetchTests();
    } catch (err) {
      console.error('Failed to delete test:', err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">A/B Tests</h1>
            <p className="mt-1 text-sm text-stone-500">
              Manage and monitor conversion rate experiments
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
          >
            Create Test
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-stone-500">Loading tests...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.length === 0 ? (
              <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
                <p className="text-stone-500">No A/B tests found</p>
                <p className="mt-2 text-sm text-stone-500">
                  Create your first test to start experimenting
                </p>
              </div>
            ) : (
              tests.map((test) => (
                <TestCard
                  key={test.id}
                  test={test}
                  onSelect={() => setSelectedTest(test)}
                  onToggleActive={() => handleToggleActive(test.id, test.active)}
                  onDelete={() => handleDeleteTest(test.id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Test Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-stone-800">
              Create New A/B Test
            </h2>
            <form onSubmit={handleCreateTest}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Test Name
                </label>
                <input
                  type="text"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
                  placeholder="e.g., homepage-cta-v2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Description
                </label>
                <textarea
                  value={newTestDesc}
                  onChange={(e) => setNewTestDesc(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
                  placeholder="What are you testing?"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Variant A
                </label>
                <input
                  type="text"
                  value={newVariantA}
                  onChange={(e) => setNewVariantA(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
                  placeholder="e.g., Start Free Trial"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Variant B
                </label>
                <input
                  type="text"
                  value={newVariantB}
                  onChange={(e) => setNewVariantB(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
                  placeholder="e.g., Try GroomGrid Free"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
                >
                  Create Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Details Modal */}
      {selectedTest && !showResults && (
        <TestDetailModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
          onViewResults={() => fetchResults(selectedTest.id)}
        />
      )}

      {/* Results Modal */}
      {showResults && results && (
        <ResultsModal
          results={results}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}

function TestCard({
  test,
  onSelect,
  onToggleActive,
  onDelete,
}: {
  test: ABTest;
  onSelect: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-stone-800">
              {test.name}
            </h3>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                test.active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {test.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          {test.description && (
            <p className="mb-3 text-sm text-stone-600">{test.description}</p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-stone-500">Variant A</p>
              <p className="text-sm font-medium text-stone-700">
                {JSON.stringify(test.variantA)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Variant B</p>
              <p className="text-sm font-medium text-stone-700">
                {JSON.stringify(test.variantB)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSelect}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm hover:bg-stone-50"
          >
            View
          </button>
          <button
            onClick={onToggleActive}
            className={`rounded-lg px-3 py-2 text-sm ${
              test.active
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {test.active ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800 hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4 text-sm">
        <div className="flex gap-6">
          <div>
            <p className="text-stone-500">Views</p>
            <p className="font-semibold text-stone-800">
              {test._count.assignments}
            </p>
          </div>
          <div>
            <p className="text-stone-500">Conversions</p>
            <p className="font-semibold text-stone-800">
              {test._count.conversions}
            </p>
          </div>
        </div>
        <p className="text-stone-500">
          Created {new Date(test.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

function TestDetailModal({
  test,
  onClose,
  onViewResults,
}: {
  test: ABTest;
  onClose: () => void;
  onViewResults: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-stone-800">
          {test.name}
        </h2>
        {test.description && (
          <p className="mb-4 text-stone-600">{test.description}</p>
        )}
        <div className="mb-4 grid gap-4">
          <div className="rounded-lg bg-stone-50 p-4">
            <h3 className="mb-2 font-semibold text-stone-700">Variant A</h3>
            <pre className="whitespace-pre-wrap text-sm text-stone-600">
              {JSON.stringify(test.variantA, null, 2)}
            </pre>
          </div>
          <div className="rounded-lg bg-stone-50 p-4">
            <h3 className="mb-2 font-semibold text-stone-700">Variant B</h3>
            <pre className="whitespace-pre-wrap text-sm text-stone-600">
              {JSON.stringify(test.variantB, null, 2)}
            </pre>
          </div>
        </div>
        <div className="flex justify-between gap-2">
          <div className="text-sm text-stone-500">
            <p>Split Ratio: {test.splitRatio}% / {100 - test.splitRatio}%</p>
            <p>
              {test.active ? 'Active' : `Ended ${test.endedAt ? new Date(test.endedAt).toLocaleDateString() : 'N/A'}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onViewResults}
              className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
            >
              View Results
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsModal({
  results,
  onClose,
}: {
  results: TestResults;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-stone-800">
          Results: {results.testName}
        </h2>
        <div className="mb-4 grid gap-4">
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
            <h3 className="mb-2 font-semibold text-brand-700">Variant A</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-brand-600">Views</p>
                <p className="text-lg font-bold text-brand-900">
                  {results.variantA.views}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-600">Conversions</p>
                <p className="text-lg font-bold text-brand-900">
                  {results.variantA.conversions}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-600">Rate</p>
                <p className="text-lg font-bold text-brand-900">
                  {results.variantA.rate.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h3 className="mb-2 font-semibold text-purple-700">Variant B</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-purple-600">Views</p>
                <p className="text-lg font-bold text-purple-900">
                  {results.variantB.views}
                </p>
              </div>
              <div>
                <p className="text-xs text-purple-600">Conversions</p>
                <p className="text-lg font-bold text-purple-900">
                  {results.variantB.conversions}
                </p>
              </div>
              <div>
                <p className="text-xs text-purple-600">Rate</p>
                <p className="text-lg font-bold text-purple-900">
                  {results.variantB.rate.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
        {results.winner && results.winner !== 'inconclusive' && (
          <div className="mb-4 rounded-lg bg-green-50 p-4">
            <p className="font-semibold text-green-800">
              🏆 Winner: Variant {results.winner}
              {results.confidence && ` (${Math.round(results.confidence)}% confidence)`}
            </p>
          </div>
        )}
        {results.winner === 'inconclusive' && results.totalConversions > 0 && (
          <div className="mb-4 rounded-lg bg-amber-50 p-4">
            <p className="font-medium text-amber-800">
              Results inconclusive. Need more data for statistical significance.
            </p>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
