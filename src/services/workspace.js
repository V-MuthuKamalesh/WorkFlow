const { Favourite, Module, Workspace, Board, Group } = require('../models/schema'); 
const workService = require('../services/workservice');
const devService = require('../services/devservice');
const service = require('../services/service');
const crmService = require('../services/crmservice');

async function query(filterBy) {
    try {
        const { moduleId, userId } = filterBy;
        const module = await Module.findById(moduleId).populate({
            path: 'workspaces',
            select: 'workspaceName createdBy members',
        });
        if (!module) {
            console.log('Module not found');
        }
        // console.log(module);
        
        const transformedWorkspaces = module.workspaces
        .filter(workspace => {
            return workspace.createdBy.toString() === userId || workspace.members.some(member => member.userId.toString() === userId);
          })
        .map(workspace => {
            const { _id, workspaceName } = workspace.toObject();
            return { workspaceId: _id.toString(), workspaceName };
        });
        // console.log(transformedWorkspaces);
        return transformedWorkspaces;
    } catch (err) {
        console.error('Error fetching workspaces:', err);
    }
}

async function getById(workspaceId) {
    try {
        const detailedWorkspace = await Workspace.findById(workspaceId)
            .populate({
                path: 'boards',
                select: 'boardName', 
            })
            .populate({
                path: 'members.userId', 
                select: 'email fullname _id', 
            });
        if (!detailedWorkspace) {
            console.log('Workspace not found');
        }
        const transformedBoards = detailedWorkspace.boards.map(board => {
            const { _id, boardName } = board.toObject();
            return { boardId: _id, boardName };
        });
        const transformedMembers = detailedWorkspace.members.map(member => {
            const { userId, role } = member.toObject();
            return {
                userId: userId._id || null,
                email: userId?.email || null,
                fullname: userId?.fullname || null,
                role, 
            };
        });
        return {workspaceId:workspaceId, workspaceName: detailedWorkspace.workspaceName, boards: transformedBoards, members: transformedMembers, }; 
    } catch (err) {
        console.error('Error fetching workspace by ID:', err);
    }
}

async function getWorkspaceDetailsById(workspaceId) {
    try {
        const detailedWorkspace = await Workspace.findById(workspaceId)
            .populate({
                path: 'boards', 
            });
        if (!detailedWorkspace) {
            console.log('Workspace not found');
        }
        return {
            workspaceId: detailedWorkspace._id,
            workspaceName: detailedWorkspace.workspaceName,
            createdBy: detailedWorkspace.createdBy,
            members: detailedWorkspace.members,  
            boards: detailedWorkspace.boards.map(board => board.toObject())
        };
    } catch (err) {
        console.error('Error fetching workspace by ID:', err);
    }
}


async function add(workspaceData) {
    try {
        workspaceData.members = [{ userId :workspaceData.createdBy , role:"admin"}];
        const workspace = new Workspace(workspaceData);
        await workspace.save();
        return {workspaceName:workspace.workspaceName, workspaceId: workspace._id};
    } catch (err) {
    }
}

async function update(id, workspaceData) {
    try {
        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            id,
            { $set: workspaceData },
            { new: true }
        );
        return updatedWorkspace;
    } catch (err) {
    }
}

async function remove(workspaceId, moduleId) {
    try {
        const moduleUpdate = await Module.findOneAndUpdate(
            { _id: moduleId }, 
            { $pull: { workspaces: workspaceId } }, 
            { new: true } 
        );
        if (!moduleUpdate) {
            console.log('Module not found');
        }
        const workspace = await Workspace.findById(workspaceId);
        for (const boardId of workspace.boards) {
            await removeBoard(boardId);
        }
        const workspaceDelete = await Workspace.findByIdAndDelete(workspaceId);
        if (!workspaceDelete) {
            console.log('Workspace not found');
        }
        
        await Favourite.updateMany(
            { workspaces: workspaceId },
            { $pull: { workspaces: workspaceId } }
        );
        console.log(`Workspace with ID ${workspaceId} successfully removed from Module and deleted.`);
        return workspaceId;
    } catch (err) {
        console.error('Error removing workspace:', err);
    }
}

