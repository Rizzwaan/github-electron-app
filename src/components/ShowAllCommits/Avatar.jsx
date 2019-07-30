import React, { Component } from "react";

import "../../../node_modules/antd/dist/antd.css";

class Img extends Component {
	state = {};
	render() {
		let src = `https://robohash.org/${this.props.name
			.slice(0, 5)
			.toLowerCase()}`;
		console.log(src);
		return <img className="avatar" src={src} alt={src} />;
	}
}
export default Img;
