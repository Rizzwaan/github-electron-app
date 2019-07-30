import React, { Component } from "react";
import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import Dashboard from "./components/Dashboard/Dashboard";
import {connect} from 'react-redux'
import { Modal, Button, Layout } from "antd";
const { ipcRenderer } = window.require("electron");

class App extends Component {
	constructor(props){
		super()
		this.state=({
			err:false,
			errorText:''
		})
	}
	componentDidMount(){
		ipcRenderer.on('ERROR',(e, data)=>{
			this.setState({err:true, errorText:data})
		})
	}
	handleCancel = () => {
    this.setState({ err: false });
  };

	render() {
		return <>{this.props.isRepoRecieved ? (
			<Dashboard />
		) : (
			<HomePage handleRepoRecieved={this.props.handleRepoRecieved} />
		)}
		<Modal
          visible={this.state.err}
          title="Error"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
          ]}
        >
        {this.state.errorText}
        </Modal>
		</>
	}
}

const mapStateToProps = (state) => {
  return {
		isRepoRecieved: state.isRepoRecieved,
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
		handleRepoRecieved : (e) => dispatch({type: 'REPO_RECIEVED', value:e})
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
