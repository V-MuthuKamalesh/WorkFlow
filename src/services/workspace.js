const { Module, Workspace, Board, Group, Item, User } = require('../models/schema'); 

async function query(filterBy) {
    try {
        if (filterBy.moduleId) {
            const module = await Module.findById(filterBy.moduleId).populate({
                path: 'workspaces',
                populate: [
                    {
                        path: 'createdBy',
                        select: 'name email', 
                    },
                    {
                        path: 'members.userId',
                        select: 'name email',
                    },
                    {
                        path: 'boards',
                        populate: [
                            {
                                path: 'groups',
                                select: '_id groupName createdAt updatedAt',
                                populate: {
                                    path: 'items',
                                    populate:{
                                        path:'assignedToId',
                                        select:'fullname email',
                                    }
                                    
                                },
                            },
                        ],
                    },
                ],
            });

            if (!module) {
                throw new Error('Module not found');
            }

            const transformedWorkspaces = module.workspaces.map((workspace) => {
                const { _id, ...rest } = workspace.toObject(); 
                return { workspaceId: _id, ...rest };
            });

            return transformedWorkspaces;
        } else {
            throw new Error('Module ID is required to fetch workspaces');
        }
    } catch (err) {
        console.error('Error fetching workspaces:', err);
        throw err;
    }
}


async function getById(workspaceId, moduleId) {
    try {
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }
        const workspace = module.workspaces.find(
            (workspace) => workspace._id.toString() === workspaceId
        );

        if (!workspace) {
            throw new Error('Workspace not found in the specified module');
        }
        const detailedWorkspace = await Workspace.findById(workspaceId)
            .populate('createdBy members.userId boards');

        return detailedWorkspace;
    } catch (err) {
        console.error('Error fetching workspace by ID:', err);
        throw err;
    }
}


async function add(workspaceData) {
    try {
        const workspace = new Workspace(workspaceData);
        await workspace.save();
        return workspace;
    } catch (err) {
        throw err;
    }
}

async function update(workspaceData) {
    try {
        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            workspaceData._id,
            { $set: workspaceData },
            { new: true }
        );
        return updatedWorkspace;
    } catch (err) {
        throw err;
    }
}

async function remove(workspaceId, moduleId) {
    try {
        await Workspace.findOneAndDelete({ _id: workspaceId, moduleId });
        return workspaceId;
    } catch (err) {
        throw err;
    }
}

async function addMember(workspaceId, userId, role = 'member', moduleId) {
    try {
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }

        const workspaceExists = module.workspaces.some(
            workspace => workspace._id.toString() === workspaceId
        );
        if (!workspaceExists) {
            throw new Error('Workspace does not belong to the specified module');
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            throw new Error('Workspace not found');
        }

        const isAlreadyMember = workspace.members.some(
            member => member.userId.toString() === userId
        );

        if (isAlreadyMember) {
            throw new Error('User is already a member of this workspace');
        }

        workspace.members.push({ userId, role });
        const updatedWorkspace = await workspace.save();

        return updatedWorkspace;
    } catch (err) {
        console.error('Error adding member to workspace:', err);
        throw err;
    }
}


// Board Functions
async function addBoard(workspaceId, boardData, moduleId) {
    try {
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }

        const workspaceExists = module.workspaces.some(
            workspace => workspace._id.toString() === workspaceId
        );
        if (!workspaceExists) {
            throw new Error('Workspace does not belong to the specified module');
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            throw new Error('Workspace not found');
        }
        boardData.workspaceName = workspace.name;
        const board = new Board(boardData);
        await board.save();

        workspace.boards.push(board._id);
        const updatedWorkspace = await workspace.save();

        return updatedWorkspace;
    } catch (err) {
        console.error('Error adding board to workspace:', err);
        throw err;
    }
}


