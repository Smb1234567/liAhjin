import { WebSocketServer } from 'ws';
import { spawn } from 'node-pty';
import type { Server } from 'http';
import type { SessionRecord } from './docker';

export function attachPtyServer(server: Server, sessions: Map<string, SessionRecord>) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (socket, request) => {
    const url = new URL(request.url || '', 'http://localhost');
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId || !sessions.has(sessionId)) {
      socket.close();
      return;
    }

    const session = sessions.get(sessionId)!;
    const ptyProcess = spawn('docker', ['exec', '-it', session.containerId, 'bash'], {
      name: 'xterm-color',
      cols: 100,
      rows: 30
    });

    ptyProcess.onData((data) => {
      socket.send(data.toString());
    });

    socket.on('message', (data) => {
      ptyProcess.write(data.toString());
    });

    socket.on('close', () => {
      ptyProcess.kill();
    });
  });
}
