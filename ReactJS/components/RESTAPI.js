/**
 * Created by kgb on 10/3/17.
 */

var React = require('react');

export default class RESTAPI extends React.Component {

    shouldComponentUpdate(nextProps) {
        return (nextProps.data !== this.props.data);
    }


    render(){

        return(
            <div><h2>Django REST API Pages for PTP Messages</h2>
                <p>   </p>
                <p>   </p>
            <div className="container">

                <div style={{textAlign:'center'}}>

                <p>All Announce Messages List: <a href = 'All_Announce_Messages'>All Announce Messages</a></p>
                <p>All Path Delay Messages List: <a href = 'All_PDelay_Messages'>All Path Delay Messages</a></p>
                <p>Individual Announce Messages By Key: <a href = 'Individual_Announce_Messages/1'> Individual Announce Messages</a></p>
                <p>Individual Path Delay Messages By Key: <a href = 'Individual_PDelay_Messages/1'> Individual PDelay Messages</a></p>
                </div>
            </div>
            </div>
        )
    }
}