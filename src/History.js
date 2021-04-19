import axios from 'axios';
import React from 'react';

export default class History extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          accessToken : "",
          jobs : [],
          error : "",
          totalPages : 0,
          curPage : 0,
          selectedCount: 0,
          hasSelected: false,
        }
        this.fetchJobs = this.fetchJobs.bind(this);
        this.fetchJobByTime = this.fetchJobByTime.bind(this);
        this.testIt =  this.testIt.bind(this);
    }

    componentDidMount() {
        this.getServiceToken();
    }

    getServiceToken() {
        const params = new URLSearchParams()
        params.append('grant_type', 'authorization_code');
        params.append('client_id', process.env.REACT_APP_HISTORY_SERVICE_IMS_CLIENT_ID);
        params.append('client_secret', process.env.REACT_APP_HISTORY_SERVICE_SECRET);
        params.append('code', process.env.REACT_APP_HISTORY_SERVICE_AUTHCODE);

        const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.post(process.env.REACT_APP_IMS_SERVICE_URL, params, config)
            .then((result) => {
              console.log(result);
              this.setState({
                  accessToken: result.data.access_token
              });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    rescheduleJobs() {
        var count = 0;
        var msgIds = "";

        this.state.jobs.map((job) => {
            if (job.isChecked) {
                msgIds += job.jobId + "\n";
                count += 1;
            }
        });
        var message = `Are you sure you want to reschedule the following ${count} job(s)?\n${msgIds}`;
        console.log(message);
    }

    pauseJobs() {
    }

    resumeJobs() {
    }

    moreInfo() {
    }

    fetchJobs() {
        this.setState({
            error: ""
        });

        if(this.state.accessToken !== "") {
            if(this.props.startTime == null && this.props.endTime == null) {
               console.log("standard search");

                const config = {
                    headers: {
                      'Content-Type': 'application/json',
                      'x-service-auth': this.state.accessToken
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
                        this.setState({jobs: []});
                        if (err.response && err.response.status) {
                            this.setState({error: this.handleErrorByResponse(err.response)});
                        } else {
                            this.setState({error: "Unknown error occurred. " + err});
                        }
                });
            } else {
                do {
                    const config = {
                        headers: {
                          'Content-Type': 'application/json',
                          'x-service-auth': this.state.accessToken
                        },
                        params: {
                            startTime: this.props.startTime,
                            endTime: this.props.endTime,
                            page: this.state.curPage
                        }
                    };

                    this.fetchJobByTime(config).then(data =>{
                      console.log('good');
                    });

                } while (false)
            }
        }
        else {
            console.log("Access token is not set.");
            this.setState({error: "Access token is not set."});
        }

    }

    fetchJobByTime(config){
        axios.get(process.env.REACT_APP_HISTORY_SERVICE_URL
          + 'timeframe', config)
            .then((result) => {
                console.log(result.data.totalPages);
                return result.data;
            })
            .catch((err) => {
                console.log(err);
                return [];
        });
    }

    testIt(){
      console.log('hi');
    }

    handleErrorByResponse(response) {
        switch(response.status) {
            case 404:
                return 'No results found';
            default:
                return 'Unknown status: ' + response.status;
        }
    }

    handleCheck(job, e) {
        job.isChecked = e.target.checked;
        if (e.target.checked) {
            this.setState({
                selectedCount: this.state.selectedCount + 1,
                hasSelected: true,
            });
        } else {
            if (this.state.selectedCount - 1 <= 0)  {
                this.setState({hasSelected: false});
            }
            this.setState({selectedCount: this.state.selectedCount - 1});
        }
    }

    render() {
        return (
          <div>
            <button onClick={() => {this.fetchJobs()}} className="btn btn-primary mr-2" > Search </button>
            <button onClick={() => {this.fetchJobs()}} className="btn btn-secondary mr-2" > Reset </button>

            <button onClick={() => {this.rescheduleJobs()}}
                disabled={!this.state.hasSelected}
                class="btn btn-secondary mr-2"> Reschedule Job{this.state.selectedCount > 1 ? "s" : ""} </button>
            <button onClick={() => {this.pauseJobs()}}
                disabled={!this.state.hasSelected}
                class="btn btn-secondary mr-2"> Pause Job{this.state.selectedCount > 1 ? "s" : ""} </button>
            <button onClick={() => {this.resumeJobs()}}
                disabled={!this.state.hasSelected}
                class="btn btn-secondary mr-2"> Resume Job{this.state.selectedCount > 1 ? "s" : ""} </button>
            <button onClick={() => {this.moreInfo()}}
                disabled={!this.state.hasSelected}
                class="btn btn-secondary mr-2" > More Info </button>
            <br/>

            {this.state.error
            ? <div className="error"><p>{this.state.error}</p></div>
            : <table className="job-list table table-hover table-striped">
                <thead>
                  <tr>
                    <th>☒</th>
                    <th>Job ID</th>
                    <th>Job Instance ID</th>
                    <th>Event Time</th>
                    <th>Event Type</th>
                    <th>Org ID</th>
                  </tr>
                </thead>
                <tbody>
                    {this.state.jobs.map(job => (
                      <tr key={job.jobId + job.eventTime}>
                        <td><input type="checkbox" onChange={(e) => this.handleCheck(job, e)}/></td>
                        <td>{job.jobId}</td>
                        <td>{job.jobInstanceId}</td>
                        <td>{job.eventTime}</td>
                        <td>{job.eventType}</td>
                        <td>{job.orgId}</td>
                      </tr>
                    ))}
                </tbody>
                  </table>
            }
          </div>
        );
    }
}
