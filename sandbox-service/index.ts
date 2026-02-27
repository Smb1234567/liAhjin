import express from 'express';
import cors from 'cors';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { attachPtyServer } from './pty';
import { createContainer, execInContainer, stopContainer, type SessionRecord } from './docker';

const app = express();
const server = http.createServer(app);

const sessions = new Map<string, SessionRecord>();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.post('/session/create', async (req, res) => {
  try {
    const { setup_script } = req.body as { setup_script?: string };
    const containerId = await createContainer();
    const sessionId = uuidv4();

    if (setup_script) {
      await execInContainer(containerId, setup_script);
    }

    const wsBase = process.env.PUBLIC_WS_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const websocket_url = `${wsBase}/ws?session_id=${sessionId}`;

    sessions.set(sessionId, { id: sessionId, containerId, createdAt: Date.now() });

    res.json({ session_id: sessionId, websocket_url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session.' });
  }
});

app.post('/session/validate', async (req, res) => {
  try {
    const { session_id, validator_script } = req.body as { session_id: string; validator_script: string };
    const session = sessions.get(session_id);
    if (!session) return res.status(404).json({ error: 'Session not found.' });

    const output = await execInContainer(session.containerId, validator_script);
    const result = output.includes('PASS') ? 'PASS' : 'FAIL';

    res.json({ result, output });
  } catch (err) {
    res.status(500).json({ error: 'Validation failed.' });
  }
});

app.delete('/session/:id', async (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found.' });
  await stopContainer(session.containerId);
  sessions.delete(req.params.id);
  res.json({ ok: true });
});

attachPtyServer(server, sessions);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Sandbox service listening on ${PORT}`);
});

setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.createdAt > 15 * 60 * 1000) {
      stopContainer(session.containerId);
      sessions.delete(id);
    }
  }
}, 60 * 1000);
