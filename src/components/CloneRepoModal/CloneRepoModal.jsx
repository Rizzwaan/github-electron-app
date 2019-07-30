import React from "react";

import "antd/dist/antd.css";
import AlertBox from "../HomePage/Message";
import { Modal } from "antd";

const { ipcRenderer } = window.require("electron");

// import SelectFile from "./SelectFile";

export default class AddRepositoryModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filepath: "",
			Urlpath: "",
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

	filePathHandler = e => {
		// console.log(e.target.files[0].path);
		this.setState({ filepath: e.target.files[0].path });
	};

	UrlPathHandler = e => {
		// console.log(e.target.files[0].path);
		this.setState({ Urlpath: e.target.value });
	};

	handleCloneSubmit = () => {
		if (this.state.filepath !== "" && this.state.Urlpath !== "")
			ipcRenderer.send("clone", {
				cloneDestination: this.state.filepath,
				cloneUrl: this.state.Urlpath
			});
	};
	render() {
		return (
			<div>
				<div
					className="home-alert"
					onClick={this.showModal}
					style={{ cursor: "pointer" }}
				>
					<AlertBox icon="cloud" text="Clone a Repository from internet..." />
				</div>

				{/* <Listt /> */}
				<Modal
					title="Clone a repository"
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
							id="Url-path"
							name="Url-repo"
							placeholder="Enter Url"
							onChange={this.UrlPathHandler}
						/>
						<input
							type="file"
							webkitdirectory="true"
							id="directory-path"
							name="directory-repo"
							onChange={this.filePathHandler}
						/>
						<input
							className="btn btn-sm btn-primary"
							type="submit"
							value="Clone Repository..."
						/>
					</form>
				</Modal>
			</div>
		);
	}
}
