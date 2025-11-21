import { onBeforeUnmount, onMounted } from 'vue';

export function useEscapeKey(handler: (event: KeyboardEvent) => void) {
	const onKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' || event.key === 'Esc') {
			handler(event);
		}
	};

	onMounted(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', onKeydown);
		}
	});

	onBeforeUnmount(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', onKeydown);
		}
	});
}
