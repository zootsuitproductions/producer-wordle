export const isBlackKey = (keyNumber) => {
	return [0, 2, 4, 5, 7, 9, 11].includes(keyNumber % 12) ? false : true;
};

export const getDisplayTime = (index, timeDivision) => {
	const time = (8 * index) / timeDivision;
	let displayTime = Math.floor(time) + 1;

	switch (time % 1) {
		case 0.25:
			displayTime += 0.1;
			break;
		case 0.5:
			displayTime += 0.2;
			break;
		case 0.75:
			displayTime += 0.3;
			break;
	}
	return displayTime;
};
