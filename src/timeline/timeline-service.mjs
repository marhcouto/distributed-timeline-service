import timestamp from 'unix-timestamp';
import axios from 'axios';
import { PeerFinder } from '../peer-finder.mjs';
import { log } from '../utils/logging.mjs'

timestamp.round = true;

export class TimelineService {
  constructor(configs, timelineModel) {
    this._timelineModel = timelineModel;

    this._peerFinder = new PeerFinder(configs, this._onPeerFound.bind(this));
    this._pendingPeerFetch = new Map();

    this.produceLog = (message) => {
      log('TS', message);
    }
  }

  _anounceLookupForPeers(userName) {
    this._pendingPeerFetch.set(this._peerFinder.hash(userName), [])
  }

  _onPeerFound(peer, infoHash, _) {
    const hexInfoHash = infoHash.toString('hex');
    if (!this._pendingPeerFetch.has(hexInfoHash)) {
      this.produceLog(`Found peer '${peer.host}:${peer.port}' for unexpected timeline: '${hexInfoHash}'`);
      return;
    }
    this._pendingPeerFetch.get(hexInfoHash).push({
      host: peer.host,
      port: peer.port
    });
  }

  unfollowUser(userName) {
    return this._timelineModel.unfollowUser(userName);
  }

  postNewMessage(message) {
    const outcome = this._timelineModel.publishMessage(message);
    this._propagateTimeline(this._timelineModel.userName);
    return outcome;
  }

  _propagateTimeline(userName) {
    this._anounceLookupForPeers(userName);
    this._peerFinder.lookup(userName, async (error, nFoundClients) => {
      if (error || nFoundClients === 0) {
        return;
      }
      for(const neigh of this._pendingPeerFetch.get(this._peerFinder.hash(userName))) {
        try {
          await axios.put(`http://${neigh.host}:${neigh.port}/timeline/${userName}`, this._timelineModel.getTimelineForUser(userName));
        } catch (e) {
          if (e.code !== 403) {
            this.produceLog(`Client ${neigh.host}:${neigh.port} rejected timeline update`);
          }
        }
      }
    });
  }

  followUser(userName) {
    return new Promise((resolve, reject) => {
      this._anounceLookupForPeers(userName);
      this._peerFinder.lookup(userName, async (error, nFoundClients) => {
        if (error || nFoundClients === 0) {
          reject(JSON.stringify({
            error: `Couldn't find user with name: ${userName}`
          }))
          return;
        }
        const foundPeers = this._pendingPeerFetch.get(this._peerFinder.hash(userName));
        this.produceLog(`Found peers for ${userName}: ${JSON.stringify(foundPeers)}`);
        for(const neigh of foundPeers) {
          try {
            const timeline = await axios.get(`http://${neigh.host}:${neigh.port}/timeline/${userName}`);
            this._timelineModel.followUser(userName, timeline.data);
            this._peerFinder.announce(userName);
            resolve('FOUND_PEER');
            return;
          } catch {
            this.produceLog(`Failed communication with ${neigh.host}:${neigh.port}`);
          }
        }
        reject('NO_AVAILABLE_PEER_FOUND');
      })
    })
  }

  timelineLastUpdate(userName) {
    return this._timelineModel.lastUpdated(userName);
  }

  replaceTimeline(userName, timelineData) {
    if(userName === this._timelineModel.userName) {
      return false;
    }

    const newTimelineLastUpdate = timelineData[timelineData.length - 1].timestamp;
    if (newTimelineLastUpdate && newTimelineLastUpdate <= this.timelineLastUpdate(userName)) {
      return false;
    }
    this._timelineModel.replaceTimeline(userName, timelineData);
    return true;
  }

  updateTimeline(userName) {
    new Promise((resolve, reject) => {
      this._anounceLookupForPeers(userName);
      this._peerFinder.lookup(userName, async (error, nFoundClients) => {
        if (error || nFoundClients === 0) {
          reject(JSON.stringify({
            error: `Couldn't find user with name: ${userName}`
          }))
          return;
        }
        
        console.error(`Getting updates for ${userName}`);
        const foundPeers = this._pendingPeerFetch.get(this._peerFinder.hash(userName));
        const localTimeline = this._timelineModel.getTimelineForUser(userName);
        let mostRecentTimelineUpdate = 0
        if (localTimeline.length !== 0) { 
          mostRecentTimelineUpdate = localTimeline[localTimeline.length - 1].timestamp
        }
        console.error(`Most recent local timeline: ${mostRecentTimelineUpdate}`);
        let mostRecentHost = null;
        this.produceLog(`Found peers for ${userName}: ${JSON.stringify(foundPeers)}`);
        for(const neigh of foundPeers) {
          try {
            const timelineLastUpdate = (await axios.get(`http://${neigh.host}:${neigh.port}/timeline/last-update/${userName}`)).data.lastUpdated;
            console.error(`Remote update: ${timelineLastUpdate}`);
            if (timelineLastUpdate && timelineLastUpdate > mostRecentTimelineUpdate) {
              mostRecentTimelineUpdate = timelineLastUpdate;
              mostRecentHost = neigh;
            }
          } catch(e) {
            this.produceLog(`Failed communication with ${neigh.host}:${neigh.port}`);
            reject('UNEXPECTED_ERROR_WHILE_UPDATING');
          }
        }
        if (mostRecentHost == null) {
          resolve('DONE_UPDATE');
          return;
        }
        console.log(mostRecentHost)
        const updatedTimeline = await axios.get(`http://${mostRecentHost.host}:${mostRecentHost.port}/timeline/${userName}`);
        this._timelineModel.replaceTimeline(userName, updatedTimeline.data);
        this._peerFinder.announce(userName);
        resolve('DONE_UPDATE');
      })
    })
  }

  syncTimeline() {
    for (const following of this._timelineModel.following.keys()) {
      this.updateTimeline(following);
    }
    this._propagateTimeline(this._timelineModel.userName);
  }

  getTimelineForUser(userName) {
    return this._timelineModel.getTimelineForUser(userName)
  }

  getMergedTimeline() {
    const mergedTimeline = this._timelineModel.timeline.map((elem) => { return {
      ...elem,
      userName: this._timelineModel.userName
    }});
    this._timelineModel.following.forEach((v, k) => {
      mergedTimeline.push(...v.map(elem => { return {
        ...elem,
        userName: k
      }}))
    })
    mergedTimeline.sort((a, b) => a.timestamp - b.timestamp);
    return mergedTimeline;
  }
}
