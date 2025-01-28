const jwt = require('jsonwebtoken');
const workspaceService = require('../services/workspace');
const workService = require('../services/workservice');
const devService = require('../services/devservice');
const service = require('../services/service');
const crmService = require('../services/crmservice');

async function isWorkspacePresent(workspaceId){
    return workspaceService.isWorkspacePresent(workspaceId);
}

async function isModulePresent(moduleId){
    return workspaceService.isModulePresent(moduleId);
}

async function isUserPresent(userId){
    return workspaceService.isUserPresent(userId);
}

async function isBoardPresent(boardId){
    return workspaceService.isBoardPresent(boardId);
}

async function isGroupPresent(groupId){
    return workspaceService.isGroupPresent(groupId);
}

async function getWorkspacesWithItemCounts(userId, moduleId, workspaceId) {
    try {
        if(!isUserPresent(userId) || !isModulePresent(moduleId) || !isWorkspacePresent(workspaceId)){
            return null;
        }
        let workspaces;
        if(moduleId==process.env.WORK){
            workspaces = await workService.getWorkspacesWithItemCounts(moduleId, userId, workspaceId);
        }else if(moduleId==process.env.CRM){
            workspaces = await crmService.getWorkspacesWithLeadCounts(moduleId, userId, workspaceId);
        }else if(moduleId==process.env.DEV){
            workspaces = await devService.getWorkspacesWithTaskCounts(moduleId, userId, workspaceId);
        }else if(moduleId==process.env.SERVICE){
            workspaces = await service.getWorkspacesWithTicketCounts(moduleId, userId, workspaceId);
        }
        return workspaces;
    } catch (err) {
        console.log('Failed to get workspaces: ' + err.message);
    }
}

async function getWorkspaces(userId, moduleId) {
    try {
        if(!isUserPresent(userId) || !isModulePresent(moduleId)){
            return null;
        }
        const workspaces = await workspaceService.query(moduleId, userId);
        return workspaces;
    } catch (err) {
        console.log('Failed to get workspaces: ' + err.message);
    }
}

async function getWorkspaceById(id) {
    try {
        if(!isWorkspacePresent(id)){
            return null;
        }
        const workspace = await workspaceService.getById(id);        
        if (!workspace) console.log('Workspace not found');
        return workspace;
    } catch (err) {
        console.log('Failed to get workspace: ' + err.message);
    }
}

async function getWorkspaceDetailsById(id) {
    try {
        if(!isWorkspacePresent(id)){
            return null;
        }
        const workspace = await workspaceService.getWorkspaceDetailsById(id);
        if (!workspace) console.log('Workspace not found');
        return workspace;
    } catch (err) {
        console.log('Failed to get workspace: ' + err.message);
    }
}

async function createWorkspace(workspaceData, moduleId, adminId) {
    try {
        if(!isModulePresent(moduleId) || !isUserPresent(adminId)){
            return null;
        }
        const newWorkspace = await workspaceService.add(workspaceData, moduleId, adminId);
        return newWorkspace;
    } catch (err) {
        console.log('Failed to create workspace: ' + err.message);
    }
}

async function updateWorkspace(id, updateData, moduleId, adminId) {
    try {
        if(!isWorkspacePresent(id) || !isModulePresent(moduleId) || !isUserPresent(adminId)){
            return null;
        }
        const updatedWorkspace = await workspaceService.update(id, updateData, moduleId, adminId);
        return updatedWorkspace;
    } catch (err) {
        console.log('Failed to update workspace: ' + err.message);
    }
}

async function deleteWorkspace(id, moduleId, adminId) {
    try {
        if(!isWorkspacePresent(id) || !isModulePresent(moduleId) || !isUserPresent(adminId)){
            return null;
        }
        const workspaceId = await workspaceService.remove(id, moduleId, adminId);
        return workspaceId;
    } catch (err) {
        console.log('Failed to delete workspace: ' + err.message);
    }
}

