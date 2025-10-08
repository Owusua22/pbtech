const Project = require("../models/Project");

/**
 * Create a new project
 */
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate("client", "name email")
      .populate("assignedStaff", "name email");

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

/**
 * Get all projects
 */
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client", "name email")
      .populate("assignedStaff", "name email");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

/**
 * Get project by ID
 */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name email")
      .populate("assignedStaff", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error: error.message });
  }
};

/**
 * Update project
 */
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("client", "name email")
      .populate("assignedStaff", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error: error.message });
  }
};

/**
 * Delete project
 */
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};

/**
 * Archive / Unarchive project
 */
exports.toggleArchiveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.archived = !project.archived;
    await project.save();

    res.status(200).json({
      message: `Project ${project.archived ? "archived" : "unarchived"} successfully`,
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Error archiving project", error: error.message });
  }
};

/**
 * Get projects by client
 */
exports.getProjectsByClient = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.params.clientId })
      .populate("client", "name email")
      .populate("assignedStaff", "name email");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching client projects", error: error.message });
  }
};

/**
 * Get projects by staff
 */
exports.getProjectsByStaff = async (req, res) => {
  try {
    const projects = await Project.find({ assignedStaff: req.params.userId })
      .populate("client", "name email")
      .populate("assignedStaff", "name email");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff projects", error: error.message });
  }
};

/**
 * Upload project media (save file info in MongoDB)
 */
exports.uploadProjectMedia = async (req, res) => {
  try {
    const { projectId } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Save local file info or request URL (depending on your setup)
    project.media.push({
      url: `/uploads/${file.filename}`,
      type: file.mimetype,
      name: file.originalname,
    });

    await project.save();
    res.status(200).json({ message: "Media uploaded", media: project.media });
  } catch (error) {
    res.status(500).json({ message: "Error uploading media", error: error.message });
  }
};

/**
 * Delete project media
 */
exports.deleteProjectMedia = async (req, res) => {
  try {
    const { projectId, mediaId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const media = project.media.id(mediaId);
    if (!media) return res.status(404).json({ message: "Media not found" });

    // Simply remove from the array
    media.remove();
    await project.save();

    res.status(200).json({ message: "Media deleted", media: project.media });
  } catch (error) {
    res.status(500).json({ message: "Error deleting media", error: error.message });
  }
};
