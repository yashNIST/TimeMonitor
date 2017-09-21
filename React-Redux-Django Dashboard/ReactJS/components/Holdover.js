/**
 * Created by kgb on 9/14/17.
 */
var React = require('react');
var startFlag = 0;
var startRecoveryTime = 0;
var endRecoveryTime = 0;


export default class Holdover extends React.Component {

    render(){

        let data = this.props.data;
        let clockidentity = data['clockidentity'];
        let GMClockID = data['GMClockIdentity'];
        let GMClockClass = data['GMClockClass'];
        let GMClockVariance = data['GMClockVariance'];
        let GMClockAccuracy = data['GMClockAccuracy'];
        let Ethernet = data['ETH_DST'];
        let time_traceable = data['timetraceable'];
        let frequency_traceable = data['frequencytraceable'];
        let timesource = data['timesource'];
        let sequence_id = data['sequence_id'];
        let timestamp = data['sniff_timestamp'];
        let result = '';

        if(time_traceable === 0 && frequency_traceable === 0 && startFlag === 0){

            startRecoveryTime = timestamp;
            startFlag = 1;

        } else if(time_traceable === 1 && frequency_traceable === 1 && startFlag ===1){

            endRecoveryTime = timestamp;
            if((endRecoveryTime - startRecoveryTime) > 16){

                result = 'FAIL: Recovery Time is '
            }
            else{

                result = 'PASS: Recovery Time is '
            }

            result = (result + (endRecoveryTime-startRecoveryTime) + ' seconds');
            startFlag = 0;

        }



        return(

           <div className="container">
                    <table className="table table-bordered Holdover">
                        <thead>
                        <tr>
                            <th>Holdover Test</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>ClockIdentity:</td>
                            <td>{clockidentity}</td>
                        </tr>
                        <tr>
                            <td>Destination Ethernet Address:</td>
                            <td>{ Ethernet }</td>
                        </tr>
                        <tr>
                            <td>GMClockClass:</td>
                            <td>{ GMClockClass }</td>
                        </tr>
                        <tr>
                            <td>GMClockAccuracy:</td>
                            <td>{ GMClockAccuracy } </td>
                        </tr>
                        <tr>
                            <td>GMClockVariance:</td>
                            <td>{ GMClockVariance }</td>
                        </tr>
                        <tr>
                            <td>Time Traceable:</td>
                            <td>{ time_traceable } </td>
                        </tr>
                        <tr>
                            <td>Frequency Traceable:</td>
                            <td>{ frequency_traceable }</td>
                        </tr>
                        <tr>
                            <td>Timesource:</td>
                            <td>{ timesource }</td>
                        </tr>
                        <tr>
                            <td>Sequence ID:</td>
                            <td>{ sequence_id } </td>
                        </tr>
                        <tr>
                            <td>Timestamp:</td>
                            <td>{ timestamp }</td>
                        </tr>
                        <tr>
                            <td>Holdover:</td>
                            <td>{ result }</td>
                        </tr>
                        </tbody>

                    </table>

                </div>
        )
    }
}
