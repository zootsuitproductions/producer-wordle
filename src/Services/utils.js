export const isBlackKey = (keyNumber) => {
	return [0, 2, 4, 5, 7, 9, 11].includes(keyNumber % 12) ? false : true;
};
