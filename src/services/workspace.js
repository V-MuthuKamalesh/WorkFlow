const { Workspace } = require('../models/schema'); 

exports.findWorkspaceById = async (id) => {
  try {
    return await Workspace.findById(id);
  } catch (error) {
    throw new Error('Error finding workspace');
  }
};

exports.createWorkspace = async (workspaceData) => {
  try {
    const newWorkspace = new Workspace(workspaceData);
    await newWorkspace.save();
    return newWorkspace;
  } catch (error) {
    throw new Error('Error creating workspace');
  }
};

exports.updateWorkspace = async (id, updateData) => {
  try {
    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedWorkspace) {
      throw new Error('Workspace not found');
    }
    return updatedWorkspace;
  } catch (error) {
    throw new Error('Error updating workspace');
  }
};

exports.deleteWorkspace = async (id) => {
  try {
    const deletedWorkspace = await Workspace.findByIdAndDelete(id);
    if (!deletedWorkspace) {
      throw new Error('Workspace not found');
    }
    return 'Workspace deleted successfully';
  } catch (error) {
    throw new Error('Error deleting workspace');
  }
};
