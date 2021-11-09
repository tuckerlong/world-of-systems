loadSection('gems.html', 'gems', () => {
	for (let i = 0; i < 10; i++) {
		getElement(`gem-${i}`).src = 'src/img/blank.png';
	}
});