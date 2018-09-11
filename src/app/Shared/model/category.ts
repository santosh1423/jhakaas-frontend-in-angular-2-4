export class Category {
  name: {
    type: String,
    length: 50,
    unique: [true, 'Category Name has to be Unique'],
    required: [true, 'Category Name is mandatory']
  };
  code: {
    type: String,
    length: 12,
    unique: [true, 'Category Code has to be Unique'],
    required: [true, 'Category Code is mandatory']
  };
  description: {
    type: String,
    length: 250,
  };
  image: {
    type: String,
    length: 255,
  };
  icon: {
    type: String,
    length: 255,
    required: [true, 'Category Icon is mandatory']
  };
  type: {
    type: String,
    enum: ['Merchant', 'Product'],
    default: 'Merchant'
  };
  index: {
    type: Number,
    default: 0
  };
  status: {
    type: String,
    enum: ['Active', 'De-active'],
    default: 'Active'
  };
  parentCategory: {
    type: String,
    length: 50
  };
  hsnCode: {
    type: String,
  };
}
