export class Subscription {
  name: {
    type: String,
      length: 50,
      unique: [true, 'Subscription Name has to be Unique'],
      required: [true, 'Subscription Name is mandatory']
  };
  description: {
    type: String,
      length: 250,
  };
  amount: {
    type: Number,
      required: [true, 'Subscription Amount is required']
  };
  status: {
    type: String,
  enum: ['Active', 'De-active'],
  default: 'Active'
  };
  days: {
    type: Number,
      required: [true, 'Subscription Days is required']
  };
}
