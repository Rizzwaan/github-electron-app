import React, { Component } from "react";
import "./showChangesInFile.css";
import Nav from "../Navbar/Nav";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
const { ipcRenderer } = window.require("electron");

export default class ShowChangesInFiles extends Component {
	constructor(props) {
		super();
		this.state = {
			file: []
		};
	}

	componentDidMount() {
		ipcRenderer.on("CHANGES-IN-FILES", (e, file) => {
			// console.log("file", file);
			this.setState({ file });
		});
	}

	render() {
		// console.log(this.state);
		return (
			<div>
				<div className="mmm">
					<Nav
						data={{
							icon: "",
							heading: "",
							subheading: ""
						}}
					/>
				</div>
				<div className="code-block">
					<table>
						<tbody>
							{this.state.file.map((item, index) => {
								index = index < 10 ? "0" + index : index;
								if (item[0] === "+") {
									return (
										<tr key={index} className="added">
											<td className="code-index">{index}</td>
											<td className="code-sign">+</td>
											<td className="code-content">
												<SyntaxHighlighter language="javascript" style={docco}>
													{item.substr(1)}
												</SyntaxHighlighter>
												{/* <pre>
											<code
												style={{ fontSize: "0.7rem" }}
												className="JavaScript"
											>
												{item.substr(1)}
											</code>
										</pre> */}
											</td>
										</tr>
									);
								}
								if (item[0] === "-") {
									return (
										<tr key={index} className="removed">
											<td className="code-index">{index}</td>
											<td className="code-sign">-</td>
											<td className="code-content">
												<SyntaxHighlighter language="javascript" style={docco}>
													{item.substr(1)}
												</SyntaxHighlighter>
												{/* <pre>
											<code
												style={{ fontSize: "0.7rem" }}
												className="JavaScript"
											>
												{item.substr(1)}
											</code>
										</pre> */}
											</td>
										</tr>
									);
								} else {
									return (
										<tr key={index} className="unchanged">
											<td className="code-index">{index}</td>
											<td className="code-sign"> </td>
											<td className="code-content">
												<SyntaxHighlighter language="javascript" style={docco}>
													{item.substr(1)}
												</SyntaxHighlighter>
												{/* <pre>
											<code
												style={{ fontSize: "0.7rem" }}
												className="JavaScript"
											>
												{item.substr(1)}
											</code>
										</pre> */}
											</td>
										</tr>
									);
								}
							})}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
