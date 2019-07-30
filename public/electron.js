const electron = require("electron");

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const { ipcMain } = require("electron");

const { createLoginWindow } = require("./GitoAuth/GitoAuth");

const { getRecentFolder, writeRecentFolder } = require("./RecentFiles");

const git = require("simple-git");

const path = require("path");

const isDev = require("electron-is-dev");

let directoryPath = null;
let mainWindow;
let filter;
let recentFiles = [];
let currentBranch = "";
let allBranch = [];

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 900,
		height: 680,

		webPreferences: {
			nodeIntegration: true
		}
	});
	mainWindow.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);
	mainWindow.on("closed", () => (mainWindow = null));
}

// load window when app is ready
app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on("github-oauth", (event, data) => {
	createLoginWindow();
});

// get all branches
ipcMain.on("path-recieved", (event, data) => {
	try {
		initilize(data);
	} catch (err) {
		mainWindow.webContents.send("ERROR", "Not a git repository");
	}
});

const initilize = data => {
	directoryPath = data;
	writeRecentFolder(data);
	git(directoryPath).status((err, data) => {
		currentBranch = data.current;
		git(directoryPath).branchLocal((err, result) => {
			allBranch = result.all;
			gitLog(directoryPath, currentBranch);
		});
	});
};

// get all commits and write its files in local object
const gitLog = (directoryPath, branch) => {
	git(directoryPath).log([branch], (err, res) => {
		if (!err) {
			let allHash = [...res.all];

			console.log(directoryPath);
			mainWindow.webContents.send("SHOW-COMMITS", allHash);
			mainWindow.webContents.send("REPO", directoryPath);
			mainWindow.webContents.send("files", {
				files: [],
				currentBranch,
				allBranch
			});
		} else {
			console.log(err);
		}
	});
};

// get all files changes in hash
const getFileChanges = curr => {
	console.log(curr);
	try {
		git(directoryPath).diff(["-U1000", curr + "^"], (err, data) => {
			if (err) {
				// console.log('errdawdwadawdawdadawdawdwadwd');
				git(directoryPath).show(curr, (err, data1) => {
					if (!err) {
						// console.log('data received yeah.................');
						console.log(data1);
						getDiffPerFile(
							data1
								.split("\n")
								.splice(6)
								.join("\n")
						);
					} else {
						console.log("err no 2", err);
					}
				});
			} else {
				// console.log(data);
				getDiffPerFile(data);
			}
		});
	} catch (err) {
		console.log("dawad", err);
	}
};

const getDiffPerFile = data => {
	{
		let array = data.split("\n"); /* As code is in string format*/
		let fileName = "";
		let skip = 5;
		let gotFileName = false;
		let newFile = RegExp(
			"^(diff --git )a(/.+?[/| ]){1,}b(/.+)(.+)$"
		); /* diff --git a/... b/...*/
		let fileNameRegex = /(?:(?:b(?:\/(?:.+\/)?){1,}))(.+)/;
		filter = array.reduce((obj, item) => {
			if (newFile.test(item)) {
				fileName = fileNameRegex.exec(
					item
				)[1]; /* extract filename from string*/
				obj[fileName] = [];
				skip = 4;
				return obj;
			}
			if (skip > 0) {
				skip--;
				return obj;
			} else {
				obj[fileName].push(item);
				return obj;
			}
		}, {});
		// console.log(filter);
	}
};

// Get all files in hash

// Get all files in hash
ipcMain.on("GET-FILES-IN-HASH", (event, currHash) => {
	console.log("current hash", currHash);
	git(directoryPath).diff(["--name-only", currHash + "^"], (err, res) => {
		console.log(res);
		if (err) {
			git(directoryPath).raw(
				["show", "--name-only", currHash],
				(err, result) => {
					console.log("Hash ", currHash, "result  ", result);
					getFilesInHash(
						result
							.split("\n")
							.splice(6)
							.join("\n")
					);
				}
			);
		} else {
			getFilesInHash(res);
		}
	});
	getFileChanges(currHash);
});

