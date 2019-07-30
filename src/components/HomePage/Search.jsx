import React, { Component } from "react";
import "antd/dist/antd.css";
import { Input } from "antd";
import { Divider } from "antd";
import { connect } from 'react-redux'
const { Search } = Input;

class SearchBar extends Component {

	render() {
		return (
			<div>
				<Search
					placeholder="input search text"
					onChange={(e) => this.props.handleSearchString(e)}
					style={{ width: "80%" }}
				/>
				<div style={{ width: "80%" }}>
					<Divider>History</Divider>
				</div>
				{this.props.recent
					.filter(item =>
						item.toLowerCase().includes(this.props.searchString.toLowerCase())
					)
					.map((item, index) => (
						<li
							key={index}
							onClick={() => this.props.formSubmitHandler(item)}
							data-hash={item.hash}
							style={{ cursor: "pointer", fontSize: "1.2vw", width: "80%" }}
							className="list-group-item"
						>
							{item}
						</li>
					))}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
  return{
    searchString: state.searchString
	}
}
const mapDispatchToProps = (dispatch) => {
	return{
    handleSearchString: (e) => dispatch({type: 'SEARCH_CHANGE', payload: e.target.value})
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
