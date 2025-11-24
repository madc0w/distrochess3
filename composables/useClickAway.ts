/**
 * Composable for handling click-away behavior on modal overlays
 * When a user clicks outside the modal content, the modal should close
 */
export function useClickAway() {
	/**
	 * Handler to be called when clicking on the overlay (outside modal content)
	 * @param closeCallback - Function to call to close the modal
	 * @returns Event handler function for the overlay click
	 */
	const handleOverlayClick = (closeCallback: () => void) => {
		return (event: MouseEvent) => {
			// Only close if clicking directly on the overlay, not on modal content
			// The modal content should have @click.stop to prevent this
			closeCallback();
		};
	};

	/**
	 * Handler to prevent clicks inside modal content from bubbling to overlay
	 * Should be used with @click.stop on the modal content element
	 */
	const handleContentClick = (event: MouseEvent) => {
		event.stopPropagation();
	};

	return {
		handleOverlayClick,
		handleContentClick,
	};
}
