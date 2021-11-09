document.addEventListener('DOMContentLoaded', (e) => {
	publish(STORYLINE_EVENTS.PROGRESS_START, data[STORYLINE_ACCESSOR].position);
	publish(STORYLINE_EVENTS.PROGRESS_UPDATE, data[STORYLINE_ACCESSOR].position);
});