async function addBoardToWorkspace(id, boardData) {
    try {
        if(!isWorkspacePresent(id)){
            return null;
        }
        const updatedWorkspace = await workspaceService.addBoard(id, boardData);
        return updatedWorkspace;
    } catch (err) {
        console.log('Failed to add board to workspace'+ err.message );
    }
}

async function removeBoardFromWorkspace(boardId) {
    try {
        if(!isBoardPresent(boardId)){
            return null;
        }
        const updatedWorkspace = await workspaceService.removeBoard(boardId);
        return updatedWorkspace;
    } catch (err) {
        console.log('Failed to remove board from workspace'+err.message );
    }
}

async function updateBoardInWorkspace(boardId, boardData) {
    try {
        if(!isBoardPresent(boardId)){
            return null;
        }
        const updatedWorkspace = await workspaceService.updateBoard(boardId, boardData);
        return updatedWorkspace;
    } catch (err) {
        console.log('Failed to update board in workspace'+ err.message );
    }
}

async function getBoardById(boardId) {
    try {
        if(!isBoardPresent(boardId)){
            return null;
        }
        const type = await workService.getType(boardId);
        let boardData;
        if(type=="Bug"){
            boardData = await devService.getBugBoard(boardId);
        }else if(type=="Task"){
            boardData = await devService.getTaskBoard(boardId);
        }else if(type=="Sprint"){
            boardData = await devService.getSprintBoard(boardId);
        }else if(type=="Lead"){
            boardData = await crmService.getLeadBoard(boardId);
        }else if(type=="Ticket"){
            boardData = await service.getTicketBoard(boardId);
        }else{
            boardData = await workService.getBoard(boardId);
        }
        
        return boardData;
    } catch (err) {
        console.error('Error in getBoardById:', err);
    }
}


// Group Functions

async function addGroupToBoard(boardId, groupData, itemId) {
    try {
        if(!isBoardPresent(boardId)){
            return null;
        }
        const type = await workService.getType(boardId);
        let boardData;
        if(type=="Bug"){
            boardData = await devService.addBugGroup(boardId, groupData, itemId);
        }else if(type=="Task"){
            boardData = await devService.addTaskGroup(boardId, groupData, itemId);
        }else if(type=="Sprint"){
            boardData = await devService.addSprintGroup(boardId, groupData, itemId);
        }else if(type=="Lead"){
            boardData = await crmService.addLeadGroup(boardId, groupData, itemId);
        }else if(type=="Ticket"){
            boardData = await service.addTicketGroup(boardId, groupData, itemId);
        }else{
            boardData = await workService.addGroup(boardId, groupData, itemId);
        }
        
        return boardData;
    } catch (err) {
        console.log('Failed to add group to board'+ err.message );
    }
}

async function removeGroupFromBoard(groupId,type) {
    try {
        if(!isGroupPresent(groupId)){
            return null;
        }
        let boardData;
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
        return boardData;
    } catch (err) {
        console.log('Failed to remove group from board'+ err.message );
    }
}

async function updateGroupInBoard(groupId, groupData) {
    try {
        if(!isGroupPresent(groupId)){
            return null;
        }
        let updatedGroup = await workspaceService.updateGroup(groupId,groupData);        
        return updatedGroup;
    } catch (err) {
        console.log('Failed to update group in board'+err.message );
    }
}

async function addItemToGroup(groupId, itemData, type, boardId) {
    try {
        if(!isGroupPresent(groupId) || !isBoardPresent(boardId)){
            return null;
        }
        let updatedGroup;
        if(type=="Bug"){
            updatedGroup = await devService.addBugToGroup(groupId,itemData);
        }else if(type=="Task"){
            updatedGroup = await devService.addTaskToGroup(groupId,itemData);
        }else if(type=="Sprint"){
            updatedGroup = await devService.addSprintToGroup(groupId,itemData, boardId);
        }else if(type=="Lead"){
            updatedGroup = await crmService.addLeadToGroup(groupId,itemData);
        }else if(type=="Ticket"){
            updatedGroup = await service.addTicketToGroup(groupId,itemData);
        }else{
            updatedGroup = await workService.addItemToGroup(groupId,itemData);
        }
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add item to group'+ err.message );
    }
}

