const mongoose = require('mongoose');
const Stop = require('../models/stop');
const Service = require('../models/service');
const TransitRoute = require('../models/transitroute');

// Controller to fill the database with sample data
async function fillDataBase(req, res) {
  try {
    // delete old
    await Promise.all([
      Stop.deleteMany({}),
      Service.deleteMany({}),
      TransitRoute.deleteMany({})
    ]);

    // Create Stops (fi alger brk)
    const stopsData = [
      { name: 'Bab El Oued' },
      { name: 'Bab Ezzouar' },
      { name: 'Hussein Dey' },
      { name: 'Kouba' },
      { name: 'Bir Mourad Raïs' },
      { name: 'Bachdjerrah' },
      { name: 'El Harrach' },
      { name: 'El Madania' },
      { name: 'Cheraga' },
      { name: 'Dar El Beïda' },
      { name: 'Bouzaréah' },
      { name: 'Oued Koriche' }
    ];
    const stops = await Stop.insertMany(stopsData);
    const stopMap = stops.reduce((map, stop) => {
      map[stop.name] = stop._id;
      return map;
    }, {});

    // les Services
    const servicesData = [
      { name: 'Bus Line A',    type: 'bus',     basePrice: 30,  comfort: 3, frequency: 20, turnaround: 10 },
      { name: 'Bus Line B',    type: 'bus',     basePrice: 25,  comfort: 2, frequency: 15, turnaround: 8  },
      { name: 'Bus Line C',    type: 'bus',     basePrice: 20,  comfort: 2, frequency: 10, turnaround: 5  },
      { name: 'Bus Express D', type: 'bus',     basePrice: 50,  comfort: 4, frequency: 30, turnaround: 15 },
      { name: 'Tramway 1',     type: 'tramway', basePrice: 40,  comfort: 4, frequency: 10, turnaround: 5  },
      { name: 'Tramway 2',     type: 'tramway', basePrice: 45,  comfort: 4, frequency: 12, turnaround: 6  }
    ];
    const services = await Service.insertMany(servicesData);
    const serviceMap = services.reduce((map, svc) => {
      map[svc.name] = svc._id;
      return map;
    }, {});

    // les Routes (direct w les bzaf les stops)
    const routesData = [
      // Short: 3 stops
      {
        serviceName: 'Bus Line A',
        stops: [
          { name: 'Bab El Oued',      offset: 0  },
          { name: 'Hussein Dey',      offset: 15 },
          { name: 'Kouba',            offset: 30 }
        ]
      },
      // Medium: 5 stops
      {
        serviceName: 'Bus Line B',
        stops: [
          { name: 'Kouba',            offset: 0  },
          { name: 'El Madania',       offset: 10 },
          { name: 'Bir Mourad Raïs',  offset: 20 },
          { name: 'Bachdjerrah',      offset: 35 },
          { name: 'El Harrach',       offset: 50 }
        ]
      },
      // Long: 7 stops
      {
        serviceName: 'Bus Line C',
        stops: [
          { name: 'Dar El Beïda',     offset: 0  },
          { name: 'Oued Koriche',     offset: 12 },
          { name: 'Cheraga',          offset: 25 },
          { name: 'Bouzaréah',        offset: 40 },
          { name: 'Bab Ezzouar',      offset: 60 },
          { name: 'El Madania',       offset: 80 },
          { name: 'Bab El Oued',      offset: 100 }
        ]
      },
      // Express: fewer stops but fast
      {
        serviceName: 'Bus Express D',
        stops: [
          { name: 'Dar El Beïda',     offset: 0  },
          { name: 'Bouzaréah',        offset: 15 },
          { name: 'Bab El Oued',      offset: 35 }
        ]
      },
      // Tramway line short
      {
        serviceName: 'Tramway 1',
        stops: [
          { name: 'Bir Mourad Raïs',  offset: 0  },
          { name: 'El Harrach',       offset: 10 },
          { name: 'Bachdjerrah',      offset: 20 },
          { name: 'El Madania',       offset: 30 }
        ]
      },
      // Tramway long scenic route
      {
        serviceName: 'Tramway 2',
        stops: [
          { name: 'Bab El Oued',      offset: 0   },
          { name: 'Hussein Dey',      offset: 8   },
          { name: 'Kouba',            offset: 18  },
          { name: 'El Harrach',       offset: 30  },
          { name: 'Cheraga',          offset: 45  },
          { name: 'Dar El Beïda',     offset: 60  }
        ]
      }
    ];

    for (const route of routesData) {
      const doc = new TransitRoute({
        service: serviceMap[route.serviceName],
        stops: route.stops.map(s => ({
          stop:   stopMap[s.name],
          offset: s.offset
        }))
      });
      await doc.save();
    }

    res.status(200).json({ message: 'Database filled with sample routes.' });
  } catch (err) {
    console.error('Error filling database:', err);
    res.status(500).json({ error: 'Failed to fill database.' });
  }
}

module.exports = { fillDataBase };
