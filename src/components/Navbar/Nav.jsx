import React, { Component } from "react";

import "../../../node_modules/antd/dist/antd.css";

import { Affix } from "../../../node_modules/antd";

export default class Demo extends Component {
	state = {
		// top: 10,
		bottom: 10
	};

	render() {
		return (
			<Affix offsetTop={this.state.top}>
				<div className="navbar-top">
					<i className="nav-icon material-icons">{this.props.data.icon}</i>

					<div className="navbar-content">
						<p>{this.props.data.heading}</p>
						<p>{this.props.data.subheading}</p>
					</div>
					<div>
						{/* <i className="nav-icon material-icons">arrow_drop_down</i> */}
					</div>
				</div>
			</Affix>
		);
	}
}
