/*
 *  this._map  ;  this._container
 */
L.Control.PlayBack = L.Control.extend({

    options: {
        position: 'topright',
        speed: 1,
        Max_Speed: 20,
        trackLineOptions: { weight: 2, color: '#ef0300', renderer: L.svg() }, //轨迹线配置
        OriginCircleOptions: { stroke: false, color: '#ef0300', fillColor: '#ef0300', fillOpacity: 1, radius: 4, renderer: L.svg() }, //轨迹点配置
        Icon: L.icon({ iconUrl: 'images/ship.png', iconSize: [12, 25], iconAnchor: [5, 12] })
    },

    initialize: function(options) {
        L.Control.prototype.initialize.call(this, options);
        this._data = options.data || {};
    },

    onAdd: function(map) {
        this._initLayout();
        this._update();
        this._initEvts();
        return this._container;
    },

    onRemove: function(map) {

    },

    _initLayout: function() {
        var className = 'leaflet-control-playback',
            container = this._container = L.DomUtil.create('div', className),
            operateContainer = this._operateContainer = L.DomUtil.create('div', 'operateContainer', container),
            scrollContainer = this._scrollContainer = L.DomUtil.create('div', 'scrollContainer', container);

        this._operateIcons = {
            play: 'glyphicon glyphicon-play',
            stop: 'glyphicon glyphicon-pause',
            restart: 'glyphicon glyphicon-repeat',
            slow: 'glyphicon glyphicon-backward',
            quick: 'glyphicon glyphicon-forward',
            close: 'glyphicon glyphicon-remove'
        };

        this._operateButtons = {
            play: L.DomUtil.create('span', this._operateIcons.play, operateContainer),
            restart: L.DomUtil.create('span', this._operateIcons.restart, operateContainer),
            slow: L.DomUtil.create('span', this._operateIcons.slow, operateContainer),
            quick: L.DomUtil.create('span', this._operateIcons.quick, operateContainer),
            speed: L.DomUtil.create('span', 'speed', operateContainer),
            close: L.DomUtil.create('span', this._operateIcons.close, operateContainer)
        };
        this._operateButtons.play.setAttribute('title', '播放');
        this._operateButtons.restart.setAttribute('title', '重播');
        this._operateButtons.slow.setAttribute('title', '减速');
        this._operateButtons.quick.setAttribute('title', '加速');
        this._operateButtons.close.setAttribute('title', '关闭');


        this._scrollItems = {
            startTime: L.DomUtil.create('span', 'stime', scrollContainer),
            endTime: L.DomUtil.create('span', 'etime', scrollContainer),
            scrollBar: L.DomUtil.create('input', 'range', scrollContainer),
            curtime: L.DomUtil.create('span', 'curtime', scrollContainer)
        };
        this._scrollItems.scrollBar.setAttribute('type', 'range');
    },

    _initEvts: function() {
        L.DomEvent.on(this._operateButtons.play, 'click', this._play, this);
        L.DomEvent.on(this._operateButtons.restart, 'click', this._restart, this);
        L.DomEvent.on(this._operateButtons.slow, 'click', this._slow, this);
        L.DomEvent.on(this._operateButtons.quick, 'click', this._quick, this);
        L.DomEvent.on(this._operateButtons.close, 'click', this._close, this);
        L.DomEvent.on(this._scrollItems.scrollBar, 'click mousedown dbclick', L.DomEvent.stopPropagation)
            .on(this._scrollItems.scrollBar, 'click', L.DomEvent.preventDefault)
            .on(this._scrollItems.scrollBar, 'change', this._scrollchange, this)
            .on(this._scrollItems.scrollBar, 'mousemove', this._scrollchange, this);
    },

    _play: function() {
    	this._operateButtons.play.setAttribute('class',this._operateIcons.stop);
    	 this._operateButtons.play.setAttribute('title', '暂停');
    	 this._playbackClock.start();
    },

    _restart: function() {},

    _slow: function() {},

    _quick: function() {},

    _close: function() {},

    _scrollchange: function() {},

    _update: function() {
        var map = this._map,
            data = this._data;
        if (map && data && data.features && data.features.length) {
            var tracks = [];
            for (var i = 0, len = data.features.length; i < len; i++) {
                var track = new L.Playback.Track(map, data.features[i], this.options);
                tracks.push(track);
            }
            this._trackController = new L.Playback.TrackController(map, tracks, this.options);
            this._playbackClock = new L.Playback.Clock(this._trackController, this._clockCallback, this.options);
        }
    },

    setTime: function() {
        var startTime = L.Playback.Util.getTimeStrFromUnix(this.getStartTime()),
            endTime = L.Playback.Util.getTimeStrFromUnix(this.getEndTime()),
            curTime = L.Playback.Util.getTimeStrFromUnix(this.getCurTime());
        this._scrollItems.startTime.innerText = startTime;
        this._scrollItems.endTime.innerText = endTime;
        this._scrollItems.curTime.innerText = curTime;
    },

    getStartTime: function() {
    	return this._playbackClock.getStartTime();
    },

    getEndTime: function() {
    	return this._playbackClock.getEndTime();
    },

    getCurTime: function() {
    	return this._playbackClock.getTime();
    },

    _clockCallback: function(ms) {
    	//更新时间
        var time = L.Playback.Util.getTimeStrFromUnix(ms);
        this._scrollItems.curTime.innerText = time;
    }
});
