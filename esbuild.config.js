const esbuild = require('esbuild');

const isProduction = process.env.NODE_ENV === 'production';

const commonConfig = {
    bundle: true,
    sourcemap: !isProduction,
    minify: isProduction,
    target: 'es2022',
    platform: 'node',
    external: ['@playwright/test'],
};

async function build() {
    // Build index (main entry point with everything)
    await Promise.all([
        // CJS
        esbuild.build({
            ...commonConfig,
            entryPoints: ['src/index.ts'],
            outfile: 'dist/index.js',
            format: 'cjs',
        }),
        // ESM
        esbuild.build({
            ...commonConfig,
            entryPoints: ['src/index.ts'],
            outfile: 'dist/index.mjs',
            format: 'esm',
        }),
    ]);

    // Build forge-env (runtime only)
    await Promise.all([
        // CJS
        esbuild.build({
            ...commonConfig,
            entryPoints: ['src/forge-env.ts'],
            outfile: 'dist/forge-env.js',
            format: 'cjs',
        }),
        // ESM
        esbuild.build({
            ...commonConfig,
            entryPoints: ['src/forge-env.ts'],
            outfile: 'dist/forge-env.mjs',
            format: 'esm',
        }),
    ]);

    // Build shared-types (types only)
    await Promise.all([
        // CJS
        esbuild.build({
            ...commonConfig,
            entryPoints: ['src/shared-types.ts'],
            outfile: 'dist/shared-types.js',
            format: 'cjs',
        }),
        // ESM
        esbuild.build({
            ...commonConfig,
            entryPoints: ['src/shared-types.ts'],
            outfile: 'dist/shared-types.mjs',
            format: 'esm',
        }),
    ]);

    console.log('✓ Build complete');
}

build().catch((err) => {
    console.error(err);
    process.exit(1);
});
