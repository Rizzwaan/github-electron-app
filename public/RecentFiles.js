const fs = require("fs");

const filepath = "./history.json";
let data = [];

function getRecentFolder() {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, "utf-8", (err, result) => {
			if (!err) {
				data = JSON.parse(result);
			}
			resolve(data);
		});
	});
}
function writeRecentFolder(file) {
	console.log(data);
	if (data.indexOf(file) === -1) {
		data.unshift(file);
		fs.writeFile(filepath, JSON.stringify(data), err => {
			if (err) {
				console.log(err);
			} else {
				console.log("recent file saved");
			}
		});
	}
}

module.exports = {
	getRecentFolder,
	writeRecentFolder
};
