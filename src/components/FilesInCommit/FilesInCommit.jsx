import React, { Component } from "react";
// import "./FilesInCommit.css";

import "../../../node_modules/antd/dist/antd.css";
import Nav from "../Navbar/Nav-branch";

import "./FilesInCommit.css";
import "antd/dist/antd.css";
import { Modal, Button, Layout } from "antd";
import { Affix, Menu, Dropdown } from "antd";
import { List, Typography, Row } from "antd";
const { Text } = Typography;
const { ipcRenderer } = window.require("electron");

class FilesInCommit extends Component {
	state = {
		files: [],
		current: 0,
		currentBranch: "",
		allBranch: []
	};
	componentDidMount() {
		ipcRenderer.on("files", (err, data) => {
			console.log("before - " + data.files);
			if (data[0] === null) {
				data.files = [];
			}
			console.log("after - " + data.files);
			this.setState({
				files: data.files,
				current: 0,
				currentBranch: data.currentBranch,
				allBranch: data.allBranch
			});
		});
	}

	showChangesInFile(item) {
		ipcRenderer.send("CHANGES-IN-FILES", item);
	}
	switchBranch(branch) {
		// console.log("got");
		ipcRenderer.send("SWITCH-BRANCH", branch);
	}
	switchBranchCommits=(branch)=>{
		console.log('swwith branch commit');
		ipcRenderer.send('SWITCH-BRANCH-COMMIT', branch);
	}
	handleRefreshBranch = branch => {
		if (this.state.currentBranch === branch) {
			return;
		}
		let totalBranches = [...this.state.allBranch];
		let v = totalBranches.filter(item => item !== branch);
		// console.log(totalBranches);
		this.setState({ allBranch: v });
	};
	render() {
		const { files } = this.state;
		// console.log(this.state.currentBranch);
		const currentBranchName =
			this.state.currentBranch.length < 17
				? this.state.currentBranch
				: this.state.currentBranch.substr(0, 15) + "...";

		console.log(files);

		return (
			<div>
				<div className="mm">
					<Nav
						data={{
							icon: "call_merge",
							heading: "Current Branch",
							subheading: currentBranchName,
							allBranch: this.state.allBranch,
							switchBranch: this.switchBranch,
							switchBranchCommits:this.switchBranchCommits,
							handleRefreshBranch: this.handleRefreshBranch,
							currentBranch: this.state.currentBranch
						}}
					/>
				</div>
				<div id="files-in-commits">
					{files[0] !== "null" ? (
						<List
							size="small"
							bordered
							dataSource={files}
							renderItem={(item, index) => (
								<List.Item
									onClick={() => {
										this.setState({ current: index });

										this.showChangesInFile(item);
									}}
									className={
										index === this.state.current
											? "files-in-commit active"
											: "files-in-commit"
									}
								>
									<Row>
										<Text className="files-in-commit" type="secondary">
											{item}
										</Text>
									</Row>
								</List.Item>
							)}
						/>
					) : (
						<div />
					)}
				</div>
			</div>
		);
	}
}

export default FilesInCommit;
