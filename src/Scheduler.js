import axios from 'axios';
import React from 'react';

export default class Scheduler extends React.Component {
    constructor(props){
        super(props);
    
        this.state = {
            accessToken : "",
            job: null
        }
    }

    componentDidMount() {
        this.getServiceToken();
    }

    fetchJobById() {
        if(this.state.accessToken !== "") {
            const config = {
                headers: {
                  'Content-Type': 'application/json',
                  'x-service-auth': this.state.accessToken
                },
                params: {
                    'solution': 'WORKSPACE',
                    // TODO - I don't see event groups in history service but they are a required parameter to call
                    // the scheduler service. Do we need to add event group to the information we store in history service?
                    'eventGroup': 'testEventGroup' 
                }
            }
            axios.get(process.env.REACT_APP_SCHEDULER_SERVICE_URL + 'events/test', config)
                .then((result) => {
                    //console.log(result);
                    this.setState({
                       job: result.data
                    });
                })
                .catch((err) => {
                    console.log(err);
            });
        }
    }

    getServiceToken() { 
        const params = new URLSearchParams()
        params.append('grant_type', 'authorization_code');
        params.append('client_id', process.env.REACT_APP_SCHEDULER_SERVICE_IMS_CLIENT_ID);
        params.append('client_secret', process.env.REACT_APP_SCHEDULER_SERVICE_SECRET);
        params.append('code', process.env.REACT_APP_SCHEDULER_SERVICE_AUTHCODE);
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

    render() {
        if (this.state.job === null) {
            return (
                <div>
                    <button onClick={() => {this.fetchJobById()}}>Fetch Job by ID</button>
                </div>
            );
            } else {
            return (
                <div>
                    <button onClick={() => {this.fetchJobById()}}>Fetch Job by ID</button>
                    <table className="job-info">
                        <tr>
                            <th>Job ID</th>
                            <th>Job Instance ID</th>
                            <th>Event Time</th>
                            <th>Event Type</th>
                            <th>Org ID</th>
                        </tr>
                        <tr key={this.state.job}>
                            <td>{this.state.job.jobId}</td>
                            <td>{this.state.job.jobInstanceId}</td>
                            <td>{this.state.job.eventTime}</td>
                            <td>{this.state.job.eventType}</td>
                            <td>{this.state.job.orgId}</td>
                        </tr>
                    </table>
                </div>
            );
        }
    }
}
