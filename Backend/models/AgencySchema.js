const mongoose = require('mongoose');

let agencySchema = new mongoose.Schema({
    name: { type: String,  },
    address: { type: String,  },
    city: { type: String,  },
    stateid: { type:mongoose.Schema.Types.ObjectId, ref:"states",  },
    gstno:{ type: Number,},
    ownername: { type: String,  },
    contact: { 
        type: Number, 
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit number!`
        }
    },
    email: { 
        type: String, 
        unique: true,
        validate: {
            validator: function(v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    logopath: { type: String },
    signpath: { type: String },
    stamppath: { type: String },
    panno:{ type: String},
    bankname:{ type: String},
    ifsccode:{ type: String},
    accountno:{ type: Number},
    website:{ type: String},
    instructions:{ type: String},
    status:{ type: String}
});

let Agency = mongoose.model("Agencies",agencySchema);
module.exports = Agency;
