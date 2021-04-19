import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import History from './History';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

class SearchBar extends React.Component{
  constructor(props){
      super(props);
      this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
      this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
      this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
      this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
  }

  handleSearchTextChange(e) {
    this.props.onSearchTextChange(e.target.value);
  }

  handleSearchTypeChange(e) {
    this.props.onSearchTypeChange(e.target.value);
  }

  handleStartTimeChange(e) {
    this.props.onStartTimeChange(e.target.value);
  }

  handleEndTimeChange(e) {
    this.props.onEndTimeChange(e.target.value);
  }

  render(){
    return (
      <div>
          <div className="form-check">
            <label> Search text: </label>
            <input name = "searchText" value = {this.props.searchText} onChange = {this.handleSearchTextChange} />
          </div>

          <div class="form-check" onChange = {this.handleSearchTypeChange}>
            <input type="radio" value = "jobId" id = "jobId" name="searchType" className="mr-1" defaultChecked />
            <label for="jobId" className="mr-2" >Job Id</label>
            <input type="radio" value = "jobInstanceId" id = "jobInstanceId" name="searchType" className="mr-1"/>
            <label for="jobInstanceId" className="mr-2">Job Instance Id</label>
            <input type="radio" value = "orgId" id = "orgId" name="searchType" className="mr-1"/>
            <label for="orgId" className="mr-2">Org Id</label>
          </div>

          <div className="form-check">
            <label> Job status: </label>
            <select id="status" name="status" size="3">
              <option value="all">All</option>
              <option value="succeeded">Succeeded</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="form-check">
            <label>Search time: From </label>
            <input name = "startTime" value = {this.props.startTime} onChange = {this.handleStartTimeChange} />
            <label>to</label>
            <input name = "endTime" value = {this.props.endTime} onChange = {this.handleEndTimeChange} />
            <label>(Format: 2021-01-01 23:59:59)</label>
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
          searchType : "jobId",
          startTime : null,
          endTime : null
      }

      this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
      this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
      this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
      this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
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

  handleStartTimeChange(startTime){
    this.setState({
        startTime: startTime
    });
  }

  handleEndTimeChange(endTime){
    this.setState({
        endTime: endTime
    });
  }

  render(){
    return (
      <div className="container">
        <h1>History Service UI</h1>
        <div>
          <SearchBar searchText = {this.state.searchText} searchType = {this.state.searchType}
          startTime = {this.state.startTime} endTime = {this.state.endTime}
          onSearchTextChange = {this.handleSearchTextChange}
          onSearchTypeChange = {this.handleSearchTypeChange}
          onStartTimeChange = {this.handleStartTimeChange}
          onEndTimeChange = {this.handleEndTimeChange} />

          <History searchText = {this.state.searchText} searchType = {this.state.searchType}
           startTime = {this.state.startTime} endTime = {this.state.endTime} />
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
