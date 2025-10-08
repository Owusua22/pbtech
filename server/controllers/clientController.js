const Client = require("../models/Client");

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const { name, email, company, phone, address, projects } = req.body;

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "Client with this email already exists" });
    }

    const client = new Client({ name, email, company, phone, address, projects });
    await client.save();

    res.status(201).json({ message: "Client created successfully", client });
  } catch (error) {
    res.status(500).json({ message: "Error creating client", error: error.message });
  }
};

// Get all clients
// Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find().populate({
      path: "projects",
      options: { strictPopulate: false }, // prevent missing refs from breaking
    });

    res.status(200).json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching clients",
      error: error.message,
    });
  }
};


// Get a single client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate("projects");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error fetching client", error: error.message });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  try {
    const { name, email, company, phone, address, projects } = req.body;

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { name, email, company, phone, address, projects },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client updated successfully", client });
  } catch (error) {
    res.status(500).json({ message: "Error updating client", error: error.message });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting client", error: error.message });
  }
};
