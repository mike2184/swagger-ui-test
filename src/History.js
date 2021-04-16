import axios from 'axios';
import React from 'react';

export default class History extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          accessToken : "",
          jobs : [],
          error : "",
          totalPages : 0
        }
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
              //console.log(result);
              this.setState({
                  accessToken: result.data.access_token
              });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async getTotalPages() {
        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-service-auth': this.state.accessToken
            },
            params: {
                startTime: this.props.startTime,
                endTime: this.props.endTime,
                page: 0
            }
        }
        let result = await axios.get(process.env.REACT_APP_HISTORY_SERVICE_URL
          + 'timeframe', config);
        this.setState({totalPages : result.data.totalPages});
    }

    async fetchJobs() {
        this.state.error = ""
        this.state.jobs = []
        if(this.state.accessToken !== "") {
            if(this.props.startTime == null && this.props.endTime == null) {
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
                let curPage = 0;
                await this.getTotalPages();
                do {
                    const config = {
                        headers: {
                          'Content-Type': 'application/json',
                          'x-service-auth': this.state.accessToken
                        },
                        params: {
                            startTime: this.props.startTime,
                            endTime: this.props.endTime,
                            page: curPage++
                        }
                    }
                    axios.get(process.env.REACT_APP_HISTORY_SERVICE_URL
                      + 'timeframe', config)
                        .then((result) => {
                            this.setState({
                                jobs: this.state.jobs.concat(result.data.content)
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
                } while (curPage < this.state.totalPages)

            }
        }
        else {
            console.log("Access token is not set.");
            this.setState({error: "Access token is not set."});
        }

    }

    handleErrorByResponse(response) { 
        switch(response.status) { 
            case 404:
                return 'No results found';
            default:
                return 'Unknown status: ' + response.status;
        }
    }

    render() {
        return (
          <div>
            <button onClick={() => {this.fetchJobs()}} class="btn btn-primary mr-2" > Search </button>
            <button onClick={() => {this.fetchJobs()}} class="btn btn-secondary mr-2" > Reset </button>
            <br/>

            {this.state.error 
            ? <div className="error"><p>{this.state.error}</p></div>
            : <table className="job-list" class="table table-hover table-striped">
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
            }
          </div>
        );
    }
}
