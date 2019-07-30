import React from "react";

import "antd/dist/antd.css";
import AlertBox from "../HomePage/Message";
import { Modal } from "antd";

// import SelectFile from "./SelectFile";

export default class App extends React.Component {
	state = { visible: false, filepath: "" };

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
		console.log(e.target.files[0].path);
		this.setState({ filepath: e.target.files[0].path });
	};
	pathSubmitHandler = e => {
		e.preventDefault();
		this.props.formSubmitHandler(this.state.filepath);
	};

	render() {
		return (
			<div>
				<div
					className="home-alert"
					onClick={this.showModal}
					style={{ cursor: "pointer" }}
				>
					<AlertBox icon="folder" text="Open local repository" />
				</div>

				{/* <Listt /> */}

				<Modal
					title="Choose local repository"
					visible={this.state.visible}
					onOk={this.pathSubmitHandler}
					onCancel={this.handleCancel}
				>
					<form>
						<input
							type="file"
							webkitdirectory="true"
							id="file-path"
							name="add-repo"
							onChange={this.filePathHandler}
						/>
					</form>
				</Modal>
			</div>
		);
	}
}
