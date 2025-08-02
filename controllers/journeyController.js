const mongoose = require('mongoose');
const Stop = require('../models/stop');
const Service = require('../models/service');
const TransitRoute = require('../models/transitroute');

// GET /journeys?start=Bab%20El%20Oued&end=Kouba
async function journeys(req, res) {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ success: false, error: 'Please provide both start and end stop names.' });
    }

    // 1. gib les stop
    const [startStop, endStop] = await Promise.all([
      Stop.findOne({ name: start }),
      Stop.findOne({ name: end })
    ]);
    if (!startStop || !endStop) {
      return res.status(404).json({ success: false, error: 'Start or end stop not found.' });
    }

    // charger les routes
    const allRoutes = await TransitRoute
      .find()
      .populate('service', 'name')
      .populate('stops.stop', 'name');

    const journeys = [];

    // direct (seul service)
    for (const route of allRoutes) {
      const stops = route.stops.map(s => s.stop);
      const i = stops.findIndex(s => s._id.equals(startStop._id));
      const j = stops.findIndex(s => s._id.equals(endStop._id));
      if (i >= 0 && j >= 0 && i < j) {
        journeys.push({
          type: 'direct',
          segments: [{
            service: route.service.name,
            stops: stops.slice(i, j + 1).map(s => s.name)
          }]
        });
      }
    }

    // INDIRECT b algo (BFS)
    const maxStops = 20;
    const results = [];
    const queue = [{
      currentId: startStop._id,
      visited: new Set([startStop._id.toString()]),
      segments: [],
      stopCount: 1
    }];

    while (queue.length) {
      const state = queue.shift();

      // id wslna sjlha
      if (state.currentId.equals(endStop._id) && state.segments.length > 1) {
        results.push({
          type: 'indirect',
          segments: state.segments
        });
        // balak continue ??
      }

      // ida 6wila makalah
      if (state.stopCount >= maxStops) continue;

      // explore bra onca
      for (const route of allRoutes) {
        const stops = route.stops.map(s => s.stop);
        const idx = stops.findIndex(s => s._id.equals(state.currentId));
        if (idx < 0) continue;

        // chof kaml les stops fl service
        for (let k = idx + 1; k < stops.length; k++) {
          const next = stops[k];
          const nextId = next._id.toString();
          if (state.visited.has(nextId)) continue;

          const pathStops = stops.slice(idx, k + 1).map(s => s.name);
          const newStopCount = state.stopCount + (pathStops.length - 1);
          if (newStopCount > maxStops) break;

          queue.push({
            currentId: stops[k]._id,
            visited: new Set([...state.visited, nextId]),
            segments: [
              ...state.segments,
              { service: route.service.name, stops: pathStops }
            ],
            stopCount: newStopCount
          });
        }
      }
    }

    // mix them
    journeys.push(...results);

    return res.json({ success: true, journeys });
  } catch (err) {
    console.error('journeys error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { journeys };
