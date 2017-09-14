/**
 * Created by kgb on 9/12/17.
 */
var FixedDataTable = require('fixed-data-table');
const React = require("react");
import {connect} from "react-redux"

const {Table, Column, Cell} = FixedDataTable;

export default class Announce_Message_Table extends React.Component {


    render() {

        let announce_messages = this.props.data;
        var output = Object.keys(announce_messages).map(function(key){

            return(
                <tr key={key}>

                    <td>{announce_messages[key].clockidentity}</td>
                    <td>{announce_messages[key].GMClockIdentity}</td>
                    <td>{announce_messages[key].GMClockClass}</td>
                    <td>{announce_messages[key].GMClockVariance}</td>
                    <td>{announce_messages[key].GMClockAccuracy}</td>
                    <td>{announce_messages[key].ETH_DST}</td>
                    <td>{announce_messages[key].IP_DST}</td>
                    <td>{announce_messages[key].priority_1}</td>
                    <td>{announce_messages[key].priority_2}</td>
                    <td>{announce_messages[key].timesource}</td>
                    <td>{announce_messages[key].sequence_id}</td>
                    <td>{announce_messages[key].sniff_timestamp}</td>


                </tr>

            )

        });

        return (
            <div className="container-table" id="Announce_Message_Table">
                <table className="table message"><thead><tr><th>Announce Messages</th></tr></thead></table>
                 <table className="table table-bordered table-striped">

                     <thead>
                     <tr className="headers">
                         <th width="12%">Clock Identity</th>
                         <th width="12%">GMClock ID</th>
                         <th width="6%">GMClock Class</th>
                         <th width="6%">GMClock Variance</th>
                         <th width="6%">GMClock Accuracy</th>
                         <th width="12%">Destination Ethernet</th>
                         <th width="6%">Destination IP</th>
                         <th width="6%">Priority 1</th>
                         <th width="6%">Priority 2</th>
                         <th width="6%">Timesource</th>
                         <th width="6%">Sequence ID</th>
                         <th width="12%">Timestamp</th>
                     </tr>
                     </thead>
                     <tbody>
                     {output}
                     </tbody>
                </table>
            </div>

        )
    }
}

/*
const TextCell = ({rowIndex, data, col, ...props}) => (

            <Cell {...props}>
               {data.getObjectAt(rowIndex)[col]}
            </Cell>
            );

    var announce_messages = this.props;
        return (
                 <Table
                 rowHeight={50}
                 rowsCount={1578}
                 width={1000}
                 height={500}
                 headerHeight={50}
                 {...this.props}>
                     <Column
                    header={<Cell>Clock Identity</Cell>}
                    cell={<TextCell data={announce_messages} col={announce_messages.clockidentity}/>}
                    width={100}
                />
                <Column
                    header={<Cell>GMClock Identity</Cell>}
                    cell={<TextCell data={announce_messages} col={announce_messages.GMClockIdentity}/>}
                    width={100}
                />
                <Column
                    header={<Cell>GMClock Class</Cell>}
                    cell={<TextCell data={announce_messages} col={announce_messages.GMClockClass}/>}
                    width={100}
                />
                <Column
                    header={<Cell>GMClock Variance</Cell>}
                    cell={<TextCell data={announce_messages} col={announce_messages.GMClockVariance}/>}
                    width={100}
                />
                <Column
                    header={<Cell>GMClock Accuracy</Cell>}
                    cell={<TextCell data={announce_messages} col={announce_messages.GMClockAccuracy}/>}
                    width={100}
                />
                <Column
                    header={<Cell>Destination Ethernet</Cell>}
                    cell={<TextCell data={announce_messages} col={announce_messages.ETH_DST}/>}
                    width={100}
                />
                <Column
                    header={<Cell>Destination IP</Cell>}
                    cell={<TextCell data={announce_messages} col={announce_messages.IP_DST}/>}
                    width={100}
                />
                <Column
                    header={<Cell>Priority 1</Cell>}
                    cell={<TextCell data={announce_messages} col={announce_messages.priority_1}/>}
                    width={100}
                />
                <Column
                    header={<Cell>Priority 2</Cell>}
                    cell={<TextCell data={announce_messages} col={announce_messages.priority_1}/>}
                    width={100}
                />
                <Column
                    header={<Cell>Timesource</Cell>}
                    cell={<TextCell data={announce_messages} col={announce_messages.timesource}/>}
                    width={100}
                />
                <Column
                    header={<Cell>Sequence ID</Cell>}
                    cell={<TextCell data={announce_messages} col={announce_messages.sequence_id}/>}
                    width={100}
                />
                <Column
                    header={<Cell>Timestamp</Cell>}
                    cell={<TextCell data={announce_messages} col={announce_messages.sniff_timestamp}/>}
                    width={100}
                />
                 </Table>
    */