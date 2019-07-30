import React, { Component } from "react";
import "antd/dist/antd.css";
import { Alert } from "antd";

class AlertBox extends Component {
	render() {
		return (
			<div className="alert">
				<i className="material-icons md-18">{this.props.icon}</i>
				<Alert description={this.props.text} type="default" />
			</div>
		);
	}
}

export default AlertBox;
