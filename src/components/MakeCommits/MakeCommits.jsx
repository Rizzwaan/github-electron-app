import React, { Component } from "react";
import { Input, Divider, Typography, Checkbox } from "antd";
const { Text } = Typography;
const { ipcRenderer } = window.require("electron");

const { Search } = Input;
class MakeCommits extends Component {
	state = {
		recentCommit: [],
		modifiedFiles: [],
		commitMessage: "",
		isChecked: [],
		isSelectAll: false
	};
	componentDidMount() {
		ipcRenderer.on("CURRENT-STATUS-FILE", (event, data) => {
			let isChecked = [...data];
			isChecked.fill(false);
			this.setState({ modifiedFiles: data, isChecked });
		});
		ipcRenderer.send("CURRENT-STATUS-FILE");
	}
	handleMessage = e => {
		this.setState({ commitMessage: e.target.value });
		// console.log(e.target.value);
	};
	handlesubmit = () => {
		let toCommit = this.state.isChecked.reduce((acc, item, index) => {
			if (item === true) acc.push(this.state.modifiedFiles[index]);
			return acc;
		}, []);
		if (this.state.commitMessage !== "") {
			ipcRenderer.send("COMMIT-CHANGES", {
				files: toCommit,
				message: this.state.commitMessage
			});
			this.props.onCommit();
		}
	};
	handleCheckBox = index => {
		let isCheckedTemp = [...this.state.isChecked];
		isCheckedTemp[index] = !isCheckedTemp[index];
		this.setState({ isChecked: isCheckedTemp });
	};
	render() {
		console.log(this.state.isChecked);
		return (
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ margin: "50px 0 0 40px" }}>
					Select files to commit
					<Divider />
					{this.state.modifiedFiles.map((item, index) => (
						<p>
							<Checkbox onChange={() => this.handleCheckBox(index)}>
								<Text className="files-in-commit" type="secondary">
									{item}
								</Text>
							</Checkbox>
						</p>
					))}
				</div>
				<div style={{ position: "fixed", bottom: "0", width: "25vw" }}>
					<Search
						placeholder="Commit message"
						enterButton="Commit"
						size="large"
						onChange={this.handleMessage}
						onSearch={this.handlesubmit}
					/>
				</div>
			</div>
		);
	}
}

export default MakeCommits;
