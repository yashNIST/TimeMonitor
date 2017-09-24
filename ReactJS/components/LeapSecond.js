/**
 * Created by kgb on 9/14/17.
 */

var React = require('react');

import { input_code } from '../middleware/input_functions';

export default class LeapSecond extends React.Component {

    render(){

        let data = this.props.data;
        let clockidentity = data['clockidentity'];
        let Ethernet = data['ETH_DST'];
        let utcoffset = data['utc_offset'];
        let origintimestamp_seconds = data['origintimestampseconds'];
        let utcreasonable = data['utcreasonable'];
        let li59 = data['li59'];
        let li61 = data['li61'];
        let timesource = input_code(data['timesource'], 'timesource');
        let sequence_id = data['sequence_id'];
        let timestamp = data['sniff_timestamp'];
        let action = '';

        if(li59 === 1){

            action = 'Negative Leap Second';

        } else if(li61 === 1){

            action = "Positive Leap Second";


        } else{

            action = "Do Nothing";
        }


        return(

           <div className="container">
                    <table className="table table-bordered LeapSecond">
                        <thead>
                        <tr>
                            <th>Leap Second Test</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>ClockIdentity:</td>
                            <td>{clockidentity}</td>
                        </tr>
                        <tr>
                            <td>Destination Ethernet Address:</td>
                            <td>{ Ethernet } </td>
                        </tr>
                        <tr>
                            <td>Current UTC Offset:</td>
                            <td>{ utcoffset } </td>
                        </tr>
                        <tr>
                            <td>Origin Timestamp Seconds:</td>
                            <td>{ origintimestamp_seconds } </td>
                        </tr>
                        <tr>
                            <td>UTC Reasonable:</td>
                            <td>{ utcreasonable }  </td>
                        </tr>
                        <tr>
                            <td>Li 59:</td>
                            <td>{ li59 } </td>
                        </tr>
                        <tr>
                            <td>li 61:</td>
                            <td>{ li61 } </td>
                        </tr>
                        <tr>
                            <td>Timesource:</td>
                            <td>{ timesource } </td>
                        </tr>
                        <tr>
                            <td>Sequence ID:</td>
                            <td>{ sequence_id } </td>
                        </tr>
                        <tr>
                            <td>Timestamp:</td>
                            <td>{ timestamp } </td>
                        </tr>
                        <tr>
                            <td>Action:</td>
                            <td>{ action }</td>
                        </tr>
                        </tbody>

                    </table>

                </div>
        )
    }
}
