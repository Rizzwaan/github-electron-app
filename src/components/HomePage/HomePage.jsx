import React, { Component } from "react";
import "../../../node_modules/antd/dist/antd.css";
import { Row } from "antd";
import Search from "./Search";
import OpenLocalRepoModal from "../OpenLocalRepoModal/OpenLocalRepoModal";
import CloneRepoModal from "../CloneRepoModal/CloneRepoModal";
import InitRepoModal from "../InitRepoModal/InitRepoModal";
import { Button } from "antd";
import { connect } from "react-redux";
const { ipcRenderer } = window.require("electron");

class HomePage extends Component {
	componentDidMount() {
		ipcRenderer.on("RECENT-FILES", (e, recentFiles) => {
			this.props.handleRecentFiles(recentFiles);
		});
		ipcRenderer.send("RECENT-FILES", { a: 1 });
	}
	loginOauth() {
		ipcRenderer.send("github-oauth", "login");
	}
	formSubmitHandler = path => {
		if (path !== "") {
			ipcRenderer.send("path-recieved", path);
			this.props.handleRepoRecieved(true);
		}
	};

	render() {
		return (
			<div className="home">
				<div className="row">
					<div className="col">
						<h1 style={{ color: "#1C75BB" }}>Let's get started!</h1>
						<p>Add a repository to Git Desktop to start collaborating </p>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<Search
							recent={this.props.recentFiles}
							formSubmitHandler={this.formSubmitHandler}
						/>
					</div>
					<div className="col">
						<Row>
							<CloneRepoModal
								icon="file_copy"
								handleCloneSubmit={this.handleCloneSubmit}
							/>
							<InitRepoModal />
							<OpenLocalRepoModal
								formSubmitHandler={this.formSubmitHandler}
								handleRepoRecieved={this.props.handleRepoRecieved}
							/>
						</Row>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		recentFiles: state.recentFiles
	};
};

const mapDispatchToProps = dispatch => {
	return {
		handleRecentFiles: data =>
			dispatch({ type: "GET_RECENT_FILES", payload: data })
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomePage);
