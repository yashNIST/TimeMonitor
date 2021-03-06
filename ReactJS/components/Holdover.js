/**
 * Created by kgb on 9/14/17.
 */

var React = require('react');
var startHoldover = 0;
var holdover = '';
var startHoldoverTime = 0;
var endHoldoverTime = 0;

var startRecovery = 0;
var recovery = '';
var startRecoveryTime = 0;
var endRecoveryTime = 0;
var classtest = '';

var startGPSUnlock = 0;
var GPSLock = '';

import { input_code } from '../middleware/input_functions'

export default class Holdover extends React.Component {

    shouldComponentUpdate(nextProps) {
        return (nextProps.data !== this.props.data);
    }

    render(){

        let data = this.props.data;
        let mostRecentAnnounceMessage = {
            'clockidentity': data['clockidentity'],
            'GMClockID': data['GMClockIdentity'],
            'GMClockClass': data['GMClockClass'],
            'GMClockVariance': data['GMClockVariance'],
            'GMClockAccuracy': data['GMClockAccuracy'],
            'Ethernet': data['ETH_DST'],
            'time_traceable': data['timetraceable'],
            'frequency_traceable': data['frequencytraceable'],
            'timesource': input_code(data['timesource'], 'timesource'),
            'sequence_id': data['sequence_id'],
            'timestamp': parseFloat(data['sniff_timestamp']),

        };

        let result = Holdover_Test(startHoldover, startRecovery, mostRecentAnnounceMessage, data['GMClockClass']);
        startHoldover = result[0];
        startRecovery = result[1];
        holdover = result[2];
        recovery = result[3];
        classtest = classTest(data['GMClockClass'], data['GMClockAccuracy'], mostRecentAnnounceMessage);
        mostRecentAnnounceMessage.GMClockClass = input_code(mostRecentAnnounceMessage.GMClockClass, 'clockclass') + ' ( ' + mostRecentAnnounceMessage.GMClockClass + ' ) ' + '  ( ' + classtest + ' ) ';
        mostRecentAnnounceMessage.GMClockAccuracy = input_code(mostRecentAnnounceMessage.GMClockAccuracy, 'clockaccuracy');

        if(parseInt(data['GMClockClass']) !== 6 && startGPSUnlock === 0){

            startGPSUnlock = mostRecentAnnounceMessage.timestamp;
        }
        else if(parseInt(data['GMClockClass']) !== 6){

            GPSLock = 'The last time GPS was locked was ' + (mostRecentAnnounceMessage.timestamp - startGPSUnlock) + ' seconds ago';
        }
        else{

            startGPSUnlock = 0;
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
                            <td>{mostRecentAnnounceMessage.clockidentity}</td>
                        </tr>
                        <tr>
                            <td>Destination Ethernet Address:</td>
                            <td>{ mostRecentAnnounceMessage.Ethernet }</td>
                        </tr>
                        <tr>
                            <td>GMClockClass:</td>
                            <td>{ mostRecentAnnounceMessage.GMClockClass}</td>
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
                            <td>{ holdover }</td>
                        </tr>
                        <tr>
                            <td>Recovery:</td>
                            <td>{ recovery }</td>
                        </tr>
                        <tr>
                            <td>Last GPS Lock:</td>
                            <td>{ GPSLock }</td>
                        </tr>
                        </tbody>

                    </table>

                </div>
        )
    }
}

function classTest(clockclass, clockaccuracy, mostRecentAnnounceMessage){

    if(clockclass === 6 && clockaccuracy < 34){

        return('Clock Class switched to ' + clockclass);

    } else {

        if (clockclass === 7 && clockaccuracy <= 34) {

            return ('Clock Class switched to ' + clockclass);

        } else if (clockclass === 52 && clockaccuracy === 35) {

            return ('Clock Class switched to ' + clockclass);

        } else if (clockclass === 187 && clockaccuracy > 35) {

            return ('Clock Class switched to ' + clockclass);
        }

        return ('Clock Class Failed to Switch on Change in Clock Accuracy');

    }
}

function Holdover_Test(startHoldover, startRecovery,  mostRecentAnnounceMessage, classcode){


    if(classcode === 7 && startHoldover === 0) {

                startHoldoverTime = mostRecentAnnounceMessage.timestamp;
                startHoldover = 1;
                holdover = '';

    }

    if(classcode === 52 && startHoldover === 1){

        endHoldoverTime = mostRecentAnnounceMessage.timestamp;
        if((endHoldoverTime - startHoldoverTime) >= 5){

            holdover = 'Clock Stayed Within 250 ns   [ ' +  (endHoldoverTime - startHoldoverTime) + ' seconds ]';
        }
        startHoldover = 0;
    }

    if(classcode === 187 && startRecovery === 0){


        startRecoveryTime = mostRecentAnnounceMessage.timestamp;
        startRecovery = 1;
        recovery = '';
    }

    if(classcode === 6 && startRecovery === 1){

        endRecoveryTime = mostRecentAnnounceMessage.timestamp;
        recovery = 'Recovery Time was  ' + (endRecoveryTime - startRecoveryTime) + ' seconds';
        startRecovery = 0;

    }


    return([startHoldover, startRecovery,  holdover, recovery]);
}