async function removeBoard(workspaceId, boardId, moduleId) {
    try {
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }

        const workspaceExists = module.workspaces.some(
            workspace => workspace._id.toString() === workspaceId
        );
        if (!workspaceExists) {
            throw new Error('Workspace does not belong to the specified module');
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            throw new Error('Workspace not found');
        }

        await Board.findByIdAndDelete(boardId);

        workspace.boards = workspace.boards.filter(board => board.toString() !== boardId);
        const updatedWorkspace = await workspace.save();

        return updatedWorkspace;
    } catch (err) {
        console.error('Error removing board from workspace:', err);
        throw err;
    }
}
async function updateBoard(workspaceId, boardId, boardData, moduleId) {
    try {
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }

        const workspaceExists = module.workspaces.some(
            workspace => workspace._id.toString() === workspaceId
        );
        if (!workspaceExists) {
            throw new Error('Workspace does not belong to the specified module');
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            throw new Error('Workspace not found');
        }

        const boardIndex = workspace.boards.findIndex(board => board.toString() === boardId);
        if (boardIndex === -1) {
            throw new Error('Board not found in the specified workspace');
        }

        const updatedBoard = await Board.findByIdAndUpdate(
            boardId,
            { $set: boardData },  
            { new: true }
        );

        workspace.boards[boardIndex] = updatedBoard._id;

        const updatedWorkspace = await workspace.save();

        return updatedWorkspace;
    } catch (err) {
        console.error('Error updating board in workspace:', err);
        throw { error: 'Failed to update board in workspace', details: err.message };
    }
}

async function getBoard(workspaceId, boardId, moduleId) {
    try {
        // Check if the module exists
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }

        // Check if the workspace belongs to the module
        const workspaceExists = module.workspaces.some(
            (workspace) => workspace._id.toString() === workspaceId
        );
        if (!workspaceExists) {
            throw new Error('Workspace does not belong to the specified module');
        }

        // Find the workspace and ensure it exists
        const workspace = await Workspace.findById(workspaceId).populate('boards');
        if (!workspace) {
            throw new Error('Workspace not found');
        }

        // Check if the board exists in the workspace
        const boardExists = workspace.boards.some(
            (board) => board._id.toString() === boardId
        );
        if (!boardExists) {
            throw new Error('Board not found in the specified workspace');
        }

        // Fetch the board and populate its details
        const board = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'items',
                    populate: {
                        path: 'assignedToId',
                        select: '_id email fullname',
                    },
                },
            })
            .populate('workspaceName', 'workspaceName'); // Assuming workspaceName refers to Workspace schema

        if (!board) {
            throw new Error('Board not found');
        }

        // Format the response
        return {
            boardId: board._id,
            workspaceName: workspace.workspaceName,
            boardName: board.boardName,
            groups: board.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.items.map((item) => ({
                    itemName: item.itemName,
                    assignedToId: item.assignedToId,
                    status: item.status,
                    dueDate: item.dueDate,
                })),
            })),
        };
    } catch (err) {
        console.error('Error fetching board:', err);
        throw { error: 'Failed to fetch board', details: err.message };
    }
}


// Group Functions
// Add Group to Board
async function addGroup(boardId, groupData, moduleId) {
    try {
        // Find module and check if the board exists in its workspaces
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }

        const workspaceExists = module.workspaces.some(
            workspace => workspace.boards.some(board => board.toString() === boardId)
        );
        if (!workspaceExists) {
            throw new Error('Board does not belong to the specified module');
        }

        // Find the board to which the group will be added
        const board = await Board.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
        }

        // Create and save the group
        const group = new Group(groupData);
        await group.save();

        // Push the new group to the board's groups array
        board.groups.push(group._id);
        await board.save();

        return board;
    } catch (err) {
        console.error('Error adding group to board:', err);
        throw err;
    }
}

// Remove Group from Board
async function removeGroup(boardId, groupId, moduleId) {
    try {
        // Find module and check if the board exists in its workspaces
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }

        const workspaceExists = module.workspaces.some(
            workspace => workspace.boards.some(board => board.toString() === boardId)
        );
        if (!workspaceExists) {
            throw new Error('Board does not belong to the specified module');
        }

        // Find the board and remove the group from the groups array
        const board = await Board.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
        }

        await Group.findByIdAndDelete(groupId);

        // Remove the group's ID from the board's groups array
        board.groups = board.groups.filter(group => group.toString() !== groupId);
        await board.save();

        return board;
    } catch (err) {
        console.error('Error removing group from board:', err);
        throw err;
    }
}

