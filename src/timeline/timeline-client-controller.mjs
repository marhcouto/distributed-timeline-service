import { log } from '../utils/logging.mjs';
import PeerFinder from '../peer-finder.mjs';
import axios from 'axios';

export class TimelineClientController {
  constructor(configs, app, timelineModel) {
    this._timelineModel = timelineModel;
    this.produceLog = (message) => {
      log('TCC', message);
    }
    this._peerFinder = new PeerFinder(configs, this._onPeerFound.bind(this));

    this._pendingPeerFetch = new Map();
    app.post('/api/following/:id', this._followUser.bind(this));
    app.post('/api/timeline', this._postNewMessage.bind(this));
    app.delete('/api/following/:id', this._unfollowUser.bind(this));
    app.get('/api/timeline', this._getTimeline.bind(this));
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

  _anounceLookupForPeers(userName) {
    this._pendingPeerFetch.set(this._peerFinder.hash(userName), [])
  }

  _getTimeline(_, rep) {
    rep.status(200).send(this._timelineModel.getMergedTimeline());
  }

  _postNewMessage(req, rep) {
    const body = req.body;
    this._timelineModel.publishMessage(body.message);

    this._anounceLookupForPeers(this._timelineModel.userName);
    this._peerFinder.lookup(this._timelineModel.userName, async (error, nFoundClients) => {
      if (error || nFoundClients === 0) {
        return;
      }
      for(const neigh of this._pendingPeerFetch.get(this._peerFinder.hash(this._timelineModel.userName))) {
        try {
          await axios.put(`http://${neigh.host}:${neigh.port}/timeline/${this._timelineModel.userName}`, this._timelineModel.getTimelineForUser(this._timelineModel.userName));
        } catch (e) {
          if (e.code !== 403) {
            this.produceLog(`Client ${neigh.host}:${neigh.port} rejected timeline update`);
          }
        }
      }
    });
    rep.status(204).end();
  }

  _unfollowUser(req, rep) {
    const userName = req.params.id;
    if (!this._timelineModel.unfollowUser(userName)) {
      rep.status(404).end();
      return;
    }
    rep.status(204).end();
  }

  _followUser(req, rep) {
    const userName = req.params.id;

    this._anounceLookupForPeers(userName);
    this._peerFinder.lookup(userName, async (error, nFoundClients) => {
      if (error || nFoundClients === 0) {
        rep.status(404).send(JSON.stringify({
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
          rep.status(204).end();
          return;
        } catch {
          this.produceLog(`Failed communication with ${neigh.host}:${neigh.port}`);
        }
      }
      rep.status(404).end();
    })
  }
}