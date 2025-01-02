const { Workspace, Board, Group, Item, User } = require('../models/schema'); // Import models


// Workspace Functions
async function query(filterBy) {
    try {
        const criteria = {};
        if (filterBy.name) criteria.name = { $regex: filterBy.name, $options: 'i' };
        const workspaces = await Workspace.find(criteria).populate('createdBy members.userId boards');
        return workspaces;
    } catch (err) {
        throw err;
    }
}

async function getById(workspaceId) {
    try {
        const workspace = await Workspace.findById(workspaceId)
            .populate('createdBy members.userId boards');
        return workspace;
    } catch (err) {
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

async function remove(workspaceId) {
    try {
        await Workspace.findByIdAndDelete(workspaceId);
        return workspaceId;
    } catch (err) {
        throw err;
    }
}

async function addMember(workspaceId, userId, role = 'member') {
    try {
        console.log(workspaceId, userId);
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
        throw err;
    }
}


// Board Functions
async function addBoard(workspaceId, boardData) {
    try {
        const board = new Board(boardData);
        await board.save();

        const workspace = await Workspace.findById(workspaceId);
        workspace.boards.push(board._id);
        await workspace.save();

        return workspace;
    } catch (err) {
        throw err;
    }
}

async function removeBoard(workspaceId, boardId) {
    try {
        await Board.findByIdAndDelete(boardId);

        const workspace = await Workspace.findById(workspaceId);
        workspace.boards = workspace.boards.filter(board => board.toString() !== boardId);
        await workspace.save();

        return workspace;
    } catch (err) {
        throw err;
    }
}

async function updateBoard(boardData) {
    try {
        const updatedBoard = await Board.findByIdAndUpdate(
            boardData._id,
            { $set: boardData },
            { new: true }
        );
        return updatedBoard;
    } catch (err) {
        throw err;
    }
}

// Group Functions
async function addGroup(boardId, groupData) {
    try {
        const group = new Group(groupData);
        await group.save();

        const board = await Board.findById(boardId);
        board.groups.push(group._id);
        await board.save();

        return board;
    } catch (err) {
        throw err;
    }
}

async function removeGroup(boardId, groupId) {
    try {
        await Group.findByIdAndDelete(groupId);

        const board = await Board.findById(boardId);
        board.groups = board.groups.filter(group => group.toString() !== groupId);
        await board.save();

        return board;
    } catch (err) {
        throw err;
    }
}

async function updateGroup(groupData) {
    try {
        const updatedGroup = await Group.findByIdAndUpdate(
            groupData._id,
            { $set: groupData },
            { new: true }
        );
        return updatedGroup;
    } catch (err) {
        throw err;
    }
}

// Item Functions
async function addItemToGroup(groupId, itemData) {
    try {
        const item = new Item(itemData);
        await item.save();

        const group = await Group.findById(groupId);
        group.items.push(item._id);
        await group.save();

        return group;
    } catch (err) {
        throw err;
    }
}

async function removeItemFromGroup(groupId, itemId) {
    try {
        await Item.findByIdAndDelete(itemId);

        const group = await Group.findById(groupId);
        group.items = group.items.filter(item => item.toString() !== itemId);
        await group.save();

        return group;
    } catch (err) {
        throw err;
    }
}

async function updateItemInGroup(itemData) {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            itemData._id,
            { $set: itemData },
            { new: true }
        );
        return updatedItem;
    } catch (err) {
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
    addGroup,
    removeGroup,
    updateGroup,
    addItemToGroup,
    removeItemFromGroup,
    updateItemInGroup,
};
