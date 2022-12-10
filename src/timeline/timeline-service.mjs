import timestamp from 'unix-timestamp';
import axios from 'axios';
import { PeerFinder } from '../peer-finder.mjs';
import { extractSignedTimeline, getPublicKey } from '../auth.mjs';

timestamp.round = true;

export class TimelineService {
  constructor(configs, logger, timelineModel, previouslyKnownNodes) {
    this._timelineModel = timelineModel;

    this._peerFinder = new PeerFinder(configs, logger, this._onPeerFound.bind(this), previouslyKnownNodes);
    this._pendingPeerFetch = new Map();

    this.produceLog = (message) => {
      logger.log('TS', message);
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

  async postNewMessage(message) {
    const outcome = await this._timelineModel.publishMessage(message);
    await this._propagateTimeline(this._timelineModel.userName);
    return outcome;
  }

  async _propagateTimeline(userName) {
    this._anounceLookupForPeers(userName);
    this._peerFinder.lookup(userName, async (error, nFoundClients) => {
      if (error || nFoundClients === 0) {
        return;
      }
      for(const neigh of this._pendingPeerFetch.get(this._peerFinder.hash(userName))) {
        try {
          await axios.put(`http://${neigh.host}:${neigh.port}/timeline/${userName}`, this._timelineModel.getSignedTimelineForUser(userName));
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
            const timelineKeyResponse = await axios.get(`http://${neigh.host}:${neigh.port}/timeline/${userName}/key`)
            const timelineResponse = await axios.get(`http://${neigh.host}:${neigh.port}/timeline/${userName}`);
            this._timelineModel.followUser(userName, timelineResponse.data, timelineKeyResponse.data);
            this._peerFinder.announce(userName);
            resolve('FOUND_PEER')
            return;
          } catch(e) {
            this.produceLog(`Failed communication with ${neigh.host}:${neigh.port}`);
          }
        }
        reject('NO_AVAILABLE_PEER_FOUND');
      })
    })
  }

  async replaceTimeline(userName, timelineData) {
    if(userName === this._timelineModel.userName) {
      return false;
    }
    const timeline = await this._timelineModel.getTimelineForUser(userName);
    const newTimelineLastUpdate = timeline[timeline.length - 1].timestamp;
    if (newTimelineLastUpdate && newTimelineLastUpdate <= await this._timelineModel.lastUpdated(userName)) {
      return false;
    }
    this._timelineModel.replaceTimeline(userName, timelineData);
    return true;
  }

  updateTimeline(userName) {
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
        const localTimeline = await this._timelineModel.getTimelineForUser(userName);
        let mostRecentTimelineUpdate = 0
        if (localTimeline.length !== 0) {
          mostRecentTimelineUpdate = localTimeline[localTimeline.length - 1].timestamp
        }
        let mostRecentHost = null;
        this.produceLog(`Found peers for ${userName}: ${JSON.stringify(foundPeers)}`);
        for(const neigh of foundPeers) {
          try {
            const timelineLastUpdate = (await axios.get(`http://${neigh.host}:${neigh.port}/timeline/last-update/${userName}`)).data.lastUpdated;
            if (timelineLastUpdate && timelineLastUpdate > mostRecentTimelineUpdate) {
              mostRecentTimelineUpdate = timelineLastUpdate;
              mostRecentHost = neigh;
            }
          } catch(_) {
            this.produceLog(`Failed communication with ${neigh.host}:${neigh.port}`);
            reject('UNEXPECTED_ERROR_WHILE_UPDATING');
          }
        }
        if (mostRecentHost == null) {
          resolve('DONE_UPDATE');
          return;
        }
        const updatedTimeline = await axios.get(`http://${mostRecentHost.host}:${mostRecentHost.port}/timeline/${userName}`);
        this._timelineModel.replaceTimeline(userName, updatedTimeline.data);
        this._peerFinder.announce(userName);
        resolve('DONE_UPDATE');
      })
    })
  }

  async syncTimeline() {
    for (const following of this._timelineModel.following.keys()) {
      try {
        await this.updateTimeline(following);
      } catch(e) {
        console.error(e);
      }
    }
    await this._propagateTimeline(this._timelineModel.userName);
  }

  getTimelineForRemoteUser(userName) {
    if (userName === this._timelineModel.userName) return this._timelineModel.getTimelineForUser(userName);
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
        for (const neigh of foundPeers) {
          try {
            const remoteTimeline = await axios.get(`http://${neigh.host}:${neigh.port}/timeline/${userName}?unsigned=true`);
            resolve(remoteTimeline.data);
            return;
          } catch(e) {
            this.produceLog(`Failed communication with ${neigh.host}:${neigh.port}`);
          }
        }
        reject('No valid timeline');
        return;
      })
    })
  }

  async getPublicKey(userName) {
    return await getPublicKey(userName, this._timelineModel.keystore);
  }

  async getMergedTimeline() {
    const mergedTimeline = this._timelineModel.timeline.map((post) => {
      return {
        ...post,
        userName: this._timelineModel.userName 
      }
    });

    // Followers timeline
    for (let [k, _] of this._timelineModel.following) {
      const timeline = await this._timelineModel.getTimelineForUser(k);
      mergedTimeline.push(...timeline.map((post) => {
        return {
          ...post,
          userName: k
        }
      }));
    }
    mergedTimeline.sort((a, b) => a.timestamp - b.timestamp);
    return mergedTimeline;
  }

  dhtJSON() {
    return this._peerFinder._dht.toJSON();
  }
}