async function removeMember(workspaceId, userId, adminId) {
    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            console.log('Workspace not found');
        }
        
        if (workspace.createdBy.toString() !== adminId) {
            return 'You do not have permission to remove a user from this workspace';
        }
        
        const isMember = workspace.members.some(
            member => member.userId.toString() === userId
        );
        
        if (!isMember) {
            return 'User is not a member of this workspace';
        }
        
        workspace.members = workspace.members.filter(
            member => member.userId.toString() !== userId
        );
        
        await workspace.save();
        
        return 'User removed from workspace successfully';
    } catch (err) {
        console.error('Error removing member from workspace:', err);
    }
}


// Board Functions
async function addBoard(workspaceId, boardData) {
    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            console.log('Workspace not found');
        }
        boardData.workspaceName = workspace.workspaceName;
        boardData.workspaceId = workspaceId;
        const board = new Board(boardData);
        await board.save();
        workspace.boards.push(board._id);
        await workspace.save();
        let taskBoard =null;
        if (boardData.type === "Sprint") {
            const taskBoardData = {
                boardName: boardData.boardName + "-Task",
                type: "Task",
                createdById: boardData.createdById,
            };
            taskBoard = await addBoard(workspaceId, taskBoardData);
        }
        const response = [
            { boardId: board.id, boardName: board.boardName },
            taskBoard ? taskBoard[0] : null
        ];
        return response.filter(board => board !== null);
    } catch (err) {
        console.error('Error adding board to workspace:', err);
    }
}

async function removeBoard(boardId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            console.log('Board not found');
        }
        for (const groupId of board.groups) { 
            type=board.type;
            if(type=="Bug"){
                boardData = await devService.removeBugGroup(groupId);
            }else if(type=="Task"){
                boardData = await devService.removeTaskGroup(groupId);
            }else if(type=="Sprint"){
                boardData = await devService.removeSprintGroup(groupId);
            }else if(type=="Lead"){
                boardData = await crmService.removeLeadGroup(groupId);
            }else if(type=="Ticket"){
                boardData = await service.removeTicketGroup(groupId);
            }else{
                boardData = await workService.removeGroup(groupId);
            }
            console.log("Group Removed");
        }
        const workspace = await Workspace.findOne({ boards: boardId });
        if (!workspace) {
            console.log('Workspace not found for the specified board');
        }
        const response = [boardId];
        let taskBoardId = null;
        if (board.type === "Sprint") {
            const taskBoardName = board.boardName + "-Task";
            const taskBoard = await Board.findOne({ boardName: taskBoardName });
            if (taskBoard) {
                taskBoardId = await removeBoard(taskBoard._id);
            }
            if (taskBoardId) {
                response.push(taskBoardId[0]);
            }
        }
        workspace.boards = workspace.boards.filter(
            (id) => id.toString() !== boardId
        );
        await workspace.save();
        await Favourite.updateMany(
            { boards: boardId },
            { $pull: { boards: boardId } }
        );
        await Board.findByIdAndDelete(boardId);
        console.log("Board Removed");
        return response;
    } catch (err) {
        console.error('Error removing board:', err);
    }
}


async function updateBoard(boardId, boardData) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            console.log('Board not found');
        }
        const isBoardNameUpdated = boardData.boardName && boardData.boardName !== board.boardName;
        if (board.type === "Sprint" && isBoardNameUpdated) {
            const taskBoardName = board.boardName + "-Task";
            const taskBoard = await Board.findOne({ boardName: taskBoardName });
            if (taskBoard) {
                taskData={
                    boardName: boardData.boardName+"-Task",
                }
                await updateBoard(taskBoard._id,taskData);
            }
        }
        const updatedBoard = await Board.findByIdAndUpdate(
            boardId,
            { $set: boardData },
            { new: true }
        );
        return updatedBoard;
    } catch (err) {
        console.error('Error updating board:', err);
    }
}

async function updateGroup(groupId, groupData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
        }
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { $set: groupData },
            { new: true } 
        );
        return updatedGroup;
    } catch (err) {
        console.error('Error updating group:', err);
    }
}

