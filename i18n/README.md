# Internationalization (i18n)

This directory contains translation files for the application.

## Usage

Use the `useI18n()` composable in any component:

```vue
<script setup>
const { t } = useI18n();
</script>

<template>
	<h1>{{ t.app.title }}</h1>
</template>
```

## Adding a new language

1. Create a new file (e.g., `fr.ts`) with the same structure as `en.ts`
2. Add the import and register it in `index.ts`
3. Ensure it is exported from `i18n/index.ts` so the `useI18n` composable can load it automatically.

The application automatically detects the browser's language preference (or saved user preference) and falls back to English if the preferred language is not available.
