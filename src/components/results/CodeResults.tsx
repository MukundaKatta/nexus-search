'use client';

import { SearchResult } from '@/types';
import ResultItem from './ResultItem';

interface CodeResultsProps {
  results: SearchResult[];
}

export default function CodeResults({ results }: CodeResultsProps) {
  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <ResultItem key={result.id} result={result} index={index} />
      ))}
    </div>
  );
}
