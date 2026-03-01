'use client';

import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import 'xterm/css/xterm.css';

type TerminalProps = {
  websocketUrl?: string;
};

export default function Terminal({ websocketUrl }: TerminalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<XTerm | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    wsRef.current?.close();
    wsRef.current = null;
    termRef.current?.dispose();
    termRef.current = null;

    const term = new XTerm({
      fontFamily: 'JetBrains Mono, Space Mono, monospace',
      fontSize: 14,
      theme: {
        background: '#0b0f16',
        foreground: '#dfe8f6',
        cursor: '#60e1ff',
        cursorAccent: '#0b0f16',
        selectionBackground: 'rgba(96, 225, 255, 0.2)'
      }
    });
    termRef.current = term;

    const openTerminal = () => {
      if (!container || termRef.current !== term) return;
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        requestAnimationFrame(openTerminal);
        return;
      }
      term.open(container);
      term.writeln('Initializing sandbox...');
      if (!websocketUrl) {
        term.writeln('No active session. Start a challenge to connect.');
        return;
      }

      const ws = new WebSocket(websocketUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        term.writeln('Connected.');
        const disposer = term.onData((data) => ws.send(data));
        ws.onclose = () => {
          disposer.dispose();
          term.writeln('\r\nSession closed.');
        };
      };

      ws.onmessage = (event) => {
        term.write(event.data);
      };

      ws.onerror = () => {
        term.writeln('\r\nConnection error.');
      };
    };

    requestAnimationFrame(openTerminal);

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
      termRef.current?.dispose();
      termRef.current = null;
    };
  }, [websocketUrl]);

  return <div ref={containerRef} className="h-full w-full bg-[#0b0f16]" />;
}
