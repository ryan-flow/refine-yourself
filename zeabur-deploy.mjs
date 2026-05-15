import {
  createZeaburContext, listProjects, listServices,
  createProject, createService, deployFromSpecification,
  getRepoId, createEnvironmentVariable, waitForServicesRunning,
  getService, executeGraphql
} from '@zeabur/ai-sdk';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const TOKEN = process.env.ZEABUR_TOKEN;

if (!TOKEN || TOKEN === 'your-zeabur-api-token') {
  console.error('Error: Please set ZEABUR_TOKEN or replace it in the script');
  process.exit(1);
}

// Create context: all SDK functions expect (args, context) where context = { graphql: client }
const ctx = createZeaburContext(TOKEN);

function loadEnvFile() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const envPath = resolve(__dirname, '.env.local');
  if (!existsSync(envPath)) {
    console.warn('Warning: .env.local not found, skipping env vars');
    return {};
  }
  const content = readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  const count = Object.keys(env).length;
  console.log(`Loaded ${count} env var(s) from .env.local`);
  return env;
}

async function main() {
  // ── 1. Use Singapore server (user-provided) ──
  console.log('\n=== 1. Server ===');
  const SERVER_ID = process.env.ZEABUR_SERVER_ID || '6a06ef406525bc96a5a76b70';
  const regionCode = `server-${SERVER_ID}`;
  console.log(`Using server: ${regionCode}`);

  // ── 2. Get GitHub repo ID ──
  console.log('\n=== 2. Finding GitHub Repo ===');
  let repoId;
  for (const url of [
    'https://github.com/kukik-s/refine-yourself',
    'https://github.com/oldking-yes/refine-yourself',
  ]) {
    try {
      const result = JSON.parse(await getRepoId({ url }, ctx));
      repoId = result.getRepoId.id;
      console.log(`Found: ${result.getRepoId.full_name} (ID: ${repoId})`);
      break;
    } catch (e) {
      console.warn(`  ${url} → ${e.message}`);
    }
  }
  if (!repoId) throw new Error('Could not find GitHub repo');

  // ── 3. Find or create project ──
  console.log('\n=== 3. Project ===');
  const { projects } = JSON.parse(await listProjects({}, ctx));
  let project = projects.edges.find(e => e.node.name === 'refine-yourself');
  let projectId, envId;

  if (project) {
    projectId = project.node._id;
    envId = project.node.environments[0]._id;
    console.log(`Using existing project: ${projectId}`);
  } else {
    const result = JSON.parse(await createProject({ name: 'refine-yourself', region: regionCode }, ctx));
    projectId = result.createProject._id;
    // Fetch again to get environment ID
    const { projects: p2 } = JSON.parse(await listProjects({}, ctx));
    envId = p2.edges.find(e => e.node._id === projectId).node.environments[0]._id;
    console.log(`Created project: ${projectId}`);
  }

  // ── 4. Find or create service ──
  console.log('\n=== 4. Service ===');
  const svcData = JSON.parse(await listServices({ projectId }, ctx));
  let svc = svcData.services.edges.find(e => e.node.name === 'web');
  let serviceId;

  if (svc) {
    serviceId = svc.node._id;
    console.log(`Using existing service: ${serviceId} (${svc.node.status})`);
  } else {
    const result = JSON.parse(await createService({ name: 'web', projectId }, ctx));
    serviceId = result.createService._id;
    console.log(`Created service: ${serviceId}`);
  }

  // ── 5. Set environment variables ──
  console.log('\n=== 5. Environment Variables ===');
  const env = loadEnvFile();
  if (Object.keys(env).length > 0) {
    for (const [key, value] of Object.entries(env)) {
      try {
        await createEnvironmentVariable({ serviceId, environmentId: envId, key, value }, ctx);
        console.log(`  SET   ${key}`);
      } catch (e) {
        if (e.message?.includes('already exists')) {
          console.log(`  EXISTS ${key}`);
        } else {
          console.warn(`  FAIL  ${key}: ${e.message}`);
        }
      }
    }
  }

  // ── 6. Deploy from GitHub ──
  console.log('\n=== 6. Deploying ===');
  const deployResult = await deployFromSpecification({
    service_id: serviceId,
    source: {
      type: 'BUILD_FROM_SOURCE',
      build_from_source: {
        source: {
          type: 'GITHUB',
          github: { repo_id: repoId, ref: 'main' },
        },
        dockerfile: { content: 'FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\nEXPOSE 3000\nCMD ["npm", "start"]' },
      },
    },
    env: [],
  }, ctx);
  console.log('Deploy response:', deployResult);

  // ── 7. Wait for service to start ──
  console.log('\n=== 7. Waiting for Service ===');
  const status = await waitForServicesRunning({ serviceIds: [serviceId], timeout: 300000, pollInterval: 10000 }, ctx);
  console.log('Status:', status);

  // ── 8. Show domain ──
  console.log('\n=== 8. Domain ===');
  const detail = JSON.parse(await getService({ serviceId }, ctx));
  const domains = detail.service?.domains || [];
  if (domains.length > 0) {
    console.log(`Your site is live at: https://${domains[0].domain}`);
  } else {
    console.log('No domain assigned yet. Check Zeabur dashboard.');
  }

  console.log('\n✓ Done');
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
