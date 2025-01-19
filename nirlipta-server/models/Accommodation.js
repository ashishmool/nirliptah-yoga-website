const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        amenities: {
            type: [String],
            default: [],
        },
        room_types: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room",
            },
        ],
        photo: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

// Middleware for cascading deletion of rooms
accommodationSchema.pre("remove", async function (next) {
    await mongoose.model("Room").deleteMany({ accommodation_id: this._id });
    next();
});

const Accommodation = mongoose.model("Accommodation", accommodationSchema);
module.exports = Accommodation;
