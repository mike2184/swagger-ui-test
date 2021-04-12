import axios from 'axios';
import React from 'react';

export default class History extends React.Component {
    constructor(props){
        super(props);
    
        this.state = {
            accessToken : "",
            jobs: []
        }
    }

    componentDidMount() {
        this.getServiceToken();
    }

    fetchJobsForImgOrg() {
        if(this.state.accessToken !== "") {
            const config = {
                headers: {
                  'Content-Type': 'application/json',
                  'x-service-auth': this.state.accessToken
                }
            }
            axios.get(process.env.REACT_APP_HISTORY_SERVICE_URL + 'orgId/dummyImsOrg', config)
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

    render() {
        if (this.state.jobs.length === 0) {
            return (
                <div>
                    <button onClick={this.fetchJobsForImgOrg}>Fetch Job History for dummyImsOrg</button>
                    <div className="no-jobs">
                        There are no jobs to list!
                    </div>
                </div>
            );
            } else {
            return (
                <div>
                    <button onClick={this.fetchJobsForImgOrg}>Fetch Job History for dummyImsOrg</button>
                    <ul className="job-list">
                        {this.state.jobs.map(job => (
                            <li className="job-list-item job-list-item-primary">
                                {job}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    }
}
