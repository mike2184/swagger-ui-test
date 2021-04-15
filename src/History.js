import axios from 'axios';
import React from 'react';

export default class History extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          accessToken : "",
          jobs : [],
          error : "",
          selectedCount: 0,
          isSelected: false,
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

    fetchJobs() {
        if(this.state.accessToken !== "") {
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
            });
        }
        else {
          console.log("Access token is not set.");
          this.setState({
             error: "Access token is not set."
          });
        }

    }

    handleChange(job, e) { 
        job.isChecked = e.target.checked;
        if (e.target.checked) { 
            this.state.selectedCount += 1; 
        } else { 
            this.state.selectedCount -= 1; 
        }
        this.state.isSelected = this.state.selectedCount == 0 ? false : true;
    }

    render() {
        return (
          <div>
            <button onClick={() => {this.fetchJobs()}} class="btn btn-primary mr-2" > Search </button>
            <button onClick={() => {this.fetchJobs()}} class="btn btn-secondary mr-2" > Reset </button>
            <button onClick={() => {this.rescheduleJobs()}} class="btn btn-secondary mr-2"> Reschedule Job(s) </button>
            <button onClick={() => {this.rescheduleJobs()}} class="btn btn-secondary mr-2" > More Info </button>
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
                  </tr>
          </div>
      );
    }
}
