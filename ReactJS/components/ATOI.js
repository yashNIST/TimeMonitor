/**
 * Created by kgb on 9/14/17.
 */
var React = require('react');


export default class ATOI extends React.Component {

    render(){

        let data = this.props.data;
        let clockidentity = data['clockidentity'];
        let Ethernet = data['ETH_DST'];
        let displayname = data['ATOI_DisplayName'];
        let key = data['ATOI_Key'];
        let offset = data['ATOI_Offset'];
        let tlvtype = data['ATOI_TLVType'];
        let jumpseconds = data['ATOI_JumpSeconds'];
        let timeOfNextJump = data['ATOI_TimeOfNextJump'];
        let sequence_id = data['sequence_id'];
        let timestamp = data['sniff_timestamp'];

        return(

           <div className="container">
                    <table className="table table-bordered ATOI">
                        <thead>
                        <tr>
                            <th>ATOI Test</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>ClockIdentity:</td>
                            <td>{ clockidentity }</td>
                        </tr>
                        <tr>
                            <td>Destination Ethernet Address:</td>
                            <td>{ Ethernet } </td>
                        </tr>
                        <tr>
                            <td>Display Name:</td>
                            <td>{ displayname }</td>
                        </tr>
                        <tr>
                            <td>Key:</td>
                            <td>{ key }</td>
                        </tr>
                        <tr>
                            <td>Offset :</td>
                            <td>{ offset }</td>
                        </tr>
                        <tr>
                            <td>TLV Type:</td>
                            <td>{ tlvtype }</td>
                        </tr>
                        <tr>
                            <td>Jump Seconds:</td>
                            <td>{ jumpseconds } </td>
                        </tr>
                        <tr>
                            <td>Time of Next Jump:</td>
                            <td>{ timeOfNextJump } </td>
                        </tr>
                        <tr>
                            <td>Sequence ID:</td>
                            <td>{ sequence_id } </td>
                        </tr>
                        <tr>
                            <td>Timestamp:</td>
                            <td>{ timestamp } </td>
                        </tr>
                        </tbody>

                    </table>
                </div>
        )
    }
}