async function addItem(itemData, type, boardId) {
    try {
        if(!isBoardPresent(boardId)){
            return null;
        }
        let item;
        if(type=="Bug"){
            item = await devService.addBug(itemData);
        }else if(type=="Task"){
            item = await devService.addTask(itemData);
        }else if(type=="Sprint"){
            item = await devService.addSprint(itemData, boardId);
        }else if(type=="Lead"){
            item = await crmService.addLead(itemData);
        }else if(type=="Ticket"){
            item = await service.addTicket(itemData);
        }else{
            item = await workService.addItem(itemData);
        }
        return item;
    } catch (err) {
        console.log('Failed to create item '+ err.message );
    }
}

async function removeItemFromGroup(itemId, type) {
    try {
        let updatedGroup;
        if(type=="Bug"){
            updatedGroup = await devService.removeBugFromGroup(itemId);
        }else if(type=="Task"){
            updatedGroup = await devService.removeTaskFromGroup(itemId);
        }else if(type=="Sprint"){
            updatedGroup = await devService.removeSprintFromGroup(itemId);
        }else if(type=="Lead"){
            updatedGroup = await crmService.removeLeadFromGroup(itemId);
        }else if(type=="Ticket"){
            updatedGroup = await service.removeTicketFromGroup(itemId);
        }else{
            updatedGroup = await workService.removeItemFromGroup(itemId);
        }
        console.log("Item removed");
        return updatedGroup;
    } catch (err) {
        console.log('Failed to remove item from group' + err.message );
    }
}

async function updateItemInGroup(itemId, itemData, type, boardId, userId) {
    try {
        if(!isBoardPresent(boardId) || !isUserPresent(userId)){
            return null;
        }
        itemData._id=itemId;
        let item;
        if(type=="Bug"){
            item = await devService.updateBugInGroup(itemData, boardId, userId);
        }else if(type=="Task"){
            item = await devService.updateTaskInGroup(itemData, boardId, userId);
        }else if(type=="Sprint"){
            item = await devService.updateSprintInGroup(itemData);
        }else if(type=="Lead"){
            item = await crmService.updateLeadInGroup(itemData);
        }else if(type=="Ticket"){
            item = await service.updateTicketInGroup(itemData, boardId, userId);
        }else{
            item = await workService.updateItemInGroup(itemData, boardId, userId);
        }
        return item;
    } catch (err) {
        console.log('Failed to update item in group'+err.message );
    }
}

async function addMembersToItem(itemId, userId, type, adminId) {
    try {
        if(!isUserPresent(userId) || !isUserPresent(adminId)){
            return null;
        }
        let item;
        if(type=="reporter"){
            item = await devService.addMembersToReporter(itemId, userId, adminId);
        }else if(type=="person"){
            item = await devService.addMembersToTask(itemId, userId, adminId);
        }else if(type=="developer"){
            item = await devService.addMembersToDeveloper(itemId, userId, adminId);
        }else if(type=="agent"){
            item = await service.addMembersToAgent(itemId, userId, adminId);
        }else if(type=="employee"){
            item = await service.addMembersToEmployee(itemId, userId, adminId);
        }else{
            item = await workService.addMembersToItem(itemId, userId, adminId);
        }
        return item;
    } catch (err) {
        console.log('Failed to add members to item'+err.message);
    }
}

async function removeMembersFromItem(itemId, userId, type, adminId) {
    try {
        if(!isUserPresent(userId) || !isUserPresent(adminId)){
            return null;
        }
        let item;
        if(type=="reporter"){
            item = await devService.removeMembersFromReporter(itemId, userId, adminId);
        }else if(type=="person"){
            item = await devService.removeMembersFromTask(itemId, userId, adminId);
        }else if(type=="developer"){
            item = await devService.removeMembersFromDeveloper(itemId, userId, adminId);
        }else if(type=="agent"){
            item = await service.removeMembersFromAgent(itemId, userId, adminId);
        }else if(type=="employee"){
            item = await service.removeMembersFromEmployee(itemId, userId, adminId);
        }else{
            item = await workService.removeMembersFromItem(itemId, userId, adminId);
        }
        return item;
    } catch (err) {
        console.log('Failed to remove members from item: ' + err.message);
    }
}