const getFilesInHash = res => {
	console.log(res);
	let reg = /(?:(?:.+\/)?(?:.+\/)?)(.+)/g;
	let result = [];
	let match;
	while ((match = reg.exec(res))) {
		console.log(match[2]);
		result.push(match[1]);
	}
	mainWindow.webContents.send("files", {
		files: result,
		currentBranch,
		allBranch
	});
	mainWindow.webContents.send("CHANGES-IN-FILES", []);
};

// Clone A repository from url
ipcMain.on("clone", (event, data) => {
	let gitDirectoryNameRegex = /(?:\/.+\/)(.+)(?:.git)/;
	let locaPath =
		data.cloneDestination + "/" + gitDirectoryNameRegex.exec(data.cloneUrl)[1];
	return new Promise((resolve, reject) => {
		git().clone(data.cloneUrl, locaPath, (err, result) => {
			console.log(1);
			if (err) {
				console.log("reject");
				reject(err);
			} else {
				console.log("resolve");
				resolve(result);
			}
		});
	});
});

//Create a repository to a secific destination
ipcMain.on("create-repository", (event, data) => {
	git(`${data.directoryPath}`).raw(["init", `${data.directoryName}`], err => {
		if (err) {
			console.log(err);
		} else {
			console.log("Created");
		}
	});
});

// Changes in FILES
ipcMain.on("CHANGES-IN-FILES", (e, data) => {
	mainWindow.webContents.send("CHANGES-IN-FILES", filter[data]);
});

// Recent Files call
ipcMain.on("RECENT-FILES", async (e, data) => {
	recentFiles = await getRecentFolder();
	mainWindow.webContents.send("RECENT-FILES", recentFiles);
});

// Current status of branch
ipcMain.on("CURRENT-STATUS-FILE", () => {
	git(directoryPath).status((err, status) => {
		console.log(status);
		mainWindow.webContents.send("CURRENT-STATUS-FILE", [
			...status.modified,
			...status.not_added
		]);
	});
});

// todo
ipcMain.on("COMMIT-CHANGES", (event, data) => {
	let directoryN = data.files.map(item => {
		return item.replace("/", "/");
	});
	git(directoryPath).add(directoryN, (err, res) => {
		if (!err) {
			git(directoryPath).commit(data.message, (error, result) => {
				// gitLog(directoryPath, currentBranch);
				initilize(directoryPath);
				// mainWindow.webContents.send("CURRENT-STATUS-FILE", []);
			});
		}
	});
});

// Switch branch commits only
ipcMain.on("SWITCH-BRANCH-COMMIT", (e, branch) => {
	console.log("switchBranchCommits");
	currentBranch = branch;
	gitLog(directoryPath, currentBranch);
});

//CHECKOUT branch
ipcMain.on("SWITCH-BRANCH", (e, branch) => {
	console.log("switchBranch");
	git(directoryPath).checkout(branch, (err, res) => {
		if (err) {
			console.log(err);
			mainWindow.webContents.send(
				"ERROR",
				"Can't CHECKOUT, there are uncommitted changes."
			);
		} else {
			currentBranch = branch;
			gitLog(directoryPath, branch);
		}
	});
});
// Push a branch
ipcMain.on("PUSH-BRANCH", () => {
	git(directoryPath).push(["-u", "origin", currentBranch], (err, res) => {
		console.log(err);
		console.log("done");
	});
});

// Pull branch
ipcMain.on("PULL-BRANCH", () => {
	git(directoryPath)
		.exec(() => console.log("Starting pull..."))
		.pull((err, update) => {
			if (update && update.summary.changes) {
				require("child_process").exec("npm restart");
			}
		})
		.exec(() => {
			console.log("pull done.");
			gitLog(directoryPath, currentBranch);
		});
});

// Delete a branch
ipcMain.on("DELETE-BRANCH", (e, branch) => {
	git(directoryPath).deleteLocalBranch(branch, (err, data) => {
		if (data.success === true) {
			console.log("success");
		}
		if (data.success === null) {
			console.log("Cant delete");
		}
	});
});
