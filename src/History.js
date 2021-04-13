import axios from 'axios';
import React from 'react';

export default class History extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          jobs : []
        }
    }

    fetchJobs() {
        if(this.props.accessToken !== "") {
            const config = {
                headers: {
                  'Content-Type': 'application/json',
                  'x-service-auth': this.props.accessToken
                }
            }
            axios.get(process.env.REACT_APP_HISTORY_SERVICE_URL
              + this.props.searchType + '/' + this.props.searchText, config)
                .then((result) => {
                    console.log(result);
                    this.setState({
                       jobs: result.data
                    });
                })
                .catch((err) => {
                    console.log(err);
            });
        }
    }

    render() {
        return (
          <div>
            <button onClick={() => {this.fetchJobs()}} class="btn btn-primary mr-2" > Search </button>
            <button onClick={() => {this.fetchJobs()}} class="btn btn-secondary mr-2" > Reset </button>
            <br/>

            <table className="job-list" class="table table-hover table-striped">
              <tr>
                <th>Job ID</th>
                <th>Job Instance ID</th>
                <th>Event Time</th>
                <th>Event Type</th>
                <th>Org ID</th>
              </tr>
                {this.state.jobs.map(job => (
                  <tr>
                    <td>{job.jobId}</td>
                    <td>{job.jobInstanceId}</td>
                    <td>{job.eventTime}</td>
                    <td>{job.eventType}</td>
                    <td>{job.orgId}</td>
                  </tr>
                ))}
              </table>
          </div>
      );
    }
}
