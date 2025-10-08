const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    company: String,
    phone: String,
    address: String,
    
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    createdAt: { type: Date, default: Date.now },
}); 

module.exports = mongoose.model("Client", clientSchema);