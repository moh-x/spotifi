// Fisher-Yates Shuffle Algorithm -
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

export function shuffle(array) {
	const newArray = array;

	for (let i = newArray.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

		// swap elements array[i] and array[j]
		// we use "destructuring assignment" syntax to achieve that
		// you'll find more details about that syntax in later chapters
		// same can be written as:
		// let t = array[i]; array[i] = array[j]; array[j] = t
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
}

export function formatDuration(millis) {
	const minutes = Math.floor(millis / 60000);
	const seconds = ((millis % 60000) / 1000).toFixed(0);

	return seconds == 60
		? `${minutes + 1}:00`
		: `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
