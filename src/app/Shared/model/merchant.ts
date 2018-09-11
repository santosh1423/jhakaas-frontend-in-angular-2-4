export class Merchant {
    name: String;
    DBA: String;
    firstName: String;
    lastName: String;
    mobileNumber: Number;
    email: String;
    dob: Date;
    status: String;
    gender: String;
    country: String;
    password: String;
    type: Merchant;
    phone: [{
      name: {type: String; required: true};
      value: {type: String; required: true}
    }];
    Address1: {
      type: String;
      maxlength: 150
    };
    Address2: {
      type: String;
      maxlength: 150
    };
    Address3: {
      type: String;
      maxlength: 150
    };
    City: {
      type: String;
      maxlength: 150
    };
    State: {
      type: String;
      maxlength: 150
    };
    postalCode: String;
    aadharCard: {
      type: Number;
      maxlength: 12;
      minLength: 12;
    };
    gst: String;
    panNumber: String;
    currency: {
      currencyName: {
        type: String;
        default: 'Indian Rupees'
      };
      currencySymbol: {
        type: String;
        default: '₹'
      };
      currencyCode: {
        type: String;
        default: 'INR'
      }
    };
    minimumOrder: {
      type: Number
    };
    orderPlacement: [{
      name: {type: String; required: true};
      value: {type: Boolean; required: true; default: true}
    }];
    lat: Number;
    lng: Number;
    visibilityRadius: {
      type: Number;
      default: 1
    };
    visibilityRadiusMeasure: {
      type: String;
      enum: ['KM', 'Mile', 'Meter'];
      default: 'KM'
    };
    deliveryTime: {
      type: Number;
      required: true
    };
    visible: {type: Boolean; default: true};
    documents: [{
      name: String;
      url: String;
      // verified: Boolean;
      verifiedOn: Date;
      verifiedBy: String
    }];
    displayImage: [{
      url: String;
      numInSequence: Number
    }];
    timings: [{
      day: { type: String; required: true; enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']};
      openingTime: {type: String; required: true};
      closingTime: {type: String; required: true};

    }];
    category: String;
    description: String;
    subscription: [
      {
        name: {
          type: String;
          required: true
        };
        fromDate: {
          type: Date;
          required: true
        };
        toDate: {
          type: Date;
          required: true
        };
        paymentDate: {
          type: Date;
          required: true
        };
        createDate: {
          type: Date;
          required: true
        };
        createdBy: {
          type: Date;
          required: true
        };
        status: {
          type: String;
          required: true;
          enum: ['Active', 'Expired', 'Pending']
        }
      }
    ];
    terms_of_service: {
      type: String;
    };
    privacy_policy: {
      type: String;
    };
    return_policy: {
      type: String;
    };
    refund_policy: {
      type: String;
    };
    social_media: [{
      name: {
        type: String;
      };
      url: {
        type: String;
      };
      icon: {
        type: String;
      }
    }];
  }
