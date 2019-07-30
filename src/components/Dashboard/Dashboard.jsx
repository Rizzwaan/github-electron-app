import React, { Component } from "react";
import "../../../node_modules/antd/dist/antd.css";
// import { Col } from "antd";
import ShowAllCommits from "../ShowAllCommits/ShowAllCommits";
import FilesInCommit from "../FilesInCommit/FilesInCommit";
import ShowChangesInFiles from "../showChangesInFile/showChangesInFile";

class HomePage extends Component {
	state = {};
	render() {		
		return (
			<div className="dashboard">
				<ShowAllCommits />

				<FilesInCommit />

				{/* <Col span={4}> */}
				<ShowChangesInFiles />
				{/* </Col> */}
			</div>
		);
	}
}

export default HomePage;
