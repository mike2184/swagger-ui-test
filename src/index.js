import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

class SearchBar extends React.Component{
  render(){
    return (
      <div>
          <div class="form-check">
            <label> ID: </label>
            <input name = "searchId" />
          </div>

          <div class="form-check">
            <input type="radio" value = "jobId" id = "jobId" name="id" class="mr-1" checked />
            <label for="jobId" class="mr-2" >Job Id</label>
            <input type="radio" value = "jobInstanceId" id = "jobInstanceId" name="id" class="mr-1"/>
            <label for="jobInstanceId" class="mr-2">Job Instance Id</label>
            <input type="radio" value = "orgId" id = "orgId" name="id" class="mr-1"/>
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

          <div class="form-check">
            <input type="button" value="Search" class="btn btn-primary mr-2" />
            <input type="button" value="Clear" class="btn btn-secondary" />
          </div>
      </div>
    );
  }
}


class MainTable extends React.Component{
  render(){
    return (
      <div class="container">
        <h1>History Service UI</h1>
        <div>
          <SearchBar />
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
