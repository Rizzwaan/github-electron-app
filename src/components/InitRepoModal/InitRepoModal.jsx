import React from "react";

import "antd/dist/antd.css";
import AlertBox from "../HomePage/Message";
import { Modal } from "antd";
import { connect } from 'react-redux';
const { ipcRenderer } = window.require("electron");

// import SelectFile from "./SelectFile";

class InitRepoModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// initRepoFilePath: "",
			// newRepoName: "",
			visible: false
		};
	}

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleOk = e => {
		this.setState({
			visible: false
		});
	};

	handleCancel = e => {
		this.setState({
			visible: false
		});
	};

	// newRepoFilePathHandler = e => {
	// 	// console.log(e.target.files[0].path);
	// 	this.setState({ filepath: e.target.files[0].path });
	// };

	// repoNameHandler = e => {
	// 	// console.log(e.target.files[0].path);
	// 	this.setState({ newRepoName: e.target.value });
	// };

	handleCloneSubmit = (e) => {
		e.preventDefault();
		if (this.props.initRepoFilePath !== "" && this.props.newRepoName !== ""){
			this.setState({visible:false})
			ipcRenderer.send("create-repository", {
				directoryPath: this.props.initRepoFilePath,
				directoryName: this.props.newRepoName
			})};
	};
	render() {
		return (
			<div>
				<div
					className="home-alert"
					onClick={this.showModal}
					style={{ cursor: "pointer" }}
				>
					<AlertBox icon="add" text="Create a local Repository" />
				</div>

				{/* <Listt /> */}
				<Modal
					title="Create a repository"
					visible={this.state.visible}
					onOk={this.handleOk}
					footer={false}
					onCancel={this.handleCancel}
					okButtonProps={{ disabled: true }}
					cancelButtonProps={{ disabled: true }}
				>
					<form onSubmit={this.handleCloneSubmit}>
						<input
							styles="display:block"
							type="text"
							id="repo-name"
							name="repo-name"
							placeholder="Repostitory Name"
							onChange={(e) => this.props.repoNameHandler(e)}
						/>
						<input
							type="file"
							webkitdirectory="true"
							id="directory-path"
							name="directory-repo"
							onChange={(e) => this.props.newRepoFilePathHandler(e)}
						/>
						<input
							className="btn btn-sm btn-primary"
							type="submit"
							value="Create"
						/>
					</form>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
  return {
		initRepoFilePath: state.initRepoFilePath,
    newRepoName: state.newRepoName,
	}
}

const mapDispatchToProps = (dispatch) => {
	return{
		newRepoFilePathHandler: (e) => dispatch({type: 'GET_NEW_REPO_PATH', payload:e.target.files[0].path }),
		repoNameHandler: (e) => dispatch({type: 'NEW_REPO_NAME', payload: e.target.value})
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(InitRepoModal);
