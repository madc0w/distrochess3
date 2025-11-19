import { spawn } from 'child_process';

// Use Nuxt's built-in dev with inspect flag
const nuxt = spawn('npx', ['nuxi', 'dev', '--inspect'], {
	stdio: 'inherit',
	shell: true,
	env: process.env,
});

nuxt.on('close', (code) => process.exit(code));
