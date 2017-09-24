/**
 * Created by kgb on 9/14/17.
 */

var React = require('react');
var startFlag = 0;
var result = '';
var startRecoveryTime = 0;
var endRecoveryTime = 0;

import { input_code } from '../middleware/input_functions'

export default class Holdover extends React.Component {

    render(){

        let data = this.props.data;
        let mostRecentAnnounceMessage = {
            'clockidentity': data['clockidentity'],
            'GMClockID': data['GMClockIdentity'],
            'GMClockClass': input_code(data['GMClockClass'], 'clockclass'),
            'GMClockVariance': data['GMClockVariance'],
            'GMClockAccuracy': input_code(data['GMClockAccuracy'], 'clockaccuracy'),
            'Ethernet': data['ETH_DST'],
            'time_traceable': data['timetraceable'],
            'frequency_traceable': data['frequencytraceable'],
            'timesource': input_code(data['timesource'], 'timesource'),
            'sequence_id': data['sequence_id'],
            'timestamp': data['sniff_timestamp'],

        }
        result = Holdover_Test(startFlag, mostRecentAnnounceMessage);
        startFlag = result[0];
        result = result[1];


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
                            <td>{mostRecentAnnounceMessage.clockidentity}</td>
                        </tr>
                        <tr>
                            <td>Destination Ethernet Address:</td>
                            <td>{ mostRecentAnnounceMessage.Ethernet }</td>
                        </tr>
                        <tr>
                            <td>GMClockClass:</td>
                            <td>{ mostRecentAnnounceMessage.GMClockClass }</td>
                        </tr>
                        <tr>
                            <td>GMClockAccuracy:</td>
                            <td>{ mostRecentAnnounceMessage.GMClockAccuracy } </td>
                        </tr>
                        <tr>
                            <td>GMClockVariance:</td>
                            <td>{ mostRecentAnnounceMessage.GMClockVariance }</td>
                        </tr>
                        <tr>
                            <td>Time Traceable:</td>
                            <td>{ mostRecentAnnounceMessage.time_traceable } </td>
                        </tr>
                        <tr>
                            <td>Frequency Traceable:</td>
                            <td>{ mostRecentAnnounceMessage.frequency_traceable }</td>
                        </tr>
                        <tr>
                            <td>Timesource:</td>
                            <td>{ mostRecentAnnounceMessage.timesource }</td>
                        </tr>
                        <tr>
                            <td>Sequence ID:</td>
                            <td>{ mostRecentAnnounceMessage.sequence_id } </td>
                        </tr>
                        <tr>
                            <td>Timestamp:</td>
                            <td>{ mostRecentAnnounceMessage.timestamp }</td>
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


function Holdover_Test(startFlag, mostRecentAnnounceMessage){

    if(mostRecentAnnounceMessage.time_traceable === 0 && mostRecentAnnounceMessage.frequency_traceable === 0 && startFlag === 0){

            startRecoveryTime = mostRecentAnnounceMessage.timestamp;
            startFlag = 1;

        } else if(mostRecentAnnounceMessage.time_traceable === 1 && mostRecentAnnounceMessage.frequency_traceable === 1 && startFlag ===1) {

        endRecoveryTime = mostRecentAnnounceMessage.timestamp;
        if ((endRecoveryTime - startRecoveryTime) > 16) {

            result = 'FAIL: Recovery Time is '
        }
        else {

            result = 'PASS: Recovery Time is '
        }

        result = (result + (endRecoveryTime - startRecoveryTime) + ' seconds');
        startFlag = 0;
    }
    return([startFlag, result]);
}
