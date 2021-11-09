const logs = [];

function addLog(message, noFade) {
	const logContainer = getElement('logs');
	const anchor = getElement('logs-anchor');
	const ele = document.createElement('div');

	ele.innerText = message;
	ele.classList.add('fade-in');
	ele.style = 'overflow-anchor: none;';

	if (noFade) {
		ele.classList.remove('fade-in');
	}

	logs.push(ele);

	logContainer.scrollTop = logContainer.scrollHeight

	if (logs.length > 20) {
		const logToRemove = logs.shift();
		logToRemove.remove();
	}

	getElement('logs').insertBefore(ele, getElement('logs').firstChild);
}

function collapseLogs() {
	console.log('TEst')
	getElement('section-logs').classList.toggle('logs-collapsed');
}