async function addFavouriteWorkspace(workspaceId, favouriteId) {
    try {
      const updatedFavourite = await Favourite.findByIdAndUpdate(
        favouriteId,
        { $addToSet: { workspaces: workspaceId } },
        { new: true } 
      );
      if (!updatedFavourite) {
        console.log('Favourite not found');
      }
      return updatedFavourite;
    } catch (error) {
      console.error(`Error adding workspace to Favourite: ${error.message}`);
    }
  }

  async function removeFavouriteWorkspace(workspaceId, favouriteId) {
    try {
      const updatedFavourite = await Favourite.findByIdAndUpdate(
        favouriteId,
        { $pull: { workspaces: workspaceId } },
        { new: true }
      );
      if (!updatedFavourite) {
        console.log('Favourite not found');
      }
      return updatedFavourite;
    } catch (error) {
      console.error(`Error removing workspace from Favourite: ${error.message}`);
    }
  }
  
  async function addBoardToFavourite(boardId, favouriteId) {
    try {
      const updatedFavourite = await Favourite.findByIdAndUpdate(
        favouriteId,
        { $addToSet: { boards: boardId } },
        { new: true } 
      );
      if (!updatedFavourite) {
        console.log('Favourite not found');
      }
      return updatedFavourite;
    } catch (error) {
      console.error(`Error adding board to Favourite: ${error.message}`);
    }
  }

  async function removeBoardFromFavourite(boardId, favouriteId) {
    try {
      const updatedFavourite = await Favourite.findByIdAndUpdate(
        favouriteId,
        { $pull: { boards: boardId } }, 
        { new: true } 
      );
      if (!updatedFavourite) {
        console.log('Favourite not found');
      }
      return updatedFavourite;
    } catch (error) {
      console.error(`Error removing board from Favourite: ${error.message}`);
    }
  }

  async function getFavourite(userId, favouriteId) {
    try {
        const favourite = await Favourite.findById(favouriteId)
            .populate({
                path: 'workspaces',  
            })
            .populate({
                path: 'boards',  
            });
        if (!favourite) {
            console.log('Favourite not found');
        }
        const workspaceDetails = await Promise.all(
            favourite.workspaces.map(async (workspace) => {
                const isMember = workspace.members && workspace.members.some(member => member.userId.toString() === userId);
                if (isMember) {
                    return await getWorkspaceDetailsById(workspace._id);
                }
                return null;
            })
        );
        const boardDetails = await Promise.all(
            favourite.boards.map(async (board) => {
                const workspace = await Workspace.findOne({ boards: board._id });
                if (!workspace) return null;
                const isMember = workspace.members && workspace.members.some(member => member.userId.toString() === userId);
                if (isMember) {
                    return {
                        boardId: board._id,
                        boardName: board.boardName,
                        workspaceName: board.workspaceName,
                        workspaceId: board.workspaceId,
                        type: board.type,
                    };
                }
                return null;
            })
        );
        const filteredWorkspaceDetails = workspaceDetails.filter((workspace) => workspace !== null);
        const filteredBoardDetails = boardDetails.filter((board) => board !== null);
        return {
            favouriteId: favourite._id,
            favouriteName: favourite.favouriteName,
            description: favourite.description || '',
            workspaces: filteredWorkspaceDetails,
            boards: filteredBoardDetails,
        };
    } catch (err) {
        console.error('Error fetching favourite details:', err);
    }
}

async function isBoardInFavourite(boardId, favouriteId) {
    try {
      const favourite = await Favourite.findOne({
        _id: favouriteId,
        boards: { $in: [boardId] }, 
      });
      return {isFavourite: !!favourite};
    } catch (error) {
      console.error(`Error checking if board is in Favourite: ${error.message}`);
    }
  }
  
  async function isWorkspaceInFavourite(workspaceId, favouriteId) {
    try {
      const favourite = await Favourite.findOne({
        _id: favouriteId,
        workspaces: { $in: [workspaceId] },
      });
      return {isFavourite : !!favourite};
    } catch (error) {
      console.error(`Error checking if workspace is in Favourite: ${error.message}`);
    }
  }
  

module.exports = {
    query,
    getById,
    getWorkspaceDetailsById,
    add,
    update,
    remove,
    removeMember,
    addBoard,
    removeBoard,
    updateBoard,
    updateGroup,
    addFavouriteWorkspace,
    removeFavouriteWorkspace,
    addBoardToFavourite,
    removeBoardFromFavourite,
    getFavourite,
    isBoardInFavourite,
    isWorkspaceInFavourite,
};
