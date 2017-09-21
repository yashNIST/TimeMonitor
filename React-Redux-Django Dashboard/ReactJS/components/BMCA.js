/**
 * Created by kgb on 9/14/17.
 */

var React = require('react');
let bestMasterClock = reset(bestMasterClock);
let allClocksDict = {};
let bestClocksOnPort = {};
let rbestMasterClock = reset(rbestMasterClock);

export default class BMCA extends React.Component {

    render(){

        let data = this.props.data;
        //console.log(allClocksDict);
        let mostRecentAnnounceMessage = {

            'IP_SRC': data['IP_SRC'],
            'IP_DST': data['IP_DST'],
            'ETH_SRC': data['ETH_SRC'],
            'ETH_DST': data['ETH_DST'],
            'sniff_timestamp': data['sniff_timestamp'],
            'sequence_id': data['sequence_id'],
            'clockidentity': data['clockidentity'],
            'GMClockIdentity': data['GMClockIdentity'],
            'localstepsremoved': data['localstepsremoved'],
            'alternateMasterFlag': data['alternateMasterFlag'],
            'GMClockClass': data['GMClockClass'],
            'GMClockAccuracy': data['GMClockAccuracy'],
            'GMClockVariance': data['GMClockVariance'],
            'priority_1': data['priority_1'],
            'priority_2': data['priority_2'],
            'SRC_PORT': data['SRC_PORT'],
            'DST_PORT': data['DST_PORT'],
            'subdomain_number': data['subdomain_number'],
            'timesource': data['timesource'],
            'announce_message_timeout': 10,
            'STATE': 'M'

        };

        let results = RUN_BMCA(mostRecentAnnounceMessage, bestMasterClock, bestClocksOnPort, allClocksDict);
        mostRecentAnnounceMessage = results[0];
        bestMasterClock = results[1];
        bestClocksOnPort = results[2];
        allClocksDict = results[3];


        let AllClocksDisplay = Object.keys(allClocksDict).map(function(subdomain){

            return(

                <div>
                    <td>Domain: {subdomain}</td>

                        <tr>
                            {Object.keys(allClocksDict[subdomain]).map(function(port){

                                return(
                                    <div>
                                    <td></td><td>Port:  {port}</td>
                                            <tr>
                                            {Object.keys(allClocksDict[subdomain][port]).map(function(clock){

                                                return(

                                                    <div>
                                                        <tr>
                                                        <td></td><td></td><td>Clock ID:  {clock}</td>
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

        let bestClocksDisplay = Object.keys(bestClocksOnPort).map(function(port) {

                return (
                    <div>

                        <tr>
                            <td>Port: {port}</td>
                            <td>Clock ID: {bestClocksOnPort[port].clockidentity}</td>
                        </tr>
                    </div>
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
                    {bestClocksDisplay}
                    </tbody>

                </table>

                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Best Master Clock</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Clock ID: </td>
                        <td>{ bestMasterClock.clockidentity } </td>
                    </tr>
                    <tr>
                        <td>Grandmaster Clock Identity:</td>
                        <td>{ bestMasterClock.GMClockIdentity } </td>
                    </tr>
                    <tr>
                        <td>Grandmaster Clock Class:</td>
                        <td>{ bestMasterClock.GMClockClass } </td>
                    </tr>
                    <tr>
                        <td>Grandmaster Clock Accuracy:</td>
                        <td>{ bestMasterClock.GMClockAccuracy } </td>
                    </tr>
                    <tr>
                        <td>Grandmaster Clock Variance:</td>
                        <td>{ bestMasterClock.GMClockVariance } </td>
                    </tr>
                    <tr>
                        <td>Priority 1:</td>
                        <td>{ bestMasterClock.priority_1 } </td>
                    </tr>
                    <tr>
                        <td>Priority 2:</td>
                        <td>{ bestMasterClock.priority_2 } </td>
                    </tr>
                    <tr>
                        <td>Local Steps Removed:</td>
                        <td>{ bestMasterClock.localstepsremoved }</td>
                    </tr>
                    <tr>
                        <td>Source Port:</td>
                        <td>{ bestMasterClock.SRC_PORT } </td>
                    </tr>
                    <tr>
                        <td>Destination Port:</td>
                        <td>{ bestMasterClock.DST_PORT } </td>
                    </tr>
                    <tr>
                        <td>Source Ethernet:</td>
                        <td>{ bestMasterClock.ETH_SRC } </td>
                    </tr>
                    <tr>
                        <td>Destination Ethernet: </td>
                        <td>{ bestMasterClock.ETH_DST } </td>
                    </tr>
                    <tr>
                        <td>Source IP: </td>
                        <td>{ bestMasterClock.IP_SRC } </td>
                    </tr>
                    <tr>
                        <td>Destination IP: </td>
                        <td>{ bestMasterClock.IP_DST } </td>
                    </tr>
                    <tr>
                        <td>Timestamp: </td>
                        <td>{ bestMasterClock.sniff_timestamp } </td>
                    </tr>
                    <tr>
                        <td>Sequence ID: </td>
                        <td>{ bestMasterClock.sequence_id } </td>
                    </tr>
                    <tr>
                        <td>Timesource:</td>
                        <td>{ bestMasterClock.timesource } </td>
                    </tr>
                    <tr>
                        <td>Announce Message Timeout:</td>
                        <td>{ bestMasterClock.announce_message_timeout } </td>
                    </tr>
                    </tbody>
                </table>
            </div>

        )
    }
}



function RUN_BMCA(mostRecentAnnounceMessage, bestMasterClock, bestClocksOnPort, allClocksDict){

    if(!(mostRecentAnnounceMessage['subdomain_number'] in allClocksDict)){

        allClocksDict[mostRecentAnnounceMessage.subdomain_number] = {[mostRecentAnnounceMessage['ETH_DST']]: {}};

    }
    else{

        if(allClocksDict[mostRecentAnnounceMessage.subdomain_number][mostRecentAnnounceMessage.ETH_DST] === {}){

            allClocksDict[mostRecentAnnounceMessage.subdomain_number][mostRecentAnnounceMessage.ETH_DST] = {[mostRecentAnnounceMessage.clockidentity]: mostRecentAnnounceMessage};

        }
        else{

            allClocksDict[mostRecentAnnounceMessage.subdomain_number][mostRecentAnnounceMessage.ETH_DST][mostRecentAnnounceMessage.clockidentity] = mostRecentAnnounceMessage;
            let check = check_timeout(allClocksDict, bestMasterClock);
            allClocksDict = check[0];
            bestMasterClock = check[1];

            for (let subdomain in allClocksDict) {

                for (let port in allClocksDict[subdomain]) {

                    //rbestMasterClock = reset(rbestMasterClock);

                    if (port === mostRecentAnnounceMessage.ETH_DST) {

                        for (let clockid in allClocksDict[subdomain][port]) {

                            if (rbestMasterClock.clockidentity === '') {


                                rbestMasterClock = allClocksDict[subdomain][port][clockid];


                            } else {

                                rbestMasterClock = ((dataSetComparison(allClocksDict[subdomain][port][clockid], rbestMasterClock) === rbestMasterClock.clockidentity) ? rbestMasterClock : allClocksDict[mostRecentAnnounceMessage.subdomain_number][port][clockid]);

                            }
                            //StateDecision here
                            if (clockid === mostRecentAnnounceMessage.clockidentity) {

                                if (qualified(mostRecentAnnounceMessage, allClocksDict[subdomain][port][clockid]) === true) {

                                    allClocksDict[subdomain][port][clockid] = mostRecentAnnounceMessage;

                                }

                            }
                        }

                        if (!(mostRecentAnnounceMessage.clockidentity in allClocksDict[subdomain][port])) {

                            allClocksDict[subdomain][port] = {[mostRecentAnnounceMessage.clockidentity]: mostRecentAnnounceMessage};

                        }

                        if (!(port in bestClocksOnPort)) {

                            bestClocksOnPort[port] = rbestMasterClock;

                        }
                        else {

                            bestClocksOnPort[port] = ((rbestMasterClock.clockidentity !== '') ? bestClocksOnPort[port] : rbestMasterClock);

                        }

                        bestMasterClock = ((dataSetComparison(bestMasterClock, rbestMasterClock) === bestMasterClock.clockidentity) ? bestMasterClock : rbestMasterClock);
                        console.log(bestClocksOnPort);
                    }

                }
            }

            }
        }

    return([mostRecentAnnounceMessage, bestMasterClock, bestClocksOnPort, allClocksDict])
}


function check_timeout(allClocksDict, bestMasterClock){

    for(let subdomain in allClocksDict){

        for(let port in allClocksDict[subdomain]) {


            for (let clock in allClocksDict[subdomain][port]) {

                if (allClocksDict[subdomain][port][clock].announce_message_timeout === 0) {

                    if (clock === bestMasterClock.clockidentity) {

                         bestMasterClock = reset(bestMasterClock);

                    }

                    delete(allClocksDict[subdomain][port][clock]);
                    break;

                }

                allClocksDict[subdomain][port][clock].announce_message_timeout --;

            }
         }

        }

        return([allClocksDict, bestMasterClock])
    }

function qualified(mostRecentAnnounceMessage, lastAnnounceMessage){

    if(mostRecentAnnounceMessage.localstepsremoved > 255){

        return(false);
    }

    if(mostRecentAnnounceMessage.sequence_id === lastAnnounceMessage.sequence_id){

        return(false);
    }

    return(true);
}

function stateDecision(mostRecentAnnounceMessage, bestMasterOnPort, bestMaster){

    if(1 <= mostRecentAnnounceMessage.GMClockClass <= 127){

        if(dataSetComparison(mostRecentAnnounceMessage, bestMasterOnPort) === mostRecentAnnounceMessage.clockidentity){


        }
    }


}

function dataSetComparison(firstPacket, secondPacket){

    if(firstPacket['GMClockIdentity'] === secondPacket['GMClockIdentity']){

        return(GMIdentity_EqualComparison(firstPacket, secondPacket))
    }
    else{

        return(GMIdentity_NotEqualComparison(firstPacket, secondPacket))
    }
}

function GMIdentity_EqualComparison(firstPacket, secondPacket){

    if(firstPacket['localstepsremoved'] > (secondPacket['localstepsremoved'] + 1)){

        return(secondPacket['clockidentity'])

    } else if((firstPacket['localstepsremoved'] + 1) < firstPacket['localstepsremoved']){

        return(firstPacket['clockidentity'])

    } else {

        if(firstPacket['localstepsremoved'] !== secondPacket['localstepsremoved']){

            return((firstPacket['localstepsremoved'] < secondPacket['localstepsremoved'] ? firstPacket['clockidentity']: secondPacket['clockidentity']))
        }
        else{

            if(firstPacket['clockidentity'] !== secondPacket['clockidentity']){

                    return((firstPacket['clockidentity'] < secondPacket['clockidentity'] ? firstPacket['clockidentity']: secondPacket['clockidentity']))

            }
            else{

                if(firstPacket['ETH_DST'] !== secondPacket['ETH_DST']){

                     return((firstPacket['ETH_DST'] < secondPacket['ETH_DST'] ? firstPacket['clockidentity']: secondPacket['clockidentity']))

                }

                else{

                    return(-2)
                }

            }
        }

    }

}

function GMIdentity_NotEqualComparison(firstPacket, secondPacket){


    if(firstPacket['priority_1'] !== secondPacket['priority_1']){

          return((firstPacket['priority_1'] < secondPacket['priority_1'] ? firstPacket['clockidentity']: secondPacket['clockidentity']))

    }
    else{

        if(firstPacket['GMClockClass'] !== secondPacket['GMClockClass']){

              return((firstPacket['GMClockClass'] < secondPacket['GMClockClass'] ? firstPacket['clockidentity']: secondPacket['clockidentity']))
        }
        else{

            if(firstPacket['GMClockAccuracy'] !== secondPacket['GMClockAccuracy']){

              return((firstPacket['GMClockAccuracy'] < secondPacket['GMClockAccuracy'] ? firstPacket['clockidentity']: secondPacket['clockidentity']))
            }
            else{

                if(firstPacket['GMClockVariance'] !== secondPacket['GMClockVariance']){

                    return((firstPacket['GMClockVariance'] < secondPacket['GMClockVariance'] ? firstPacket['clockidentity']: secondPacket['clockidentity']))

                }
                else{


                    if(firstPacket['priority_2'] !== secondPacket['priority_2']){

                        return((firstPacket['priority_2'] < secondPacket['priority_2'] ? firstPacket['clockidentity']: secondPacket['clockidentity']))

                    }
                    else{

                        return((firstPacket['GMClockIdentity'] < secondPacket['GMClockIdentity'] ? firstPacket['clockidentity']: secondPacket['clockidentity']))


                    }

                }
            }
        }

    }


}

function reset(packet){

    packet = {'IP_SRC': '',
            'IP_DST': '',
            'ETH_SRC': '',
            'ETH_DST': '',
            'sniff_timestamp': 0,
            'sequence_id': 0,
            'clockidentity': '',
            'GMClockIdentity': '',
            'localstepsremoved': '',
            'alternateMasterFlag': 0,
            'GMClockClass': 128,
            'GMClockAccuracy': 0,
            'GMClockVariance': 0,
            'priority_1': 128,
            'priority_2': 128,
            'SRC_PORT': '',
            'DST_PORT': '',
            'subdomain_number': 0,
            'announce_message_timeout': 10,
            'STATE': 'M'};

    return(packet)
}
