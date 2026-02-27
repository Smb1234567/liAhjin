'use client';

import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import 'xterm/css/xterm.css';

type TerminalProps = {
  websocketUrl?: string;
};

export default function Terminal({ websocketUrl }: TerminalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new XTerm({
      fontFamily: 'Space Mono, monospace',
      fontSize: 14,
      theme: {
        background: '#0b1120',
        foreground: '#e5e7eb'
      }
    });
    term.open(containerRef.current);
    term.writeln('Initializing sandbox...');

    if (!websocketUrl) {
      term.writeln('No active session. Start a challenge to connect.');
      return () => term.dispose();
    }

    const ws = new WebSocket(websocketUrl);

    ws.onopen = () => {
      term.writeln('Connected.');
      term.onData((data) => ws.send(data));
    };

    ws.onmessage = (event) => {
      term.write(event.data);
    };

    ws.onclose = () => {
      term.writeln('\r\nSession closed.');
    };

    ws.onerror = () => {
      term.writeln('\r\nConnection error.');
    };

    return () => {
      ws.close();
      term.dispose();
    };
  }, [websocketUrl]);

  return <div ref={containerRef} className="h-full w-full" />;
}
