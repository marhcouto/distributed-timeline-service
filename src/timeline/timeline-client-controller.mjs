import PeerFinder from '../peer-finder.mjs'

export class TimelineClientController {
  constructor(configs, app, timelineModel) {
    this._userName = configs.userName;
    this._timelineModel = timelineModel;
    this._peerFinder = new PeerFinder(configs, this._onPeerFound.bind(this));

    this._pendingPeerFetch = new Map();
    app.post('/api/following/:id', this._followUser.bind(this));
    app.post('/api/timeline', this._postNewMessage.bind(this));
    app.get('/api/timeline', this._getTimeline.bind(this));
  }

  _onPeerFound(peer, infoHash, _) {
    const hexInfoHash = infoHash.toString('hex');
    if (!this._pendingPeerFetch.has(hexInfoHash)) {
      console.log(`[TCC] Found peer '${peer.host}:${peer.port}' for unexpected timeline: '${hexInfoHash}'`);
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

    this._anounceLookupForPeers(this._userName);
    this._peerFinder.lookup(this._userName, async (error, nFoundClients) => {
      if (error || nFoundClients === 0) {
        return;
      }
      for(const neigh of this._pendingPeerFetch.get(this._peerFinder.hash(this._userName))) {
        const response = await fetch(`http://${neigh.host}:${neigh.port}/timeline/${this._userName}`, {
          method: 'PUT'
        });
      }
    });
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

      for(const neigh of this._pendingPeerFetch.get(this._peerFinder.hash(userName))) {
        const response = await fetch(`http://${neigh.host}:${neigh.port}/timeline/${userName}`);
        if (!response.ok) {
          continue;
        }
        const timeline = await response.json();

        this._timelineModel.followUser(userName, timeline);
        rep.status(204).end();
        return;
      }
      rep.status(404).end();
    })
  }
}