async function addFavouriteWorkspace(workspaceId, type) {
    try {
        if(!isWorkspacePresent(workspaceId)){
            return null;
        }
        let favouriteWorkspace;
        if(type=="work-management"){
            favouriteWorkspace = await workspaceService.addFavouriteWorkspace(workspaceId, process.env.FAV_WORK);
        }else if(type=="crm"){
            favouriteWorkspace = await workspaceService.addFavouriteWorkspace(workspaceId, process.env.FAV_CRM);
        }else if(type=="dev"){
            favouriteWorkspace = await workspaceService.addFavouriteWorkspace(workspaceId, process.env.FAV_DEV);
        }else if(type=="service"){
            favouriteWorkspace = await workspaceService.addFavouriteWorkspace(workspaceId, process.env.FAV_SERVICE);
        }
        return favouriteWorkspace;
    } catch (err) {
        console.log('Failed to remove members from item: ' + err.message);
    }
}

async function removeFavouriteWorkspace(workspaceId, type) {
    try {
        if(!isWorkspacePresent(workspaceId)){
            return null;
        }
        let favouriteWorkspace;
        if(type=="work-management"){
            favouriteWorkspace = await workspaceService.removeFavouriteWorkspace(workspaceId, process.env.FAV_WORK);
        }else if(type=="crm"){
            favouriteWorkspace = await workspaceService.removeFavouriteWorkspace(workspaceId, process.env.FAV_CRM);
        }else if(type=="dev"){
            favouriteWorkspace = await workspaceService.removeFavouriteWorkspace(workspaceId, process.env.FAV_DEV);
        }else if(type=="service"){
            favouriteWorkspace = await workspaceService.removeFavouriteWorkspace(workspaceId, process.env.FAV_SERVICE);
        }
        return favouriteWorkspace;
    } catch (err) {
        console.log('Failed to remove members from item: ' + err.message);
    }
}

async function addBoardToFavourite(boardId, type) {
    try {
        if(!isBoardPresent(boardId)){
            return null;
        }
        let favouriteWorkspace;
        if(type=="work-management"){
            favouriteWorkspace = await workspaceService.addBoardToFavourite(boardId, process.env.FAV_WORK);
        }else if(type=="crm"){
            favouriteWorkspace = await workspaceService.addBoardToFavourite(boardId, process.env.FAV_CRM);
        }else if(type=="dev"){
            favouriteWorkspace = await workspaceService.addBoardToFavourite(boardId, process.env.FAV_DEV);
        }else if(type=="service"){
            favouriteWorkspace = await workspaceService.addBoardToFavourite(boardId, process.env.FAV_SERVICE);
        }
        return favouriteWorkspace;
    } catch (err) {
        console.log('Failed to remove members from item: ' + err.message);
    }
}

async function removeBoardFromFavourite(boardId, type) {
    try {
        if(!isBoardPresent(boardId)){
            return null;
        }
        let favouriteWorkspace;
        if(type=="work-management"){
            favouriteWorkspace = await workspaceService.removeBoardFromFavourite(boardId, process.env.FAV_WORK);
        }else if(type=="crm"){
            favouriteWorkspace = await workspaceService.removeBoardFromFavourite(boardId, process.env.FAV_CRM);
        }else if(type=="dev"){
            favouriteWorkspace = await workspaceService.removeBoardFromFavourite(boardId, process.env.FAV_DEV);
        }else if(type=="service"){
            favouriteWorkspace = await workspaceService.removeBoardFromFavourite(boardId, process.env.FAV_SERVICE);
        }
        return favouriteWorkspace;
    } catch (err) {
        console.log('Failed to remove members from item: ' + err.message);
    }
}

