import React, { Component } from "react";

import "../../../node_modules/antd/dist/antd.css";

import {
	Affix,
	Button,
	Menu,
	Dropdown,
	Modal
} from "../../../node_modules/antd";
const { ipcRenderer } = window.require("electron");

export default class Demo extends Component {
	state = {
		// top: 10,
		bottom: 10,
		visible: false,
		branchToSwitch: ""
	};

	handleDeleteBranch = branchName => {
		// console.log(branchName);
		ipcRenderer.send("DELETE-BRANCH", branchName);
		this.props.data.handleRefreshBranch(branchName);
	};
	handlePullBranch = () => {
		ipcRenderer.send("PULL-BRANCH");
	};

	handleCancel = () => {
		this.setState({ visible: false });
	};
	handlePushBranch = () => {
		ipcRenderer.send("PUSH-BRANCH");
	};
	handleSwitchBranch = () => {
		this.setState({ visible: false });
		this.props.data.switchBranch(this.state.branchToSwitch);
	};
	handleSwitchBranchCommits = branch => {
		this.setState({ visible: false });
		this.props.data.switchBranchCommits(this.state.branchToSwitch);
	};
	preBranchSwitch = branch => {
		this.setState({ branchToSwitch: branch, visible: true });
	};
	render() {
		const menu = (
			<Menu>
				{this.props.data.allBranch.map((item, index) => (
					<Menu.Item key={index}>
						<a
							href="#aa"
							key={index}
							onClick={() => this.preBranchSwitch(item)}
							style={{ padding: "1em", fontSize: "1.2em" }}
						>
							{item.toUpperCase()}
						</a>
						<span>
							<Button
								size="small"
								disabled={item === this.props.data.currentBranch}
								type="danger"
								onClick={() => this.handleDeleteBranch(item)}
							>
								Delete Branch
							</Button>
						</span>
						<span>
							<Button
								size="small"
								type="primary"
								onClick={this.handlePushBranch}
							>
								Push
							</Button>
						</span>
						<span>
							<Button
								size="small"
								type="default"
								onClick={this.handlePullBranch}
							>
								Pull
							</Button>
						</span>
					</Menu.Item>
				))}
			</Menu>
		);
		return (
			<Affix offsetTop={this.state.top}>
				<Dropdown overlay={menu} trigger={["click"]}>
					<div className="navbar-top">
						<i className="nav-icon material-icons">{this.props.data.icon}</i>
						<div className="navbar-content">
							<p>{this.props.data.heading}</p>
							<p>{this.props.data.subheading}</p>
						</div>
						<div>
							<i className="nav-icon material-icons">arrow_drop_down</i>
						</div>
					</div>
				</Dropdown>
				<Modal
					title="Basic Modal"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={[
						<Button key="yes" onClick={this.handleSwitchBranch}>
							Yes
						</Button>,
						<Button key="no" onClick={this.handleSwitchBranchCommits}>
							No
						</Button>,
						<Button key="cancel" type="primary" onClick={this.handleCancel}>
							Cancel
						</Button>
					]}
				>
					Do you want to CHECKOUT this branch?
				</Modal>
			</Affix>
		);
	}
}
