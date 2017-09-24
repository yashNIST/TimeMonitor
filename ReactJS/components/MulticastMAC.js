var React = require('react');
import NavigationBar from "../Navbar"

export default class MulticastMAC extends React.Component {

    render(){

        let data = this.props.data;
        let clockidentity = data['clockidentity'];
        let Ethernet = data['ETH_DST'];
        let sequence_id = data['sequence_id'];
        let timestamp = data['sniff_timestamp'];
        let result = '';

        if(Ethernet === '01:80:c2:00:00:0e'){

            result = "Path Delay Request Messages Have Correct MAC Address";

        }

        else {

            result = "Path Delay Request Messages Do Not Have Correct MAC Address";

        }

        return(

           <div className="container">
                    <table className="table table-bordered MulticastMAC">
                        <thead>
                        <tr>
                            <th>Multicast MAC Address Test</th>
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
                            <td>Sequence ID:</td>
                            <td>{ sequence_id } </td>
                        </tr>
                        <tr>
                            <td>Timestamp:</td>
                            <td>{ timestamp } </td>
                        </tr>
                        <tr>
                            <td>Result:</td>
                            <td>{ result }</td>
                        </tr>
                        </tbody>

                    </table>

                </div>
        )
    }
}
