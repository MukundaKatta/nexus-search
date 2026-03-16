'use client';

interface AIStreamingTextProps {
  text: string;
  isStreaming?: boolean;
}

export default function AIStreamingText({
  text,
  isStreaming = false,
}: AIStreamingTextProps) {
  return (
    <span className={isStreaming ? 'ai-cursor' : ''}>
      {text}
    </span>
  );
}
