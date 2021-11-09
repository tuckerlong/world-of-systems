document.addEventListener('DOMContentLoaded', (e) => {
	publish(STORYLINE_EVENTS.PROGRESS_START, data[STORYLINE_ACCESSOR].position);
	publish(STORYLINE_EVENTS.PROGRESS_UPDATE, data[STORYLINE_ACCESSOR].position);
});

function testGems() {
	console.log('Yo')
}


fetch('gems.html')
	.then(res => res.text())
	.then(html => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html').getElementById("gem-s");
		console.log(doc);
		getElement('gems').appendChild(doc);
	})