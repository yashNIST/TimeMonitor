/**
 * Created by kgb on 9/14/17.
 */

import { input_code } from '../middleware/input_functions';
import { RUN_BMCA } from '../middleware/runBMCA';
import { reset } from '../middleware/resetPacket';
import expandableTableCell from "./expandableTableCell";

var React = require('react');
var bestMasterClocks = {};
var allClocksDict = {};
var bestClocksOnPort = {};
var comparison = '';
var highlighted = {

    backgroundColor: 'green',
    color: 'whitesmoke',

};

var normal = {

    backgroundColor: 'lightgoldenrodyellow',
    color: 'black',
};

export default class BMCA extends React.Component {

    shouldComponentUpdate(nextProps) {
        return (nextProps.data !== this.props.data);
    }

    render(){

        let data = this.props.data;
        //console.log(allClocksDict);
        let mostRecentAnnounceMessage = {

            IP_SRC: data['IP_SRC'],
            IP_DST: data['IP_DST'],
            ETH_SRC: data['ETH_SRC'],
            ETH_DST: data['ETH_DST'],
            sniff_timestamp: data['sniff_timestamp'],
            sequence_id: data['sequence_id'],
            clockidentity: data['clockidentity'],
            GMClockIdentity: data['GMClockIdentity'],
            localstepsremoved: data['localstepsremoved'],
            alternateMasterFlag: data['alternateMasterFlag'],
            GMClockClass: input_code(data['GMClockClass'], 'clockclass'),
            GMClockAccuracy: input_code(data['GMClockAccuracy'], 'clockaccuracy'),
            GMClockVariance: data['GMClockVariance'],
            priority_1: data['priority_1'],
            priority_2: data['priority_2'],
            subdomain_number: data['subdomain_number'],
            timesource: input_code(data['timesource'], 'timesource'),
            announce_message_timeout: 10,
            STATE: 'M',
            comparison: ''
        };

        let results = RUN_BMCA(mostRecentAnnounceMessage, bestMasterClocks, bestClocksOnPort, allClocksDict);
        mostRecentAnnounceMessage = results[0];
        bestMasterClocks = results[1];
        bestClocksOnPort = results[2];
        allClocksDict = results[3];

        if(bestMasterClocks[mostRecentAnnounceMessage.subdomain_number][bestMasterClocks[mostRecentAnnounceMessage.subdomain_number].comparison] !== undefined) {

            comparison = bestMasterClocks[mostRecentAnnounceMessage.subdomain_number].comparison;

        }


        let AllClocksDisplay = Object.keys(allClocksDict).map(function(subdomain){

            return(
                <div>
                    <td style={{ backgroundColor: 'orangered', color: 'whitesmoke'}}>Domain: {subdomain}</td>

                        <tr>
                            {Object.keys(allClocksDict[subdomain]).map(function(port){

                                return(
                                    <div>
                                    <td style={{ backgroundColor: 'orangered', color: 'whitesmoke'}}></td><td style={{ backgroundColor: 'blue', color: 'whitesmoke'}}>Port: {port}</td>
                                            <tr>
                                            {Object.keys(allClocksDict[subdomain][port]).map(function(clock){

                                                return(

                                                    <div onClick={() => <expandableTableCell clock={allClocksDict[subdomain][port][clock]}/>}>
                                                        <tr>
                                                            <td style={{ backgroundColor: 'orangered', color: 'whitesmoke'}}></td><td style={{ backgroundColor: 'blue', color: 'whitesmoke'}}></td><td>Clock ID: {clock}</td>
                                                        </tr>
                                                    </div>
                                                )

                                            })

                                            }
                                            </tr>
                                    </div>
                                )}
                            )}

                        </tr>
                </div>
            )
        });



        let bestClocksOnPortDisplay = Object.keys(bestClocksOnPort).map(function(subdomain) {

                return (
                    <div>
                        <tr>
                        <td style={{ backgroundColor: 'orangered', color: 'whitesmoke'}}> Domain: {subdomain} </td>
                        {Object.keys(bestClocksOnPort[subdomain]).map(function(port) {
                            return(
                           <div>
                                <td style={{ backgroundColor: 'blue', color: 'whitesmoke'}}>Port: {port}</td><td>Clock ID: {bestClocksOnPort[subdomain][port].clockidentity}</td>
                           </div>
                            )
                        })}
                        </tr>
                    </div>
                )

            });

         let bestClocksDisplay = Object.keys(bestClocksOnPort).map(function(subdomain) {

             return(
                 <td style={{valign: 'top', backgroundColor: 'darkgrey'}}>
                <table className="table table-bordered">
                    <td style={{ backgroundColor: 'orangered', color: 'whitesmoke'}}>Domain: {subdomain}</td>
                        {Object.keys(bestMasterClocks[subdomain]).map(function(clock){
                                return(

                                    <div>
                                        <tr>
                                            {(!['comparison', 'STATE', 'IP_SRC', 'IP_DST', 'subdomain_number', 'alternateMasterFlag'].includes(clock)) &&
                                               <div><td style={(clock === comparison && bestMasterClocks[subdomain][clock] === bestMasterClocks[subdomain][comparison]) ? highlighted: normal }>{clock}:</td><td>{bestMasterClocks[subdomain][clock]}</td></div>}
                                        </tr>
                                    </div>
                                )

                            })

                            }
                    </table>
                 </td>

            )
        });

        return(

            <div className="container BMCA">

                <table className="table table-bordered">
                    <thead><tr><th>Devices Under Test</th></tr></thead>
                    <tbody>
                    {AllClocksDisplay}
                    </tbody>

                </table>

                <table className="table table-bordered">
                    <thead><tr><th>Best Clocks on Each Port</th></tr></thead>
                    <tbody>
                    {bestClocksOnPortDisplay}
                    </tbody>

                </table>

                <table className="table table-bordered bestMasterPacket">
                    <thead>
                    <tr>
                        <th>Best Master Clocks</th>
                    </tr>
                    </thead>
                    <tbody>
                    { bestClocksDisplay }
                    </tbody>
                </table>
            </div>
        )
    }
}

/*

 */