async function getFavourite(userId, type) {
    try {
        if(!isUserPresent(userId)){
            return null;
        }
        let favouriteWorkspace;
        if(type=="work-management"){
            favouriteWorkspace = await workspaceService.getFavourite(userId, process.env.FAV_WORK);
        }else if(type=="crm"){
            favouriteWorkspace = await workspaceService.getFavourite(userId, process.env.FAV_CRM);
        }else if(type=="dev"){
            favouriteWorkspace = await workspaceService.getFavourite(userId, process.env.FAV_DEV);
        }else if(type=="service"){
            favouriteWorkspace = await workspaceService.getFavourite(userId, process.env.FAV_SERVICE);
        }
        return favouriteWorkspace;
    } catch (err) {
        console.log('Failed to remove members from item: ' + err.message);
    }
}

async function isBoardInFavourite(boardId, type) {
    try {
        if(!isBoardPresent(boardId)){
            return null;
        }
        let favouriteBoard;
        if(type=="work-management"){
            favouriteBoard = await workspaceService.isBoardInFavourite(boardId, process.env.FAV_WORK);
        }else if(type=="crm"){
            favouriteBoard = await workspaceService.isBoardInFavourite(boardId, process.env.FAV_CRM);
        }else if(type=="dev"){
            favouriteBoard = await workspaceService.isBoardInFavourite(boardId, process.env.FAV_DEV);
        }else if(type=="service"){
            favouriteBoard = await workspaceService.isBoardInFavourite(boardId, process.env.FAV_SERVICE);
        }
        return favouriteBoard;
    } catch (err) {
        console.log('Failed to remove members from item: ' + err.message);
    }
}

async function isWorkspaceInFavourite(workspaceId, type) {
    try {
        if(!isWorkspacePresent(workspaceId)){
            return null;
        }
        let favouriteWorkspace;
        if(type=="work-management"){
            favouriteWorkspace = await workspaceService.isWorkspaceInFavourite(workspaceId, process.env.FAV_WORK);
        }else if(type=="crm"){
            favouriteWorkspace = await workspaceService.isWorkspaceInFavourite(workspaceId, process.env.FAV_CRM);
        }else if(type=="dev"){
            favouriteWorkspace = await workspaceService.isWorkspaceInFavourite(workspaceId, process.env.FAV_DEV);
        }else if(type=="service"){
            favouriteWorkspace = await workspaceService.isWorkspaceInFavourite(workspaceId, process.env.FAV_SERVICE);
        }
        return favouriteWorkspace;
    } catch (err) {
        console.log('Failed to remove members from item: ' + err.message);
    }
}

async function getNotifications(adminId) {
    try {
        if(!isUserPresent(adminId)){
            return null;
        }
        let notification = await workspaceService.getNotifications(adminId);
        return notification;
    } catch (err) {
        console.log('Failed to get notifications: ' + err.message);
    }
}

async function updateNotifications(adminId, notifications) {
    try {
        if(!isUserPresent(adminId)){
            return null;
        }
        let notification = await workspaceService.updateNotifications(adminId, notifications);
        return notification;
    } catch (err) {
        console.log('Failed to update notifications: ' + err.message);
    }
}

module.exports = {
    getWorkspaces,
    getWorkspaceById,
    getWorkspaceDetailsById,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addBoardToWorkspace,
    removeBoardFromWorkspace,
    updateBoardInWorkspace,
    getBoardById,
    addGroupToBoard,
    removeGroupFromBoard,
    updateGroupInBoard,
    addItemToGroup,
    addItem,
    removeItemFromGroup,
    updateItemInGroup,
    addMembersToItem,
    removeMembersFromItem,
    addFavouriteWorkspace,
    removeFavouriteWorkspace,
    addBoardToFavourite,
    removeBoardFromFavourite,
    getFavourite,
    isBoardInFavourite,
    isWorkspaceInFavourite,
    getWorkspacesWithItemCounts,
    getNotifications,
    updateNotifications,
};