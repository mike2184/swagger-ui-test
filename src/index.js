import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import History from './History';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

class SearchBar extends React.Component{
  constructor(props){
      super(props);
      this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
      this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
  }

  handleSearchTextChange(e) {
    this.props.onSearchTextChange(e.target.value);
  }

  handleSearchTypeChange(e) {
    this.props.onSearchTypeChange(e.target.value);
  }

  render(){
    return (
      <div>
          <div class="form-check">
            <label> Search text: </label>
            <input name = "searchText" value = {this.props.searchText} onChange = {this.handleSearchTextChange} />
          </div>

          <div class="form-check" onChange = {this.handleSearchTypeChange}>
            <input type="radio" value = "jobId" id = "jobId" name="searchType" class="mr-1" checked />
            <label for="jobId" class="mr-2" >Job Id</label>
            <input type="radio" value = "jobInstanceId" id = "jobInstanceId" name="searchType" class="mr-1"/>
            <label for="jobInstanceId" class="mr-2">Job Instance Id</label>
            <input type="radio" value = "orgId" id = "orgId" name="searchType" class="mr-1"/>
            <label for="orgId" class="mr-2">Org Id</label>
          </div>

          <div class="form-check">
            <label> Job status: </label>
            <select id="status" name="status" size="3">
              <option value="all">All</option>
              <option value="succeeded">Succeeded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
      </div>
    );
  }
}


class MainTable extends React.Component{

  constructor(props){
      super(props);

      this.state = {
          searchText : "",
          searchType : "jobId"
      }

      this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
      this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
  }


  handleSearchTextChange(searchText){
    this.setState({
        searchText: searchText
    });
  }

  handleSearchTypeChange(searchType){
    this.setState({
        searchType: searchType
    });
  }

  render(){
    return (
      <div class="container">
        <h1>History Service UI</h1>
        <div>
          <SearchBar searchText = {this.state.searchText} searchType = {this.state.searchType}
          onSearchTextChange = {this.handleSearchTextChange}
          onSearchTypeChange = {this.handleSearchTypeChange} />

          <History searchText = {this.state.searchText} searchType = {this.state.searchType} />
        </div>
      </div>
    );
  }
}

// ========================================
ReactDOM.render(
  <MainTable />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
