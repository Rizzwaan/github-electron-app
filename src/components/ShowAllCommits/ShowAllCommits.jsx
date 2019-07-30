import React, { Component } from "react";
// import "./ShowAllCommits.css";
import "../../../node_modules/antd/dist/antd.css";
import Img from "./Avatar";
import Nav from "../Navbar/Nav";
// import "../Nav.css";
import "./ShowAllCommits.css";
import MakeCommits from "../MakeCommits/MakeCommits";
import { List, Divider, Typography, Row } from "antd";
const { Text } = Typography;
// import NavbarLeft from "../NavbarLeft/NavbarLeft";

const { ipcRenderer } = window.require("electron");

export default class Showcommits extends Component {
	constructor() {
		super();
		this.state = {
			commits: [],
			current: "",
			isMakeCommit: false,
			repo: ""
		};
	}
	componentDidMount() {
		ipcRenderer.on("SHOW-COMMITS", (e, data) => {
			this.setState({ commits: data, current: data[0].hash });
		});
	}

	componentDidUpdate() {
		ipcRenderer.on("REPO", (e, repo) => {
			repo = repo.substr(repo.lastIndexOf("/") + 1);
			this.setState({ repo });
		});
	}
	handelFilesInCommit = hash => {
		this.setState({ current: hash });
		ipcRenderer.send("GET-FILES-IN-HASH", hash);
	};

	render() {
		const { commits } = this.state;
		console.log("Repo - " + this.state.repo);

		return (
			<div>
				<div className="m">
					<Nav
						data={{
							icon: "lock",
							heading: "Current repo",
							subheading: this.state.repo
						}}
					/>
					<div className="go-back">
						<p
							style={{ cursor: "pointer" }}
							onClick={() => window.location.reload()}
						>
							<i className="material-icons md-18">arrow_back</i>
							Go Back
						</p>
						<Divider type="vertical" />
						<p
							style={{ cursor: "pointer" }}
							onClick={() => this.setState({ isMakeCommit: true })}
						>
							Changes
						</p>
						<Divider type="vertical" />
						<p
							onClick={() => this.setState({ isMakeCommit: false })}
							style={{ cursor: "pointer", fontWeight: "800" }}
						>
							History
						</p>
					</div>
				</div>
				<div id="commits">
					{this.state.isMakeCommit ? (
						<MakeCommits
							onCommit={() => this.setState({ isMakeCommit: false })}
						/>
					) : (
						<List
							size="small"
							bordered
							dataSource={commits}
							renderItem={item => (
								<List.Item
									className={
										item.hash === this.state.current
											? "commit-item active"
											: "commit-item"
									}
									onClick={() => this.handelFilesInCommit(item.hash)}
								>
									<Row>
										<Text className="commit-heading" strong>
											{item.message}
										</Text>
										<br />
										<Img name={item.author_name} />
										<Text className="commit-subheading" type="secondary">
											{item.author_name} committed {item.date.substring(0, 10)}
										</Text>
									</Row>
								</List.Item>
							)}
						/>
					)}
				</div>
			</div>
		);
	}
}
