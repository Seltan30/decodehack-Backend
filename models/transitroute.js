const routeSchema = new Schema({
  service:    { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  stops: [
    {
      stop:   { type: Schema.Types.ObjectId, ref: 'Stop', required: true },
      offset: { type: Number, required: true } // minutes after departure
    }
  ],
});

const TransitRoute = mongoose.model('TransitRoute', routeSchema);
module.exports = TransitRoute;