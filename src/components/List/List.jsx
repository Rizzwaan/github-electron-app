import React, { Component } from "react";
import "../../../node_modules/antd/dist/antd.css";
import { List, Typography } from "antd";
import { Row, Col } from "antd";
import Img from "../ShowAllCommits/Avatar";
import Nav from "../Navbar/Nav";
const { Title, Text } = Typography;

class Listt extends Component {
	state = {};
	render() {
		const { commits } = this.props;

		return (
			<div>
				<List
					size="small"
					bordered
					header={<Nav />}
					dataSource={commits}
					renderItem={item => (
						<List.Item>
							<Row>
								<Text strong>{item.message}</Text>
								<Img />
								<Text type="secondary">
									{item.author_name} committed {item.date}
								</Text>
							</Row>
						</List.Item>
					)}
				/>
			</div>
		);
	}
}

export default Listt;
