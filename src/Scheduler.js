import axios from 'axios';
import React from 'react';

export default class Scheduler extends React.Component {
    constructor(props){
        super(props);
    
        this.state = {
            accessToken : "",
            error : "",
            msg: "",
        }
    }

    componentDidMount() {
        this.getServiceToken();
    }

    // action = resume, pause
    changeJobState(action) {
        this.setState({error: ""},{msg: ""});
        if(this.state.accessToken !== "") {
            const config = {
                headers: {
                  'Content-Type': 'application/json',
                  'x-service-auth': this.state.accessToken
                },
                params: {
                    'eventGroup': this.state.orgId,
                    'solution': 'WORKSPACE', // hard coded to WORKSPACE solution for now
                }
            };
            axios.get(process.env.REACT_APP_SCHEDULER_SERVICE_URL
              + 'events/' + this.props.jobId + '/' + action, config)
                .then((result) => {
                    console.log(result);
                    this.setState({
                       msg: 'job:' + this.props.jobId + ' ' + action + ' success'
                    });
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({msg: ""});
                    if (err.response && err.response.status) { 
                        this.setState({error: this.handleErrorByResponse(err.response)});
                    } else {
                        this.setState({error: "Unknown error occurred. " + err});
                    }
            });
        }
        else {
            console.log("Access token is not set.");
            this.setState({error: "Access token is not set."});
        }
    }

    // action = resumeall, pauseall
    changeJobsState(action) {
        this.setState({error: ""},{msg: ""});
        if(this.state.accessToken !== "") {
            const config = {
                headers: {
                  'Content-Type': 'application/json',
                  'x-service-auth': this.state.accessToken
                },
                params: {
                    'eventGroup': this.state.orgId,
                    'solution': 'WORKSPACE', // hard coded to WORKSPACE solution for now
                }
            };
            axios.get(process.env.REACT_APP_SCHEDULER_SERVICE_URL
              + 'events/' + action, config)
                .then((result) => {
                    console.log(result);
                    this.setState({
                       msg: 'org:' + this.props.orgId + ' ' + action + ' success'
                    });
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({msg: ""});
                    if (err.response && err.response.status) { 
                        this.setState({error: this.handleErrorByResponse(err.response)});
                    } else {
                        this.setState({error: "Unknown error occurred. " + err});
                    }
            });
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
}
