/**
 * Created by kgb on 9/12/17.
 */

const React = require("react");
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
let clockidentity = [];
let GMClockID = [];
let GMClockClass = [];
let GMClockVariance = [];
let GMClockAccuracy = [];
let Ethernet = [];
let priority_1 = [];
let priority_2= [];
let timesource = [];
let sequence_id = [];
let timestamp = [];
let tableData = [];

export default class Announce_Message_Table extends React.Component {

    render() {

        let mostRecentAnnounceMessage = this.props.data[this.props.data.length - 1];
        if (mostRecentAnnounceMessage !== undefined) {

                clockidentity.push(mostRecentAnnounceMessage['clockidentity']);
                GMClockID.push(mostRecentAnnounceMessage['GMClockIdentity']);
                GMClockClass.push(mostRecentAnnounceMessage['GMClockClass']);
                GMClockVariance.push(mostRecentAnnounceMessage['GMClockVariance']);
                GMClockAccuracy.push(mostRecentAnnounceMessage['GMClockAccuracy']);
                Ethernet.push(mostRecentAnnounceMessage['ETH_DST']);
                priority_1.push(mostRecentAnnounceMessage['priority_1']);
                priority_2.push(mostRecentAnnounceMessage['priority_2']);
                timesource.push(mostRecentAnnounceMessage['timesource']);
                sequence_id.push(mostRecentAnnounceMessage['sequence_id']);
                timestamp.push(mostRecentAnnounceMessage['sniff_timestamp']);


                let rowData = {

                    "clockidentity": clockidentity[clockidentity.length-1],
                    "GMClockIdentity": GMClockID[GMClockID.length-1],
                    "GMClockClass": GMClockClass[GMClockClass.length-1],
                    "GMClockVariance": GMClockVariance[GMClockVariance.length-1],
                    "GMClockAccuracy": GMClockAccuracy[GMClockAccuracy.length-1],
                    "ETH_DST": Ethernet[Ethernet.length-1],
                    "priority_1": priority_1[priority_1.length-1],
                    "priority_2": priority_2[priority_2.length-1],
                    "timesource": timesource[timesource.length-1],
                    "sequence_id": sequence_id[sequence_id.length-1],
                    "timestamp": timestamp[timestamp.length-1],
                };

                if(mostRecentAnnounceMessage['sniff_timestamp'] !== timestamp[timestamp.length-2]) {

                    tableData.push(rowData);

                }

                return (

                    <div className = "container">
                    <div className="container-table">
                        <table className="table message">
                            <thead>
                            <tr>
                                <th>Announce Messages</th>
                            </tr>
                            </thead>
                        </table>
                        <BootstrapTable data={tableData} height={400} bodyStyle={{overflow: 'overlay'}} scrollTop={'Bottom'} options={ {noDataText: 'Connect to an Interface to Start Reading Announce Messages'} } striped>
                            <TableHeaderColumn dataField="clockidentity">ClockIdentity</TableHeaderColumn>
                            <TableHeaderColumn dataField="GMClockIdentity">GM ID</TableHeaderColumn>
                            <TableHeaderColumn dataField="GMClockClass">GM Class</TableHeaderColumn>
                            <TableHeaderColumn dataField="GMClockVariance">GM Variance</TableHeaderColumn>
                            <TableHeaderColumn dataField="GMClockAccuracy">GM Accuracy</TableHeaderColumn>
                            <TableHeaderColumn dataField="ETH_DST">Ethernet</TableHeaderColumn>
                            <TableHeaderColumn dataField="priority_1">Priority 1</TableHeaderColumn>
                            <TableHeaderColumn dataField="priority_2">Priority 2</TableHeaderColumn>
                            <TableHeaderColumn dataField="timesource">Timesource</TableHeaderColumn>
                            <TableHeaderColumn dataField="sequence_id">Sequence ID</TableHeaderColumn>
                            <TableHeaderColumn dataField="timestamp" isKey={true}>Timestamp</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                    </div>

                )

        }
        else {

            return (
                <div className="conatiner">
                    <p>Loading...</p>
                </div>
            )
        }


    }

}

/*

<TableHeaderColumn dataField="timestamp" isKey={true}>Timestamp</TableHeaderColumn>
    */