// Update Group
async function updateGroup(workspaceId, boardId, groupId, groupData, moduleId) {
    try {
        // Step 1: Find the module and validate existence
        const module = await Module.findById(moduleId).populate({
            path: 'workspaces',
            populate: {
                path: 'boards',
                populate: 'groups',
            },
        });
        if (!module) {
            throw new Error('Module not found');
        }

        // Step 2: Validate the workspace belongs to the module
        const workspace = module.workspaces.find(
            (ws) => ws._id.toString() === workspaceId
        );
        if (!workspace) {
            throw new Error('Workspace not found in the specified module');
        }

        // Step 3: Validate the board belongs to the workspace
        const board = workspace.boards.find(
            (bd) => bd._id.toString() === boardId
        );
        if (!board) {
            throw new Error('Board not found in the specified workspace');
        }

        // Step 4: Validate the group belongs to the board
        const group = board.groups.find(
            (grp) => grp._id.toString() === groupId
        );
        if (!group) {
            throw new Error('Group not found in the specified board');
        }

        // Step 5: Update the group data
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { $set: groupData },
            { new: true }
        );

        return updatedGroup;
    } catch (err) {
        console.error('Error updating group:', err);
        throw err;
    }
}

// Item Functions
// Add Item to Group
async function addItemToGroup(workspaceId, boardId, groupId, itemData, moduleId) {
    try {
        // Step 1: Find the module and validate existence
        const module = await Module.findById(moduleId).populate({
            path: 'workspaces',
            populate: {
                path: 'boards',
                populate: 'groups',
            },
        });
        if (!module) {
            throw new Error('Module not found');
        }

        // Step 2: Validate the workspace belongs to the module
        const workspace = module.workspaces.find(
            (ws) => ws._id.toString() === workspaceId
        );
        if (!workspace) {
            throw new Error('Workspace not found in the specified module');
        }

        // Step 3: Validate the board belongs to the workspace
        const board = workspace.boards.find(
            (bd) => bd._id.toString() === boardId
        );
        if (!board) {
            throw new Error('Board not found in the specified workspace');
        }

        // Step 4: Validate the group belongs to the board
        const group = board.groups.find(
            (grp) => grp._id.toString() === groupId
        );
        if (!group) {
            throw new Error('Group not found in the specified board');
        }

        // Step 5: Find the group and create the item
        const groupToUpdate = await Group.findById(groupId);
        if (!groupToUpdate) {
            throw new Error('Group not found');
        }

        const item = new Item(itemData);
        await item.save();

        // Step 6: Add the item to the group's items array
        groupToUpdate.items.push(item._id);
        await groupToUpdate.save();

        return groupToUpdate;
    } catch (err) {
        console.error('Error adding item to group:', err);
        throw err;
    }
}


// Remove Item from Group
async function removeItemFromGroup(workspaceId, boardId, groupId, itemId, moduleId) {
    try {
        // Step 1: Find the module and validate existence
        const module = await Module.findById(moduleId).populate({
            path: 'workspaces',
            populate: {
                path: 'boards',
                populate: 'groups',
            },
        });
        if (!module) {
            throw new Error('Module not found');
        }

        // Step 2: Validate the workspace belongs to the module
        const workspace = module.workspaces.find(
            (ws) => ws._id.toString() === workspaceId
        );
        if (!workspace) {
            throw new Error('Workspace not found in the specified module');
        }

        // Step 3: Validate the board belongs to the workspace
        const board = workspace.boards.find(
            (bd) => bd._id.toString() === boardId
        );
        if (!board) {
            throw new Error('Board not found in the specified workspace');
        }

        // Step 4: Validate the group belongs to the board
        const group = board.groups.find(
            (grp) => grp._id.toString() === groupId
        );
        if (!group) {
            throw new Error('Group not found in the specified board');
        }

        // Step 5: Find the group and remove the item from the items array
        const groupToUpdate = await Group.findById(groupId);
        if (!groupToUpdate) {
            throw new Error('Group not found');
        }

        // Remove the item from the database
        const item = await Item.findByIdAndDelete(itemId);
        if (!item) {
            throw new Error('Item not found');
        }

        // Remove the item's ID from the group's items array
        groupToUpdate.items = groupToUpdate.items.filter(
            (id) => id.toString() !== itemId
        );
        await groupToUpdate.save();

        return groupToUpdate;
    } catch (err) {
        console.error('Error removing item from group:', err);
        throw err;
    }
}

