import Docker from 'dockerode';

const docker = new Docker();

export type SessionRecord = {
  id: string;
  containerId: string;
  createdAt: number;
};

export async function createContainer(): Promise<string> {
  const container = await docker.createContainer({
    Image: 'linuxhunter-sandbox:latest',
    Cmd: ['sleep', '900'],
    Tty: true,
    OpenStdin: true,
    HostConfig: {
      AutoRemove: true,
      Memory: 256 * 1024 * 1024,
      NanoCpus: 0.5 * 1e9,
      NetworkMode: 'none',
      PidsLimit: 128
    }
  });

  await container.start();
  return container.id;
}

export async function execInContainer(containerId: string, script: string): Promise<string> {
  const container = docker.getContainer(containerId);
  const exec = await container.exec({
    Cmd: ['bash', '-lc', script],
    AttachStdout: true,
    AttachStderr: true
  });

  return new Promise((resolve, reject) => {
    exec.start((err, stream) => {
      if (err || !stream) return reject(err);
      let output = '';
      stream.on('data', (chunk) => {
        output += chunk.toString();
      });
      stream.on('end', () => resolve(output.trim()));
      stream.on('error', reject);
    });
  });
}

export async function stopContainer(containerId: string) {
  const container = docker.getContainer(containerId);
  try {
    await container.stop({ t: 0 });
  } catch {
    // ignore if already stopped
  }
}