// Update Item in Group
async function updateItemInGroup(workspaceId, boardId, groupId, itemData, moduleId) {
    try {
        // Step 1: Find the module and validate existence
        const module = await Module.findById(moduleId).populate({
            path: 'workspaces',
            populate: {
                path: 'boards',
                populate: 'groups',
            },
        });
        if (!module) {
            throw new Error('Module not found');
        }

        // Step 2: Validate the workspace belongs to the module
        const workspace = module.workspaces.find(
            (ws) => ws._id.toString() === workspaceId
        );
        if (!workspace) {
            throw new Error('Workspace not found in the specified module');
        }

        // Step 3: Validate the board belongs to the workspace
        const board = workspace.boards.find(
            (bd) => bd._id.toString() === boardId
        );
        if (!board) {
            throw new Error('Board not found in the specified workspace');
        }

        // Step 4: Validate the group belongs to the board
        const group = board.groups.find(
            (grp) => grp._id.toString() === groupId
        );
        if (!group) {
            throw new Error('Group not found in the specified board');
        }

        // Step 5: Find the item and update its data
        const item = await Item.findById(itemData._id);
        if (!item) {
            throw new Error('Item not found');
        }

        // Update the item data
        const updatedItem = await Item.findByIdAndUpdate(
            itemData._id,
            { $set: itemData },
            { new: true }
        );
        return updatedItem;
    } catch (err) {
        console.error('Error updating item in group:', err);
        throw err;
    }
}

async function addMembersToItem(workspaceId, boardId, groupId, itemId, userId, moduleId) {
    try {
        // Step 1: Find the module and validate existence
        const module = await Module.findById(moduleId).populate({
            path: 'workspaces',
            populate: {
                path: 'boards',
                populate: 'groups',
            },
        });
        if (!module) {
            throw new Error('Module not found');
        }

        // Step 2: Validate the workspace belongs to the module
        const workspace = module.workspaces.find(
            (ws) => ws._id.toString() === workspaceId
        );
        if (!workspace) {
            throw new Error('Workspace not found in the specified module');
        }

        // Step 3: Validate the board belongs to the workspace
        const board = workspace.boards.find(
            (bd) => bd._id.toString() === boardId
        );
        if (!board) {
            throw new Error('Board not found in the specified workspace');
        }

        // Step 4: Validate the group belongs to the board
        const group = board.groups.find(
            (grp) => grp._id.toString() === groupId
        );
        if (!group) {
            throw new Error('Group not found in the specified board');
        }

        // Step 5: Find the item and add members
        const item = await Item.findById(itemId);
        if (!item) {
            throw new Error('Item not found');
        }

         // Step 6: Check if user already exists in assignedToId array
         const userAlreadyAssigned = item.assignedToId.some(
            (id) => id.toString() === userId
        );

        if (userAlreadyAssigned) {
            throw new Error('User is already assigned to this item');
        }

        // Step 7: Add the user to the assignedToId array
        item.assignedToId.push(userId);
        const updatedItem = await item.save();

        return updatedItem;
    } catch (err) {
        console.error('Error adding members to item:', err);
        throw err;
    }
}


module.exports = {
    query,
    getById,
    add,
    update,
    remove,
    addMember,
    addBoard,
    removeBoard,
    updateBoard,
    getBoard,
    addGroup,
    removeGroup,
    updateGroup,
    addItemToGroup,
    removeItemFromGroup,
    updateItemInGroup,
    addMembersToItem
};
